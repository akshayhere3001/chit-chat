import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/message/users');
            set({ users: res.data.data || [] });
        } catch (error) {
            console.log("Error while fetching users: ", error);
            toast.error(error?.response?.data?.message || "Failed to fetch users.");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({ messages: res.data.data });
        } catch (error) {
            console.log("Error while fetching messages: ", error);
            toast.error(error?.response?.data?.message || "Failed to fetch messages.");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessages: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) {
            toast.error("No user selected.");
            return;
        }
    
        // Generate a temporary message
        const tempMessage = {
            ...messageData,
            _id: `temp-${Date.now()}`, // Temporary ID
            senderId: useAuthStore.getState().authUser._id,
            createdAt: new Date().toISOString(),
        };
    
        // Add the temp message to UI immediately
        set({ messages: [...messages, tempMessage] });
    
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            
            // Replace temp message with actual message
            set((state) => ({
                messages: state.messages.map(msg => 
                    msg._id === tempMessage._id ? res.data.data : msg
                ),
            }));
        } catch (error) {
            console.error("Error occurred while sending message: ", error);
            toast.error(error?.response?.data?.message || "Failed to send message.");
    
            // Remove the temp message if sending fails
            set((state) => ({
                messages: state.messages.filter(msg => msg._id !== tempMessage._id),
            }));
        }
    },
    

    listenToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set((state) => {
                // Avoid duplicate messages
                const isDuplicate = state.messages.some(msg => msg._id === newMessage._id);
                if (isDuplicate) return state;
    
                return {
                    messages: [...state.messages, newMessage],
                };
            });
        });
    },
    

    clearToMessage: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
