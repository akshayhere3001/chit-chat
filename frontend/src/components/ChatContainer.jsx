import React, { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Loader } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { formatTime } from "../lib/utils.js";

const ChatContainer = () => {
  const { messages, isMessagesLoading, selectedUser, getMessages, listenToMessages, clearToMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    listenToMessages();

    return () => clearToMessage();
  }, [selectedUser._id, getMessages, listenToMessages, clearToMessage]);


  useEffect(() => {
    if (messagesEndRef.current && messages) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex flex-1 flex-col overflow-auto">
        <ChatHeader />
        <div className="flex justify-center items-center flex-1">
          <Loader className="animate-spin" />
        </div>
        <MessageInput />
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 bg-[#f7f7f7]">
        {messages.map((msg, index) => (
          <div
            key={msg._id || `msg-${index}`}
            className={`flex mb-2 ${msg.senderId === authUser._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg text-sm ${msg.senderId === authUser._id ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                }`}
            >
              {msg.image && (
                <img src={msg.image} alt="Attachment" className="sm:max-w-[200px] rounded-md mb-2 bg-white" />
              )}
              <p>{msg.text}</p>
              <span className="text-xs text-gray-700 block text-right mt-1">
                {formatTime(msg.createdAt)}
              </span>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
