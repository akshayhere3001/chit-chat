import React, { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MessageInput = () => {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const {sendMessages} = useChatStore();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // checking if it is an img
        if(!file.type.startsWith("image/")){
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader(file);
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(file);
    }

    const removeImage = () => {
        setImagePreview(null)

        if(fileInputRef.current){
            fileInputRef.current.value = "" 
        }
    }
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
    
        try {
          await sendMessages({
            text: text.trim(),
            image: imagePreview,
          });

          // Clear form
          setText("");
          setImagePreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (error) {
          console.error("Failed to send message:", error);
        }
      };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-[#292929]"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white
              flex items-center justify-center"
              type="button"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="w-full py-2 pl-2 border rounded-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={22} className='text-black cursor-pointer'/>
          </button>
        </div>
        <button
          type="submit"
          className="cursor-pointer"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} className='text-black'/>
        </button>
      </form>
    </div>
  )
}

export default MessageInput