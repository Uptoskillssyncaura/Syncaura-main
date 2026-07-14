import { Edit3, Search, MoreVertical ,BookmarkCheck, BellOff, CircleMinus, VolumeX} from "lucide-react";
import Avatar from "../Avatar";
import { useEffect, useState, useRef } from "react";

export default function Sidebar({ chats, selectedChat, onSelect, onViewChange }) {
  const [search, setSearch] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [chatList, setChatList] = useState(chats);
  const [filteredItems, setFilteredItems] = useState(chats);
  const [showMenu, setShowMenu] = useState(false);
  const [currentView, setCurrentView] = useState("chat"); // 'chat', 'archived', 'starred'
  const [selectMode, setSelectMode] = useState(false);
  const [selectedChats, setSelectedChats] = useState([]);
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const menuRef = useRef(null);
  const selectMenuRef = useRef(null);

  // Sample starred messages data
  const [starredMessages] = useState([
    {
      id: 1,
      sender: "You",
      receiver: "Aarav M",
      time: "2:30 PM",
      text: "Ya I'm free. What do you want to ask?",
      isOwn: true
    },
    {
      id: 2,
      sender: "Aarav M",
      receiver: "You",
      time: "2:30 PM",
      text: "Hey bro, you free ah? Need to ask something.",
      isOwn: false
    }
  ]);
  

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
      if (selectMenuRef.current && !selectMenuRef.current.contains(event.target)) {
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
      item.name.toLowerCase().includes(debouncedValue.toLowerCase())
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
          prevChats.map((chat) => ({ ...chat, unread: 0 }))
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
              : chat
          )
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
              : chat
          )
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
            <div className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
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
  `relative w-full sm:w-72 md:w-80 lg:w-80
   flex flex-col border-r
   bg-[#FFFFFF] dark:bg-[#2E2F2F]
   border-[#E0DDDD] dark:border-[#575757]
   ` +
   (selectedChat ? "hidden md:flex" : "flex")
}
    >
      {/* Header */}
      <div className="p-3  md:p-4 border-b border-[#E0DDDD] dark:border-[#575757]">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl md:text-3xl text-[#000000] dark:text-[#FFFFFF] font-semibold mb-2">
            {getTitle()}
          </h2>
          
          {/* Three dot menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors btn-hover"
            >
              <MoreVertical className="size-6 md:size-7 text-black dark:text-white" />
            </button>

            {/* Dropdown Menu - Positioned to the RIGHT as per Figma */}
            {showMenu && (
              <div className="absolute right-0 top-10 md:left-0 md:top-10 w-[200px] bg-white dark:bg-[#2E2F2F] border border-[#D1D1D1] dark:border-[#575757] rounded-xl shadow-lg py-1.5 z-50">
                <button
                  onClick={() => handleMenuItemClick("chat")}
                  className={`btn-hover w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-[#000000] dark:text-white text-base flex items-center gap-3 transition-colors ${
                    currentView === "chat" ? "bg-[#F5F5F5] dark:bg-gray-700" : ""
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <path d="M14 9.5C14 10.163 13.7366 10.7989 13.2678 11.2678C12.7989 11.7366 12.163 12 11.5 12H4.5L2 14.5V4.5C2 3.837 2.26339 3.20107 2.73223 2.73223C3.20107 2.26339 3.837 2 4.5 2H11.5C12.163 2 12.7989 2.26339 13.2678 2.73223C13.7366 3.20107 14 3.837 14 4.5V9.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Chat
                </button>

                <button
                  onClick={() => handleMenuItemClick("archived")}
                  className={`btn-hover w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-[#000000] dark:text-white text-base flex items-center gap-3 transition-colors ${
                    currentView === "archived" ? "bg-[#F5F5F5] dark:bg-gray-700" : ""
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <path d="M14 5.5V12.5C14 13.163 13.7366 13.7989 13.2678 14.2678C12.7989 14.7366 12.163 15 11.5 15H4.5C3.837 15 3.20107 14.7366 2.73223 14.2678C2.26339 13.7989 2 13.163 2 12.5V5.5M14 5.5L12 1H4L2 5.5M14 5.5H2M10.5 8H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Archived Chat
                </button>

                <button
                  onClick={() => handleMenuItemClick("starred")}
                  className={`btn-hover w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-[#000000] dark:text-white text-base flex items-center gap-3 transition-colors ${
                    currentView === "starred" ? "bg-[#F5F5F5] dark:bg-gray-700" : ""
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <path d="M8 2L10.12 6.31L15 7.01L11.5 10.41L12.36 15.27L8 13.03L3.64 15.27L4.5 10.41L1 7.01L5.88 6.31L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Starred Messages
                </button>

                <button
                  onClick={() => handleMenuItemClick("select")}
                  className={`btn-hover w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-[#000000] dark:text-white text-base flex items-center gap-3 transition-colors ${
                    selectMode ? "bg-[#F5F5F5] dark:bg-gray-700" : ""
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <path d="M13.5 2.5H2.5C2.22386 2.5 2 2.72386 2 3V13C2 13.2761 2.22386 13.5 2.5 13.5H13.5C13.7761 13.5 14 13.2761 14 13V3C14 2.72386 13.7761 2.5 13.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Select Chat
                </button>

                <button
                  onClick={() => handleMenuItemClick("markAllRead")}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#F5F5F5] dark:hover:bg-gray-700 text-[#000000] dark:text-white text-base flex items-center gap-3 transition-colors btn-hover"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Mark all as read
                </button>
              </div>
            )}
          </div>
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
                    <Avatar label={c.avatar} gradient={c.gradient} />
                 </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm md:text-lg text-black dark:text-white truncate">
                        {c.name}
                      </p>
                      {/* Mute icon */}
                      {c.isMuted && (
                        <VolumeX
                          size={16}
                          className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                        />
                      )}
                    </div>
                    <span className="text-xs md:text-sm text-black dark:text-white">{c.time}</span>
                  </div>
                  <p className="text-xs text-black dark:text-white truncate">{c.last}</p>
                </div>
                {c.unread > 0 && !selectMode && (
                  <span className="absolute bottom-2 right-3 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[11px] font-semibold bg-blue-600 dark:bg-[#73FBFD] text-white dark:text-black">
                    {c.unread}
                  </span>
                )}
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

      {/* Floating circular Edit button inside sidebar */}
      <button
        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-blue-600 dark:bg-[#73FBFD] flex items-center justify-center text-white dark:text-black shadow-lg hover:scale-105 transition-transform btn-hover"
      >
        <Edit3 className="size-5 md:size-6" />
      </button>
    </aside>
  );
}