import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMedia } from "../context/MediaContext";
import { Mic, MicOff, Hand } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { calculateLayout } from "../constant/constant";
import SidePanel from "../components/FlowbitMeeting/SidePanel";
import PaginationDots from "../components/FlowbitMeeting/PaginationDots";
import ControlBar from "../components/FlowbitMeeting/ControlBar";
import MeetingCard from "../components/FlowbitMeeting/MeetingCard";
import MeetingCardParent from "../components/FlowbitMeeting/MeetingCardParent";
import ParticipantGrid from "../components/FlowbitMeeting/ParticipantGrid";

const FlowBitMeetingPage = () => {
  const dispatch = useDispatch();
  const isDarkTheme = useSelector((state) => state.theme.isDark);

  const user = useSelector((state) => state.auth.user);

  const [gridLayout, setGridLayout] = useState({
    cols: 1,
    rows: 1,
    cardWidth: 0,
    cardHeight: 0,
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [raisedHands, setRaisedHands] = useState([]);
  const [emojiReactions, setEmojiReactions] = useState({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [participants, setParticipants] = useState(() => [
    {
      id: user?.id || 1,
      name: user?.name || "You",
      initial: (user?.name || "Y")[0]?.toUpperCase(),
      color: "#2461E6",
      isHost: true,
    },
  ]);
  const [controllerHeight, setControllerHeight] = useState(0);
  const gridRef = useRef(null);
  const controllerRef = useRef(null);
  const [gridHeight, setGridHeight] = useState("100vh");
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage, setPerPage] = useState(8);
  const [direction, setDirection] = useState(0);
  useEffect(() => {
    const updateHeight = () => {
      const controllerH = controllerRef.current?.clientHeight || 0;
      setGridHeight(`calc(100vh - ${controllerH}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (controllerRef.current) {
        setControllerHeight(controllerRef.current.clientHeight);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const emojiList = ["👍", "👏", "❤️", "😂", "🎉", "🙌"];

  const {
    localStream,
    isMicOn,
    screenStream,
    isCameraOn,
    isScreenSharing,
    startMedia,
    toggleMic,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
  } = useMedia();

  const mediaStartedRef = useRef(false);

  useEffect(() => {
    if (mediaStartedRef.current) return;
    mediaStartedRef.current = true;

    startMedia().catch((err) => {
      if (err.message === "permission-denied") {
        alert("Camera/Microphone permission denied.");
      }
    });
  }, []);

  const sendEmojiReaction = (emoji) => {
    const id = Date.now();

    setEmojiReactions((prev) => ({
      ...prev,
      [id]: emoji,
    }));

    setTimeout(() => {
      setEmojiReactions((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }, 2000);
  };

  useEffect(() => {
    if (!gridRef.current) return;

    calculateLayout({
      setGridLayout,
      gridRef,
      participants,
      perPage,
      setPerPage,
      setPages,
      setCurrentPage,
      currentPage,
    });
    // run once initially

    const observer = new ResizeObserver(() => {
      calculateLayout({
        setGridLayout,
        gridRef,
        participants,
        perPage,
        setPerPage,
        setPages,
        setCurrentPage,
        currentPage,
      });
    });

    observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, [participants.length, currentPage]);

  // const perPage = 8;
  const startIndex = currentPage * perPage;
  const visibleParticipants = participants.slice(
    startIndex,
    startIndex + perPage,
  );

  const sharedScreens =
    screenStream && isScreenSharing
      ? participants
          .filter((p) => p.isSharing)
          .map((p) => ({
            id: p.id,
            name: p.isHost ? "You" : p.name,
            stream: screenStream,
          }))
      : [];

  // Simulated other users share

  useEffect(() => {
    if (!isScreenSharing) {
      setParticipants((prev) =>
        prev.map((p) => (p.isHost ? { ...p, isSharing: false } : p)),
      );
    }
  }, [isScreenSharing]);
  

  return (
    <div
      data-theme={isDarkTheme ? "dark" : "light"}
      className={`w-full h-screen  ${isDarkTheme ? "bg-black" : "bg-white"} rounded-xl shadow-lg overflow-hidden relative `}
    >
      {/* VIDEO GRID */}
      <div
        ref={gridRef}
        className="relative overflow-hidden flex gap-2 px-1.5 py-2 w-full "
        style={{
          height: gridHeight,
          background: isDarkTheme ? "#000000" : "#FFFFFF",
        }}
      >
        {sharedScreens.length === 0 ? (
          <MeetingCardParent
            visibleParticipants={visibleParticipants}
            isMicOn={isMicOn}
            isCameraOn={isCameraOn}
            gridLayout={gridLayout}
            localStream={localStream}
            raisedHands={raisedHands}
            direction={direction}
            currentPage={currentPage}
          />
        ) : (
          <div className="flex w-full h-full gap-3">
            {/* MAIN PRESENTER */}
            <div className="grid grid-rows-15 md:grid-cols-7  2xl:grid-cols-5 size-full gap-3 ">
              <div className="row-span-10 md:col-span-5 2xl:col-span-4 h-full md:h-[calc(100vh-70px)] px2 py-3 ">
                <div className="size-full relative rounded-xl overflow-hidden bg-black">
                  <video
                    className="w-full h-full object-contain"
                    ref={(el) => el && (el.srcObject = sharedScreens[0].stream)}
                    autoPlay
                  />

                  <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                    {sharedScreens[0].name} is presenting
                  </div>
                </div>

                {/* OTHER SHARERS */}
                {sharedScreens.length > 1 && (
                  <div className="flex-[1] flex flex-col gap-3 overflow-y-auto">
                    {sharedScreens.slice(1).map((screen) => (
                      <div
                        key={screen.id}
                        className="relative rounded-xl overflow-hidden bg-black h-40 cursor-pointer hover:scale-105 transition"
                      >
                        <video
                          className="w-full h-full object-contain"
                          ref={(el) => el && (el.srcObject = screen.stream)}
                          autoPlay
                        />

                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 text-xs rounded">
                          {screen.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="row-span-5 flex md:block items-end md:col-span-2 2xl:col-span-1  md:h-[calc(100vh-70px)] size-full overflow-y-auto px-2 py-2">
                <ParticipantGrid
                  participants={PARTICIPANTS}
                  localStream={localStream}
                  isCameraOn={isCameraOn}
                  isMicOn={isMicOn}
                  raisedHands={raisedHands}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {sharedScreens.length === 0 && pages > 1 && (
        <PaginationDots
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setDirection={setDirection}
          pages={pages}
        />
      )}
      {/* CONTROL BAR */}
      <ControlBar
        controllerRef={controllerRef}
        isDarkTheme={isDarkTheme}
        isMicOn={isCameraOn}
        isCameraOn={isCameraOn}
        toggleCamera={toggleCamera}
        toggleMic={toggleMic}
        isScreenSharing={isScreenSharing}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
        setParticipants={setParticipants}
        showEmojiPicker={showEmojiPicker}
        setShowEmojiPicker={setShowEmojiPicker}
        emojiList={emojiList}
        emojiReactions={emojiReactions}
        sendEmojiReaction={sendEmojiReaction}
        raisedHands={raisedHands}
        setRaisedHands={setRaisedHands}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
        participants={participants}
      />
      {/* SIDE PANEL */}
      <AnimatePresence>
        {activePanel && (
          <SidePanel
            isDarkTheme={isDarkTheme}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
            setChatMessages={setChatMessages}
            participants={PARTICIPANTS}
            meetingLink={"https://meet.google.com/qfn-nahn-yup"}
            chatMessages={chatMessages}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
export default FlowBitMeetingPage;
