import { ArrowLeft, MoreVertical, Phone, Search, Edit2, FileImage } from "lucide-react";
import { toast } from "react-toastify";
import Avatar from "../Avatar";
import { useState, useRef, useEffect } from "react";
import MediaDocsModal from "../MediaDocsModal";
import EditGroupModal from "../EditGroupModal";

export default function ChatHeader({ chat, onBack, setOpen }) {
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setOpen(true);
  };

  const handlePhoneClick = (e) => {
    e.stopPropagation();
    toast.info("Calling feature is not implemented yet.");
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
    toast.info("Search feature is not implemented yet.");
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  const handleBackClick = (e) => {
    e.stopPropagation();
    onBack();
  };

  const isGroup = chat?.max_members > 2;

  return (
    <div className="flex-shrink-0 h-14 md:h-16 flex items-center justify-between px-3 md:px-4 border-b bg-[#FFFFFF] dark:bg-[#2E2F2F]">
      {/* Profile section */}
      <div
        onClick={handleProfileClick}
        className="flex flex-1 items-center gap-2 md:gap-3 cursor-pointer min-w-0"
      >
        {/* Back button (mobile only) */}
        <button onClick={handleBackClick} className="md:hidden btn-hover">
          <ArrowLeft size={20} className="text-black dark:text-gray-300" />
        </button>

        <Avatar label={chat.avatar || chat.name?.charAt(0)} gradient={chat.gradient} src={chat.profilePic || chat.profile_pic} />

        <div className="min-w-0">
          <p className="font-semibold text-base md:text-lg text-black dark:text-white truncate">
            {chat.name}
          </p>
          <p className="text-sm text-black dark:text-white capitalize">
            {isGroup ? "Group Chat" : (chat?.other_user_role || "User")}
          </p>
        </div>
      </div>

      {/* Action icons */}
      <div className="flex gap-4 xl:gap-7 text-gray-600 dark:text-gray-400 relative">
        <Phone onClick={handlePhoneClick} className="cursor-pointer" />
        <Search onClick={handleSearchClick} className="cursor-pointer" />

        {/* Three dot menu */}
        <div className="relative" ref={dropdownRef}>
          <MoreVertical
            size={20}
            onClick={handleMoreClick}
            className="cursor-pointer hover:text-black dark:hover:text-white transition-colors"
          />

          {showDropdown && (
            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-[#2E2F2F] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1.5 z-50">
              {isGroup && (
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    setShowEditGroupModal(true);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white text-sm flex items-center gap-3 transition-colors"
                >
                  <Edit2 size={16} />
                  Edit Group
                </button>
              )}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowMediaModal(true);
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-black dark:text-white text-sm flex items-center gap-3 transition-colors"
              >
                <FileImage size={16} />
                Media, Links, and Docs
              </button>
            </div>
          )}
        </div>
      </div>
      
      <MediaDocsModal 
        isOpen={showMediaModal} 
        onClose={() => setShowMediaModal(false)} 
        files={chat?.files || []} 
      />

      <EditGroupModal
        isOpen={showEditGroupModal}
        onClose={() => setShowEditGroupModal(false)}
        chat={chat}
      />
    </div>
  );
}
