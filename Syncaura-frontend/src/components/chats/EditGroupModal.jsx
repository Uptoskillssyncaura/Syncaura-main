import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Camera, UserMinus, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { updateGroup, addMembersToGroup, removeMemberFromGroup, fetchChannels } from "../../redux/features/chatThunks";
import Avatar from "./Avatar";

export default function EditGroupModal({ isOpen, onClose, chat }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [groupName, setGroupName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && chat) {
      setGroupName(chat.name);
      setImageFile(null);
      setImagePreview(null);
      fetchGroupDetails();
      fetchAllUsers();
    }
  }, [isOpen, chat]);

  const fetchGroupDetails = async () => {
    try {
      const res = await api.get(`/channels/${chat.id}`);
      if (res.data && res.data.members) {
        setMembers(res.data.members);
      }
    } catch (err) {
      console.error("Failed to fetch group details", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/users/all");
      setAllUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveDetails = async () => {
    if (!groupName.trim()) return toast.error("Group name cannot be empty");
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", groupName);
      if (imageFile) {
        formData.append("profile_pic", imageFile);
      }
      await dispatch(updateGroup({ channelId: chat.id, formData })).unwrap();
      toast.success("Group details updated");
      dispatch(fetchChannels());
    } catch (err) {
      toast.error(err || "Failed to update group");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await dispatch(addMembersToGroup({ channelId: chat.id, userIds: [userId] })).unwrap();
      toast.success("Member added");
      fetchGroupDetails();
      dispatch(fetchChannels());
    } catch (err) {
      toast.error(err || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (userId === user.id) return toast.error("You cannot remove yourself");
    
    try {
      await dispatch(removeMemberFromGroup({ channelId: chat.id, userId })).unwrap();
      toast.success("Member removed");
      fetchGroupDetails();
      dispatch(fetchChannels());
    } catch (err) {
      toast.error(err || "Failed to remove member");
    }
  };

  if (!isOpen) return null;

  const availableUsers = allUsers.filter(u => !members.some(m => m.id === u.id));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#2E2F2F] rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Group</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-300">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-1 space-y-6">
          {/* Group Picture & Name */}
          <div className="flex flex-col items-center gap-6 pt-2">
            <div className="relative group">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-[#2E2F2F] shadow-lg transition-transform group-hover:scale-105" />
              ) : chat.profile_pic ? (
                <img src={chat.profile_pic} alt="Group" className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-[#2E2F2F] shadow-lg transition-transform group-hover:scale-105" />
              ) : (
                <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-semibold bg-gradient-to-b ${chat.gradient || "from-blue-500 to-blue-700"} border-4 border-white dark:border-[#2E2F2F] shadow-lg transition-transform group-hover:scale-105`}>
                  {chat.avatar || chat.name?.charAt(0) || "U"}
                </div>
              )}
              
              <label className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-2.5 sm:p-3 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 shadow-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-white dark:border-[#2E2F2F]">
                <Camera size={18} className="sm:w-5 sm:h-5" />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <div className="w-full mt-2">
              <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-widest pl-1">Group Name</label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="Enter group name..."
                  className="flex-1 bg-gray-50 dark:bg-[#1E1F1F] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-base sm:text-lg font-medium"
                />
                <button 
                  onClick={handleSaveDetails} 
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-blue-500/20"
                >
                  Save
                </button>
              </div>
            </div>
          </div>

          <hr className="dark:border-gray-700" />

          {/* Members List */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase">Members ({members.length})</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {members.map(m => (
                <div key={m.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                  <span className="text-gray-800 dark:text-white font-medium">{m.name} {m.id === user?.id ? "(You)" : ""}</span>
                  {m.id !== user?.id && (
                    <button 
                      onClick={() => handleRemoveMember(m.id)}
                      className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-md transition-colors"
                      title="Remove member"
                    >
                      <UserMinus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <hr className="dark:border-gray-700" />

          {/* Add Members */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase">Add People</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {availableUsers.length === 0 ? (
                <p className="text-gray-500 text-sm italic">No other users available</p>
              ) : (
                availableUsers.map(u => (
                  <div key={u.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <span className="text-gray-800 dark:text-white font-medium">{u.name}</span>
                    <button 
                      onClick={() => handleAddMember(u.id)}
                      className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-1.5 rounded-md transition-colors"
                      title="Add member"
                    >
                      <UserPlus size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
