import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createGroupChat } from "../../../redux/features/chatThunks";
import Avatar from "../Avatar";

export default function CreateGroupModal({ onClose, usersList }) {
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    const finalGroupName = groupName.trim() || "New Group";
    
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to add to the group");
      return;
    }

    setIsLoading(true);
    dispatch(createGroupChat({ name: finalGroupName, userIds: selectedUsers }))
      .unwrap()
      .then(() => {
        setIsLoading(false);
        onClose();
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Failed to create group:", err);
        alert("Failed to create group chat.");
      });
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#2E2F2F] rounded-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-semibold text-black dark:text-white">New Group Chat</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black dark:hover:text-white">
            ✕
          </button>
        </div>

        <div className="p-4 border-b dark:border-gray-700">
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group Subject"
            className="w-full bg-gray-100 dark:bg-[#1A1A1A] text-black dark:text-white px-3 py-2 rounded-lg outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {usersList.length > 0 ? (
            usersList.map((user) => (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedUsers.includes(user.id)
                    ? "bg-[#E2EBFF] dark:bg-[#144344]"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <div className="relative">
                  <Avatar label={user.name?.charAt(0) || "U"} src={user.profilePic || user.profile_pic} />
                  {selectedUsers.includes(user.id) && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white dark:border-[#2E2F2F]"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-black dark:text-white truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-gray-500">Loading users...</div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700">
          <button
            onClick={handleCreateGroup}
            disabled={isLoading}
            className={`w-full text-white font-medium py-2 rounded-lg transition-colors ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isLoading ? "Creating..." : `Create Group (${selectedUsers.length} selected)`}
          </button>
        </div>
      </div>
    </div>
  );
}
