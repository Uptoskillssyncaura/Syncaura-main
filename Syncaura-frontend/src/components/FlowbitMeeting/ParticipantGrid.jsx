import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Video, VideoOff, Hand } from "lucide-react";

const ParticipantGrid = ({
  participants,
  localStream,
  isCameraOn,
  isMicOn,
  raisedHands,
}) => {
  return (
    <div className="flex flex-row md:flex-col  gap-3  w-full pb-2 overflow-y-hidden md:overflow-y-auto ">
      <AnimatePresence>
        {participants.map((p) => {
          const isLocal = p.isHost;

          return (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35 }}
              className="relative rounded-2xl overflow-hidden aspect-video shadow-lg h-auto min-h-[100px] min-w-[200px] md:min-h-[250px] md:min-w-[100px] 2xl:min-h-[300px]"
              style={{ backgroundColor: p.color }}
            >
              {/* Background Gradient Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),rgba(0,0,0,0.25))]" />

              {/* Camera OR Initial */}
              {isLocal && localStream && isCameraOn ? (
                <motion.video
                  ref={(el) => el && (el.srcObject = localStream)}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <motion.div
                  initial={{ scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div
                    className="w-[35%] aspect-square rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35), ${p.color})`,
                    }}
                  >
                    <span className="text-white text-3xl md:text-4xl font-bold">
                      {p.initial}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Raised Hand */}
              <AnimatePresence>
                {raisedHands.includes(1) && p.id === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute top-2 md:top-4 left-2 md:left-3 z-10"
                  >
                    <Hand className="size-5 md:size-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name */}
              <div className="absolute bottom-3 left-3 bg-black/30 backdrop-blur-md px-3 py-1 rounded-md">
                <span className="text-white text-sm font-medium">{p.name}</span>
              </div>

              {/* Mic + Camera Icons */}
              <div className="absolute top-3 right-3 flex gap-2">
                {isLocal ? (
                  <>
                    {isMicOn ? (
                      <Mic className="text-white w-4 h-4" />
                    ) : (
                      <MicOff className="text-white w-4 h-4" />
                    )}

                    {isCameraOn ? (
                      <Video className="text-white w-4 h-4" />
                    ) : (
                      <VideoOff className="text-white w-4 h-4" />
                    )}
                  </>
                ) : (
                  <>
                    <MicOff className="text-white w-4 h-4 opacity-80" />
                    <VideoOff className="text-white w-4 h-4 opacity-80" />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ParticipantGrid;
