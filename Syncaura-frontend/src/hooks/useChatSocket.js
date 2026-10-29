import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { receiveMessage } from "../redux/slices/chatSlice";

export const useChatSocket = (channelId) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;
    
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
    socketRef.current = io(apiBase);
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to chat socket", socket.id);
      socket.emit("setup-user", user.id);
    });

    socket.on("message:new", (message) => {
      dispatch(receiveMessage(message));
    });

    socket.on("channel:new", () => {
      // Import fetchChannels dynamically to avoid circular dependencies if any, or just import it at top
      import("../redux/features/chatThunks").then(({ fetchChannels }) => {
        dispatch(fetchChannels());
      });
    });

    socket.on("channel:updated", () => {
      import("../redux/features/chatThunks").then(({ fetchChannels }) => {
        dispatch(fetchChannels());
      });
    });

    socket.on("channel:members_updated", () => {
      import("../redux/features/chatThunks").then(({ fetchChannels }) => {
        dispatch(fetchChannels());
      });
    });

    socket.on("message:read", ({ channelId, messageId, userId }) => {
      dispatch(messageRead({ channelId, messageId, userId }));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, user]);

  useEffect(() => {
    if (socketRef.current && channelId) {
      socketRef.current.emit("join-channel", channelId);
    }
  }, [channelId]);

  const sendMessageText = (text) => {
    if (socketRef.current && channelId && user) {
      socketRef.current.emit("message:text", { channelId, senderId: user.id, text });
    }
  };

  const sendTyping = (isTyping) => {
    if (socketRef.current && channelId && user) {
      if (isTyping) {
        socketRef.current.emit("typing", { channelId, userName: user.name });
      } else {
        socketRef.current.emit("stop-typing", { channelId, userName: user.name });
      }
    }
  };

  const emitRead = (messageId) => {
    if (socketRef.current && channelId && user) {
      socketRef.current.emit("message:read", { channelId, messageId, userId: user.id });
    }
  };

  return { socket: socketRef.current, sendMessageText, sendTyping, emitRead };
};
