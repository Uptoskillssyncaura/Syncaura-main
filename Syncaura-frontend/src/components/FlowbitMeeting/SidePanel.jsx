import { X } from "lucide-react";
import { motion } from "framer-motion";
import ChatUI from "./ChatUI";
import PeopleDetail from "./PeopleDetail";
import MeetingDetail from "./MeetingDetail";

const SidePanel = ({
  isDarkTheme,
  activePanel,
  setActivePanel,
  setChatMessages,
  participants,
  meetingLink,
  chatMessages
}) => {
  return (
    <>
      {/* 🔹 Backdrop Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={() => setActivePanel(null)}
        className="fixed inset-0  bg-white/50 z-40"
      />

      {/* 🔹 Side Panel */}
      <motion.div
        initial={{ x: 360 }}
        animate={{ x: 0 }}
        exit={{ x: 360 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 right-0 h-full w-full xsm:w-[360px]
                   ${isDarkTheme ? "bg-black" : "bg-white"}
                   shadow-xl z-100 xsm:z-50 flex flex-col xsm:pb-21`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 ">
          <h3
            className={`text-xl font-semibold ${
              isDarkTheme ? "text-white" : "text-black"
            }`}
          >
            {activePanel === "chat"
              ? "In Call Message"
              : activePanel === "people"
                ? "People"
                : "Meeting Details"}
          </h3>
          <button className="btn-hover" onClick={() => setActivePanel(null)}>
            <X
              className={`${isDarkTheme ? "text-white" : "text-black"} text-lg`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto ">
          {activePanel === "detail" && (
            <MeetingDetail
              isDarkTheme={isDarkTheme}
              meetingLink={meetingLink}
            />
          )}
          {activePanel === "people" && (
            <PeopleDetail
              participants={participants}
              isDarkTheme={isDarkTheme}
            />
          )}
          {activePanel === "chat" && (
            <ChatUI setChatMessages={setChatMessages} chatMessages={chatMessages} />
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SidePanel;
