import { Message } from "../models/messages.model.js";
import { User } from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary';
import { getReceiverSocketId, io } from "../utils/socket.js";

// goal: 
        // we have to fetch all the user but not loggedIn user
        // we have to show all user in the sidebar for chatting
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        // this will find all user but not logged in user with the the help of (ne: not equal)
        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUser  // ne: means not equals to
            }
        }).select("-password");

        res.status(200).json({
            message: "User Successfully fetched for Sidebar",
            data: filteredUsers,
        })
    } catch (error) {
        console.log("Error While getting users for sidebar: ", error.message);
        res.status(500).json({message: "Failed To fetch User in Sidebar"});
    }
}

// goal:
        // we have to get the messages of the user (based on their id)
export const getMessages = async (req, res) => {
    try {
        const {id: userToChatId} = req.params;      // id of user who i want to send message (other person)
        const myId = req.user._id // id of user who wants to send message (basically mine)
    
    
        // basically we are doing get all messages -- dono side se (mene kiye usko wo bhi, usne kiye mujhe wo bhi)
        const messages = await Message.find({
            $or: [
                {senderId: myId, recieverId: userToChatId},  // sender is me -- reciever is other person
                {senderId: userToChatId, recieverId: myId},  // sender is other person -- reciever is me
            ]
        })
    
        res.status(200).json({
            message: "Messages fetched Successfully",
            data: messages,
        })
    } catch (error) {
        console.log("Error Occurred While Getting Messages: ", error.message);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: recieverId} = req.params;    // this is other person
        const senderId = req.user._id;          // this is me

        let imageUrl;
        if(image){
           const uploadResponse = await cloudinary.uploader.upload(image);
           imageUrl = uploadResponse.secure_url;
        }

        // create new message
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image: imageUrl,
        })

        // save message
        await newMessage.save();
        
        const recieverSocketId = getReceiverSocketId(recieverId)

        if(recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json({
            message: "New Message Created Successfully",
            data: newMessage
        })
        return newMessage
    } catch (error) {
        console.log("Error Occurred While Sending Message: ", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}