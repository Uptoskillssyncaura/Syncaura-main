import {
  Edit3,
  Search,
  MoreVertical,
  BookmarkCheck,
  BellOff,
  CircleMinus,
  VolumeX,
  Users,
} from "lucide-react";
import Avatar from "../Avatar";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { createPrivateChat } from "../../../redux/features/chatThunks";
import CreateGroupModal from "./CreateGroupModal";

export default function Sidebar({
  chats,
  selectedChat,
  onSelect,
  onViewChange,
}) {
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [chatList, setChatList] = useState(chats);
  const [filteredItems, setFilteredItems] = useState(chats);
  const [currentView, setCurrentView] = useState("chat"); // 'chat', 'archived', 'starred'
  const [selectMode, setSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const selectMenuRef = useRef(null);
  const dispatch = useDispatch();

  // Fetch users when modal opens
  useEffect(() => {
    if (showNewChatModal || showCreateGroupModal) {
      import("../../../config/axios").then(({ default: api }) => {
        api
          .get("/users/all")
          .then((res) => setUsersList(res.data))
          .catch(console.error);
      });
    }
  }, [showNewChatModal, showCreateGroupModal]);

  const handleCreateNewChat = (userId) => {
    dispatch(createPrivateChat(userId))
      .unwrap()
      .then(() => {
        setShowNewChatModal(false);
      })
      .catch((err) => {
        console.error("Failed to create chat:", err);
        alert(
          "Failed to start chat. Your session may have expired. Please refresh the page and try logging in again.",
        );
      });
  };

  // Sample starred messages data
  const [starredMessages] = useState([
    {
      id: 1,
      sender: "You",
      receiver: "Aarav M",
      time: "2:30 PM",
      text: "Ya I'm free. What do you want to ask?",
      isOwn: true,
    },
    {
      id: 2,
      sender: "Aarav M",
      receiver: "You",
      time: "2:30 PM",
      text: "Hey bro, you free ah? Need to ask something.",
      isOwn: false,
    },
  ]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        selectMenuRef.current &&
        !selectMenuRef.current.contains(event.target)
      ) {
        setShowSelectMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update chatList when chats prop changes
  useEffect(() => {
    setChatList(chats);
  }, [chats]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(search.trim());
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let itemsToFilter = chatList;

    // Filter by view type first
    if (currentView === "archived") {
      itemsToFilter = chatList.filter((item) => item.isArchived);
    } else if (currentView === "chat") {
      itemsToFilter = chatList.filter((item) => !item.isArchived);
    }

    // Then apply search filter
    if (!debouncedValue) {
      setFilteredItems(itemsToFilter);
      return;
    }

    const searchData = itemsToFilter.filter((item) =>
      item.name.toLowerCase().includes(debouncedValue.toLowerCase()),
    );

    setFilteredItems(searchData);
  }, [debouncedValue, chatList, currentView]);

  const handleMenuItemClick = (action) => {
    setShowMenu(false);

    switch (action) {
      case "chat":
        setCurrentView("chat");
        setSelectMode(false);
        setSelectedChats([]);
        if (onViewChange) onViewChange("chat");
        break;
      case "archived":
        setCurrentView("archived");
        setSelectMode(false);
        setSelectedChats([]);
        if (onViewChange) onViewChange("archived");
        break;
      case "starred":
        setCurrentView("starred");
        setSelectMode(false);
        setSelectedChats([]);
        if (onViewChange) onViewChange("starred");
        break;
      case "select":
        // If we're in starred view, switch to chat view first
        if (currentView === "starred") {
          setCurrentView("chat");
          if (onViewChange) onViewChange("chat");
        }
        setSelectMode(!selectMode);
        setSelectedChats([]);
        break;
      case "markAllRead":
        // If we're in starred view, switch to chat view first
        if (currentView === "starred") {
          setCurrentView("chat");
          if (onViewChange) onViewChange("chat");
        }
        // Mark all chats as read (set unread to 0)
        setChatList((prevChats) =>
          prevChats.map((chat) => ({ ...chat, unread: 0 })),
        );
        break;
    }
  };

  const handleChatSelect = (chat) => {
    if (selectMode) {
      setSelectedChats((prev) => {
        if (prev.find((c) => c.id === chat.id)) {
          return prev.filter((c) => c.id !== chat.id);
        } else {
          return [...prev, chat];
        }
      });
    } else {
      onSelect(chat);
    }
  };

  const handleSelectMenuAction = (action) => {
    setShowSelectMenu(false);

    switch (action) {
      case "markAsRead":
        // Mark selected chats as read
        setChatList((prevChats) =>
          prevChats.map((chat) =>
            selectedChats.find((sc) => sc.id === chat.id)
              ? { ...chat, unread: 0 }
              : chat,
          ),
        );
        setSelectedChats([]);
        setSelectMode(false);
        break;
      case "mute":
        // Toggle mute for selected chats
        setChatList((prevChats) =>
          prevChats.map((chat) =>
            selectedChats.find((sc) => sc.id === chat.id)
              ? { ...chat, isMuted: !chat.isMuted }
              : chat,
          ),
        );
        setSelectedChats([]);
        setSelectMode(false);
        break;
      case "clearSelected":
        setSelectedChats([]);
        break;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "archived":
        return "Archived Chat";
      case "starred":
        return "Starred Messages";
      default:
        return "Chat";
    }
  };

  // Render starred messages view
  const renderStarredMessages = () => {
    return (
      <div className="flex-1 pb-20 px-4 pt-4 overflow-y-auto">
        {starredMessages.map((msg) => (
          <div
            key={msg.id}
            className="mb-3 bg-[#ECECEC] dark:bg-[#3A3A3A] rounded-2xl p-4"
          >
            {/* Header with sender info */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Avatar
                  label={msg.sender.charAt(0)}
                  gradient="from-red-400 to-red-600"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#000000] dark:text-[#FFFFFF]">
                    {msg.sender}
                  </span>
                  <span className="text-sm text-[#666666] dark:text-[#999999]">
                    {">"}
                  </span>
                  <span className="text-sm font-medium text-[#000000] dark:text-[#FFFFFF]">
                    {msg.receiver}
                  </span>
                </div>
              </div>
              <span className="text-xs text-[#666666] dark:text-[#999999]">
                {msg.time}
              </span>
            </div>

            {/* Message bubble */}
            <div
              className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  msg.isOwn
                    ? "bg-[#2457C5] dark:bg-[#73FBFD] dark:text-[#000000] text-[#FFFFFF] rounded-br-sm"
                    : "dark:bg-[#424242] bg-[#FFFFFF] text-[#000000] dark:text-[#FFFFFF] rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <aside
      className={
        `relative w-full h-full
   flex flex-col
   bg-[#FFFFFF] dark:bg-[#2E2F2F]
   ` + (selectedChat ? "hidden md:flex" : "flex")
      }
    >
      {/* Header */}
      <div className="flex-shrink-0 p-3 md:p-4 border-b border-[#E0DDDD] dark:border-[#575757]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl md:text-3xl text-[#000000] dark:text-[#FFFFFF] font-semibold mb-2">
            {getTitle()}
          </h2>
        </div>

        {/* Select Mode Header */}
        {selectMode && selectedChats.length > 0 && (
          <div className="flex items-center justify-between mt-2 py-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectMode(false);
                  setSelectedChats([]);
                }}
                className="text-black dark:text-white text-lg font-medium btn-hover"
              >
                ✕
              </button>
              <span className="text-black dark:text-white font-medium">
                {selectedChats.length} Selected
              </span>
            </div>

            {/* Select mode menu - Positioned to the RIGHT */}
            <div className="relative" ref={selectMenuRef}>
              <button
                onClick={() => setShowSelectMenu(!showSelectMenu)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg btn-hover"
              >
                <MoreVertical className="size-6 text-black dark:text-white" />
              </button>

              {showSelectMenu && (
                <div className="absolute left-0 top-10 w-[220px] bg-white dark:bg-[#2E2F2F] border border-[#D1D1D1] dark:border-[#575757] rounded-xl shadow-lg py-1.5 z-50">
                  {/* Mark as read */}
                  <button
                    onClick={() => handleSelectMenuAction("markAsRead")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-black dark:text-white text-base flex items-center gap-3 transition-colors btn-hover"
                  >
                    <BookmarkCheck size={18} className="flex-shrink-0" />
                    Mark as read
                  </button>

                  {/* Mute notification */}
                  <button
                    onClick={() => handleSelectMenuAction("mute")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-black dark:text-white text-base flex items-center gap-3 transition-colors btn-hover"
                  >
                    <BellOff size={18} className="flex-shrink-0" />
                    Mute Notification
                  </button>

                  {/* Clear selected chat */}
                  <button
                    onClick={() => handleSelectMenuAction("clearSelected")}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-black dark:text-white text-base flex items-center gap-3 transition-colors btn-hover"
                  >
                    <CircleMinus size={18} className="flex-shrink-0" />
                    Clear Selected chat
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search bar - Only show in chat and archived views */}
        {currentView !== "starred" && (
          <div className="flex mt-2 items-center gap-2 bg-[#EDEDED] dark:bg-[#000000] border border-[#989696]  px-2 md:px-3 py-2  rounded-lg">
            <Search size={16} className="text-gray-500" />
            <input
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              placeholder="Search"
              className="bg-transparent dark:text-[#7E7E7E] dark:placeholder:text-[#7E7E7E] text-[#5C5C5C] placeholder:text-[#5C5C5C] outline-none text-sm w-full"
            />
          </div>
        )}
      </div>

      {/* Content area */}
      {currentView === "starred" ? (
        renderStarredMessages()
      ) : (
        <div className="flex-1 pb-20 sidebar-chat-list overflow-y-auto">
          {filteredItems.length !== 0 ? (
            filteredItems.map((c) => (
              <div
                key={c.id}
                onClick={() => handleChatSelect(c)}
                className={`relative flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 cursor-pointer
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  ${selectedChat?.id === c.id && !selectMode ? "bg-[#E2EBFF] dark:bg-[#144344]" : ""}
                  ${selectedChats.find((sc) => sc.id === c.id) ? "bg-[#E2EBFF] dark:bg-[#144344]" : ""}`}
              >
                {/* Checkbox in select mode */}
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={!!selectedChats.find((sc) => sc.id === c.id)}
                    onChange={() => handleChatSelect(c)}
                    className="size-5 cursor-pointer accent-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <div className="flex-shrink-0">
                  <Avatar
                    label={c.avatar || c.name?.charAt(0)}
                    gradient={c.gradient}
                    src={c.profilePic || c.profile_pic}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm md:text-lg text-black dark:text-white truncate">
                        {c.name}
                      </p>
                      {Number(c.unread) > 0 && !selectMode && (
                        <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[11px] font-semibold bg-blue-600 dark:bg-[#73FBFD] text-white dark:text-black">
                          {c.unread}
                        </span>
                      )}
                      {/* Mute icon */}
                      {c.isMuted && (
                        <VolumeX
                          size={16}
                          className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                        />
                      )}
                    </div>
                    <span className="text-xs md:text-sm text-black dark:text-white">
                      {c.time}
                    </span>
                  </div>
                  <p className="text-xs text-black dark:text-white truncate">
                    {c.last}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full w-full flex flex-col items-center justify-center text-sm font-medium text-black dark:text-gray-400">
              {currentView === "archived" ? (
                <div>No archived chats</div>
              ) : debouncedValue ? (
                <>
                  <div>No Contact Found with name</div>
                  <span className="font-bold text-lg">"{debouncedValue}"</span>
                </>
              ) : (
                <div>No chats available</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Floating circular Group button inside sidebar */}
      <button
        onClick={() => setShowCreateGroupModal(true)}
        className="absolute bottom-[84px] right-4 w-12 h-12 rounded-full bg-blue-600 dark:bg-[#73FBFD] flex items-center justify-center text-white dark:text-black shadow-lg hover:scale-105 transition-transform btn-hover z-50 cursor-pointer"
        title="Create Group Chat"
      >
        <Users className="size-5 md:size-6" />
      </button>

      {/* Floating circular Edit button inside sidebar */}
      <button
        onClick={() => setShowNewChatModal(true)}
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-600 dark:bg-[#73FBFD] flex items-center justify-center text-white dark:text-black shadow-lg hover:scale-105 transition-transform btn-hover z-50 cursor-pointer"
        title="New Private Chat"
      >
        <Edit3 className="size-5 md:size-6" />
      </button>

      {/* Create Group Modal */}
      {showCreateGroupModal && (
        <CreateGroupModal
          onClose={() => setShowCreateGroupModal(false)}
          usersList={usersList}
        />
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="absolute inset-0 z-50 bg-black/50 flex flex-col items-center justify-center p-4">
          <div className="bg-white dark:bg-[#2E2F2F] rounded-xl w-full max-w-sm overflow-hidden flex flex-col max-h-full">
            <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-semibold text-black dark:text-white">
                New Chat
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-black dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {usersList.length > 0 ? (
                usersList.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleCreateNewChat(user.id)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                  >
                    <Avatar
                      label={user.name?.charAt(0) || "U"}
                      src={user.profilePic || user.profile_pic}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-black dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  Loading users...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
