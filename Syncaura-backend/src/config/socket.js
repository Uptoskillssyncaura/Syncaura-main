import pool from "./db.js";

let globalIO = null;

export const getIO = () => globalIO;

const socketHandler = (io) => {
  globalIO = io;
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("setup-user", async (userId) => {
      try {
        if (!userId) return;
        socket.userId = userId;
        socket.join(`user_${userId}`);
        
        // Fetch all channels this user is a member of
        const result = await pool.query(
          "SELECT channel_id FROM channel_members WHERE user_id = $1",
          [userId]
        );
        
        result.rows.forEach(row => {
          socket.join(row.channel_id);
        });
        
        console.log(`User ${userId} joined ${result.rowCount} channels`);
      } catch (err) {
        console.error("Error setting up user sockets:", err);
      }
    });

    socket.on("leave-channel", (channelId) => {
      socket.leave(channelId);
    });

    socket.on("join-channel", (channelId) => {
      if (channelId) {
        socket.join(channelId);
      }
    });

    // Handle text messages
    socket.on("message:text", async ({ channelId, senderId, text }) => {
      try {
        const result = await pool.query(
          "INSERT INTO messages (channel_id, sender_id, text, message_type) VALUES ($1, $2, $3, $4) RETURNING *",
          [channelId, senderId, text, "text"]
        );
        const message = result.rows[0];
        
        await pool.query(
          "UPDATE channels SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
          [channelId]
        );

        io.to(channelId).emit("message:new", message);
      } catch (err) {
        console.error(err);
        socket.emit("error", "Server error sending message");
      }
    });

    // Handle file messages
    socket.on("message:file", async ({ channelId, senderId, fileUrl }) => {
      try {
        const result = await pool.query(
          "INSERT INTO messages (channel_id, sender_id, file_url, message_type) VALUES ($1, $2, $3, $4) RETURNING *",
          [channelId, senderId, fileUrl, "file"]
        );
        const message = result.rows[0];

        await pool.query(
          "UPDATE channels SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
          [channelId]
        );

        io.to(channelId).emit("message:new", message);
      } catch (err) {
        console.error(err);
        socket.emit("error", "Server error sending file message");
      }
    });

    // Typing indicators
    socket.on("typing", ({ channelId, userName }) => {
      socket.to(channelId).emit("typing", { channelId, userName });
    });

    socket.on("stop-typing", ({ channelId, userName }) => {
      socket.to(channelId).emit("stop-typing", { channelId, userName });
    });

    // Read receipts
    socket.on("message:read", async ({ channelId, messageId, userId }) => {
      try {
        // Mark ALL unseen messages in this channel not sent by this user as seen
        await pool.query(
          `INSERT INTO message_seen_by (message_id, user_id)
           SELECT m.id, $2
           FROM messages m
           WHERE m.channel_id = $1 AND m.sender_id != $2
           AND NOT EXISTS (
             SELECT 1 FROM message_seen_by msb WHERE msb.message_id = m.id AND msb.user_id = $2
           )`,
          [channelId, userId]
        );
        socket.to(channelId).emit("message:read", { channelId, messageId, userId });
      } catch (err) {
        console.error("Error updating read status in socket", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default socketHandler;