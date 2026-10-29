import { motion, AnimatePresence } from "framer-motion";
import MeetingCard from "./MeetingCard";

const MeetingCardParent = ({
  gridLayout,
  visibleParticipants,
  localStream,
  isCameraOn,
  isMicOn,
  raisedHands,
  direction,
  currentPage,
}) => {
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentPage}
        custom={direction}
        initial={{
          y: direction === 1 ? "100%" : "-100%",
          opacity: 0,
          scale: 0.98,
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1,
        }}
        exit={{
          y: direction === 1 ? "-100%" : "100%",
          opacity: 0,
          scale: 0.98,
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1], // smooth professional easing
        }}
        className="absolute inset-0 flex gap-2 px-1.5 py-2"
      >
        <MeetingCard
          visibleParticipants={visibleParticipants}
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          gridLayout={gridLayout}
          localStream={localStream}
          raisedHands={raisedHands}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default MeetingCardParent;
