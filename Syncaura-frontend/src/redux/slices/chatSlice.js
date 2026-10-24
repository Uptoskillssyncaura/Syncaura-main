import { createSlice } from "@reduxjs/toolkit";
import { fetchChannels, fetchMessages, createPrivateChat, createGroupChat } from "../features/chatThunks";

const getStoredActiveChannelId = () => {
  try {
    return localStorage.getItem("syncaura_active_channel_id") || null;
  } catch {
    return null;
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    channels: [],
    messages: {}, // mapping channelId -> array of messages
    activeChannel: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setActiveChannel: (state, action) => {
      state.activeChannel = action.payload;
      if (action.payload?.id) {
        try {
          localStorage.setItem("syncaura_active_channel_id", action.payload.id);
        } catch {}
      } else {
        try {
          localStorage.removeItem("syncaura_active_channel_id");
        } catch {}
      }
    },
    receiveMessage: (state, action) => {
      const msg = action.payload;
      if (!msg || !msg.channel_id) return;

      if (!state.messages[msg.channel_id]) {
        state.messages[msg.channel_id] = [];
      }
      // Check if message already exists to avoid duplicates
      const exists = state.messages[msg.channel_id].some((m) => m.id === msg.id);
      if (!exists) {
        state.messages[msg.channel_id].push(msg);
      }
      
      // Update the channel's updated_at, last message, time, unread count, and move it to the top
      const channelIndex = state.channels.findIndex((c) => c.id === msg.channel_id);
      if (channelIndex !== -1) {
        const channel = { ...state.channels[channelIndex] };
        channel.updated_at = msg.created_at || new Date().toISOString();
        channel.last = msg.text || (msg.file_url ? "Sent an attachment" : "New message");
        const d = new Date(channel.updated_at);
        channel.time = !isNaN(d.getTime())
          ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "";
        
        // Increment unread count if we are not currently viewing this chat
        if (state.activeChannel?.id !== msg.channel_id) {
          channel.unread = (Number(channel.unread) || 0) + 1;
        }

        // Remove from current position and unshift to top
        state.channels.splice(channelIndex, 1);
        state.channels.unshift(channel);
      }
    },
    messageRead: (state, action) => {
      const { channelId, userId } = action.payload;
      if (state.messages[channelId]) {
        state.messages[channelId].forEach((msg) => {
          if (msg.sender_id !== userId) {
            msg.is_read = true;
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = action.payload || [];

        // Restore active channel if available
        const storedId = getStoredActiveChannelId();
        if (state.activeChannel) {
          const updatedActive = state.channels.find((c) => c.id === state.activeChannel.id);
          if (updatedActive) {
            state.activeChannel = updatedActive;
          }
        } else if (storedId) {
          const matched = state.channels.find((c) => c.id === storedId);
          if (matched) {
            state.activeChannel = matched;
          }
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        const { channelId, messages } = action.payload;
        state.messages[channelId] = messages;
      })
      .addCase(createPrivateChat.fulfilled, (state, action) => {
        const existingIndex = state.channels.findIndex((c) => c.id === action.payload.id);
        if (existingIndex !== -1) {
          state.channels[existingIndex] = { ...state.channels[existingIndex], ...action.payload };
        } else {
          state.channels.unshift(action.payload);
        }
        state.activeChannel = action.payload;
        try {
          localStorage.setItem("syncaura_active_channel_id", action.payload.id);
        } catch {}
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        const existingIndex = state.channels.findIndex((c) => c.id === action.payload.id);
        if (existingIndex !== -1) {
          state.channels[existingIndex] = { ...state.channels[existingIndex], ...action.payload };
        } else {
          state.channels.unshift(action.payload);
        }
        state.activeChannel = action.payload;
        try {
          localStorage.setItem("syncaura_active_channel_id", action.payload.id);
        } catch {}
      });
  },
});

export const { setActiveChannel, receiveMessage, messageRead } = chatSlice.actions;
export default chatSlice.reducer;
