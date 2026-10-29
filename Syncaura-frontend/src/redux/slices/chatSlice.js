import { createSlice } from "@reduxjs/toolkit";
import { fetchChannels, fetchMessages, createPrivateChat, createGroupChat } from "../features/chatThunks";

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
    },
    receiveMessage: (state, action) => {
      const msg = action.payload;
      if (!state.messages[msg.channel_id]) {
        state.messages[msg.channel_id] = [];
      }
      // Check if message already exists to avoid duplicates
      const exists = state.messages[msg.channel_id].some(m => m.id === msg.id);
      if (!exists) {
        state.messages[msg.channel_id].push(msg);
      }
      
      // Update the channel's updated_at, unread count, and move it to the top
      const channelIndex = state.channels.findIndex(c => c.id === msg.channel_id);
      if (channelIndex !== -1) {
        const channel = state.channels[channelIndex];
        channel.updated_at = msg.created_at || new Date().toISOString();
        channel.last = msg.text || "Sent an attachment";
        
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
      const { channelId, messageId, userId } = action.payload;
      if (state.messages[channelId]) {
        state.messages[channelId].forEach(msg => {
          if (msg.sender_id !== userId) {
            msg.is_read = true;
          }
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => { state.isLoading = true; })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.channels = action.payload;
        if (state.activeChannel) {
          const updatedActive = action.payload.find(c => c.id === state.activeChannel.id);
          if (updatedActive) {
            state.activeChannel = updatedActive;
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
        const existing = state.channels.find(c => c.id === action.payload.id);
        if (!existing) {
          state.channels.push(action.payload);
        }
        state.activeChannel = action.payload;
      })
      .addCase(createGroupChat.fulfilled, (state, action) => {
        const existing = state.channels.find(c => c.id === action.payload.id);
        if (!existing) {
          state.channels.push(action.payload);
        }
        state.activeChannel = action.payload;
      });
  }
});

export const { setActiveChannel, receiveMessage, messageRead } = chatSlice.actions;
export default chatSlice.reducer;
