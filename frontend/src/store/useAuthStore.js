import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuthStore = create((set, get) => ({
    authUser: null,  
    isSigningIn: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        set({ isCheckingAuth: true })
        try {
            const response = await axiosInstance.get('/auth/check');
            set({authUser: response.data});
            get().connectSocket()
        } catch (error) {
            console.log("Error in Check Auth: ", error)
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup: async (data) => {
        set({ isSigningIn: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data)
            set({ authUser: res.data });
            toast.success("Account created successfully")

            get().connectSocket()
        } catch (error) {
            console.log("Error Occurred While Sign In: ", error);
            toast.error(error.res.data.message)
        } finally {
            set({ isSigningIn: false })
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data })
            toast.success("User Logged in Successfully");

            get().connectSocket()
        } catch (error) {
            console.log("Error while occurred while login: ", error);
            toast.error(error.res.data.message);
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout')
            set({authUser: null});
            toast.success("Logged out successfully")

            get().disconnectSocket()
        } catch (error) {
            console.log("Error while occurred while logout: ", error);
            toast.error(error.res.data.message)
        }
    }, 

    updateProfilePic: async (data) => {
        set({isUpdatingProfile: true})
        try {
            const res = await axiosInstance.put('/auth/update-profile', data)
            set({authUser: res.data})
            toast.success("Profile uploaded successfully")
        } catch (error) {
            console.log("Error while updating profile pic: ", error);
            toast.error(error.res.data.message);
        } finally {
            set({isUpdatingProfile: false})
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if(!authUser || get().socket?.connected) return;
        
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            }
        })
        socket.connect();

        set({socket: socket})
        socket.on("getOnlineUsers", (userIds) => {
            set({onlineUsers: userIds})
        })
    },
    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    },

 }))