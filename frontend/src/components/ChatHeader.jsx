import { X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import dummy_img from '/assets/avatar.png';
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="">
          <div className="relative size-10 rounded-full border border-[#292929] overflow-hidden">
            <img src={selectedUser.profilePic || dummy_img} alt={selectedUser.fullName} className="w-full h-full object-cover" />
        </div>
        </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3>
            <p className="text-sm text-[#292929]">
              {onlineUsers.includes(selectedUser._id) ? "online" : "offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
};
export default ChatHeader;