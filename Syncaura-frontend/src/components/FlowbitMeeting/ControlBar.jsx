import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Smile,
  Hand,
  PhoneOff,
  Users,
  MoreVertical,
  MessageSquareText,
  CircleAlert,
  UserLock,
} from "lucide-react";
import MeetingTime from "./MeetingTime";

const ControlBar = ({
  controllerRef,
  isDarkTheme,

  // mic & camera
  isMicOn,
  toggleMic,
  isCameraOn,
  toggleCamera,

  // screen share
  isScreenSharing,
  startScreenShare,
  stopScreenShare,
  setParticipants,

  // emoji
  showEmojiPicker,
  setShowEmojiPicker,
  emojiList,
  emojiReactions,
  sendEmojiReaction,

  // raise hand
  raisedHands,
  setRaisedHands,

  // right panel
  activePanel,
  setActivePanel,
  participants,
}) => {
  return (
    <div
      ref={controllerRef}
      className={`absolute bottom-0 left-0 z-100 w-full ${
        isDarkTheme ? "bg-[#000000]" : "bg-[#FFFFFF]"
      }`}
    >
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex items-center justify-between px-6 py-3">
        {/* LEFT */}
        <div className="hidden lg:flex items-center gap-3">
          <MeetingTime meetingCode={"qfn-nohn-yup"} />
        </div>

        {/* CENTER CONTROLS */}
        <div className="flex items-center gap-3 relative">
          {/* MIC */}
          <button
            onClick={()=>{toggleMic() ; console.log("mic clicked")}}
            className={`btn-hover w-15 h-11 rounded-full flex items-center justify-center transition ${
              !isMicOn
                ? "bg-red-200 text-red-600"
                : isDarkTheme
                  ? "bg-[#2E2F2F] text-[#FFFFFF]"
                  : "bg-[#F8F8F8] text-[#000000]"
            }`}
          >
            {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* CAMERA */}
          <button
            onClick={()=>{toggleCamera(); console.log("camera clicked")
            }}
            className={`btn-hover w-15 h-11 rounded-full flex items-center justify-center transition ${
              !isCameraOn
                ? "bg-red-200 text-red-600"
                : isDarkTheme
                  ? "bg-[#2E2F2F] text-[#FFFFFF]"
                  : "bg-[#F8F8F8] text-[#000000]"
            }`}
          >
            {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
          </button>

          {/* SCREEN SHARE */}
          <button
            onClick={async () => {
              if (isScreenSharing) {
                stopScreenShare();
                setParticipants((prev) =>
                  prev.map((p) => (p.isHost ? { ...p, isSharing: false } : p)),
                );
              } else {
                const started = await startScreenShare();
                if (started) {
                  setParticipants((prev) =>
                    prev.map((p) => (p.isHost ? { ...p, isSharing: true } : p)),
                  );
                }
              }
            }}
            className={`btn-hover w-15 h-11 rounded-full flex items-center justify-center transition ${
              isScreenSharing
                ? "bg-red-200 text-red-600"
                : isDarkTheme
                  ? "bg-[#2E2F2F] text-[#FFFFFF]"
                  : "bg-[#F8F8F8] text-[#000000]"
            }`}
          >
            <Monitor size={20} />
          </button>

          {/* EMOJI */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`btn-hover w-15 h-11 rounded-full ${
              isDarkTheme
                ? "bg-[#2E2F2F] text-[#FFFFFF]"
                : "bg-[#F8F8F8] text-[#000000]"
            } flex items-center justify-center`}
          >
            <Smile size={20} />
          </button>

          {/* CC */}
          <button
            className={`btn-hover w-15 h-11 rounded-full ${
              isDarkTheme
                ? "bg-[#2E2F2F] text-[#FFFFFF]"
                : "bg-[#F8F8F8] text-[#000000]"
            } flex items-center justify-center text-sm font-semibold`}
          >
            CC
          </button>

          {/* RAISE HAND */}
          <button
            onClick={() =>
              setRaisedHands((prev) =>
                prev.includes(1) ? prev.filter((id) => id !== 1) : [...prev, 1],
              )
            }
            className={`btn-hover w-15 h-11 rounded-full flex items-center justify-center ${
              raisedHands.includes(1)
                ? "bg-blue-500 text-white"
                : isDarkTheme
                  ? "bg-[#2E2F2F] text-[#FFFFFF]"
                  : "bg-[#F8F8F8] text-[#000000]"
            }`}
          >
            <Hand size={20} />
          </button>

          {/* END CALL */}
          <button className="px-6 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center btn-hover">
            <PhoneOff size={20} />
          </button>

          {/* FLOATING EMOJIS */}
          <div className="pointer-events-none absolute inset-0 flex justify-center items-end z-40">
            <AnimatePresence>
              {Object.entries(emojiReactions).map(([id, emoji]) => (
                <motion.div
                  key={id}
                  initial={{ y: 0, opacity: 0, scale: 0.8 }}
                  animate={{ y: -250, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute text-5xl mb-24"
                >
                  {emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* EMOJI PICKER */}
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 left-1/2 -translate-x-1/2
                bg-white dark:bg-[#2a2a2a] shadow-lg rounded-full px-4 py-2
                flex gap-3 z-30"
              >
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sendEmojiReaction(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl hover:scale-125 transition btn-hover"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 lg:gap-2 xl:gap-6">
          <button
            className={`btn-hover ${activePanel === "detail" && "bg-[#989696]"} p-2 rounded-full`}
            onClick={() => setActivePanel("detail")}
          >
            <CircleAlert
              className={`${activePanel === "detail" ? "text-white" : isDarkTheme ? "" : "text-black"} text-sm`}
            />
          </button>

          <button
            className={`btn-hover ${activePanel === "people" && "bg-[#989696]"} p-2 rounded-full relative`}
            onClick={() => setActivePanel("people")}
          >
            <div
              className={`absolute -top-2.5 left-6 flex items-center justify-center rounded-full p-0.5 ${
                isDarkTheme ? "" : "bg-[#EDEDED]"
              }`}
            >
              <h1 className={`text-xs ${isDarkTheme ? "" : "text-black"}`}>
                {participants.length}
              </h1>
            </div>
            <Users
              className={`${activePanel === "people" ? "text-white" : isDarkTheme ? "" : "text-black"} text-sm`}
            />
          </button>

          <button
            className={`btn-hover ${activePanel === "chat" && "bg-[#989696]"} p-2 rounded-full`}
            onClick={() => setActivePanel("chat")}
          >
            <MessageSquareText
              className={`${activePanel === "chat" ? "text-white" : isDarkTheme ? "" : "text-black"} text-sm`}
            />
          </button>

          <button className="btn-hover">
            <UserLock className={`${isDarkTheme ? "" : "text-black"}`} />
          </button>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
       <div className="flex md:hidden items-center justify-center gap-2 sm:gap-4 py-3 relative">
          {/* MIC */}
          <button
            onClick={toggleMic}
            className={`btn-hover w-16 h-12 rounded-full flex items-center justify-center ${
        !isMicOn
          ? "bg-[#FFCACA] text-[#952B2B]"
          : isDarkTheme
            ? "bg-[#2E2F2F] text-[#FFFFFF]"
            : "bg-[#F8F8F8] text-[#000000]"
      }`}
          >
            {isMicOn ? <Mic size={22} /> : <MicOff size={22} />}
          </button>

          {/* CAMERA */}
          <button
            onClick={toggleCamera}
            className={`btn-hover w-16 h-12 rounded-full flex items-center justify-center ${
        !isCameraOn
          ? "bg-[#FFCACA] text-[#952B2B]"
          : isDarkTheme
            ? "bg-[#2E2F2F] text-[#FFFFFF]"
            : "bg-[#F8F8F8] text-[#000000]"
      }`}
          >
            {isCameraOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>

          {/* SMILE */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className={`btn-hover w-16 h-12 rounded-full ${isDarkTheme ? "bg-[#2E2F2F] text-[#FFFFFF]" : "bg-[#F8F8F8] text-[#000000]"} flex items-center justify-center`}
          >
            <Smile size={22} />
          </button>
          {/* MORE */}
          <button
            className={`btn-hover w-15 h-11 rounded-full ${isDarkTheme ? "bg-[#2E2F2F] text-[#FFFFFF]" : "bg-[#F8F8F8] text-[#000000]"} flex items-center justify-center`}
          >
            <MoreVertical size={20} />
          </button>

          {/* END CALL */}
          <button className="w-16 h-12 rounded-full bg-red-500 flex items-center justify-center btn-hover">
            <PhoneOff size={22} />
          </button>
          <div className="pointer-events-none absolute inset-0 flex justify-center items-end z-40">
            <AnimatePresence>
              {Object.entries(emojiReactions).map(([id, emoji]) => (
                <motion.div
                  key={id}
                  initial={{ y: 0, opacity: 0, scale: 0.8 }}
                  animate={{ y: -250, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.8, ease: "easeOut" }}
                  className="absolute text-5xl mb-24"
                >
                  {emoji}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* EMOJI PICKER MOBILE */}
          <AnimatePresence>
            {Object.entries(emojiReactions).map(([id, emoji]) => (
              <motion.div
                key={id}
                initial={{ y: 0, opacity: 0, scale: 0.8 }}
                animate={{ y: -250, opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute text-5xl mb-24"
              >
                {emojiList.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sendEmojiReaction(emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-2xl hover:scale-125 transition btn-hover"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* EMOJI PICKER MOBILE */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2
          bg-white dark:bg-[#2a2a2a] shadow-lg rounded-full px-4 py-2
          flex gap-3 z-30"
            >
              {emojiList.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    sendEmojiReaction(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:scale-125 transition"
                >
                  {emoji}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default React.memo(ControlBar);
