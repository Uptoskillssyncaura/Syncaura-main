import pool from "../config/db.js";

export const createChannel = async (req, res) => {
  try {
    const { name } = req.body;

    const result = await pool.query(
      "INSERT INTO channels (name, created_by, is_public) VALUES ($1, $2, true) RETURNING *",
      [name, req.user.id]
    );

    const channel = result.rows[0];

    // Add creator as member
    await pool.query(
      "INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2)",
      [channel.id, req.user.id]
    );

    res.status(201).json({ message: "Channel created", channel });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join Channel
export const joinChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    const channelResult = await pool.query("SELECT * FROM channels WHERE id = $1", [channelId]);
    if (channelResult.rowCount === 0) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const channel = channelResult.rows[0];

    if (channel.is_private) {
      const allowedCheck = await pool.query(
        "SELECT 1 FROM channel_allowed_users WHERE channel_id = $1 AND user_id = $2",
        [channelId, userId]
      );
      if (allowedCheck.rowCount === 0) return res.status(403).json({ message: "Private channel" });
    }

    const membersCountResult = await pool.query(
      "SELECT COUNT(*) FROM channel_members WHERE channel_id = $1",
      [channelId]
    );
    if (parseInt(membersCountResult.rows[0].count) >= channel.max_members) {
      return res.status(403).json({ message: `Channel is full (max ${channel.max_members} users)` });
    }

    const memberCheck = await pool.query(
      "SELECT 1 FROM channel_members WHERE channel_id = $1 AND user_id = $2",
      [channelId, userId]
    );
    if (memberCheck.rowCount > 0) {
      return res.status(400).json({ message: "Already joined" });
    }

    await pool.query(
      "INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2)",
      [channelId, userId]
    );

    res.json({ message: "Joined channel successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChannels = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         c.id, c.is_private, c.is_public, c.max_members, c.created_by, c.created_at, c.updated_at, c.profile_pic,
         CASE 
           WHEN c.is_private AND c.max_members = 2 THEN (
             SELECT u.name 
             FROM channel_members cm2 
             JOIN users u ON cm2.user_id = u.id 
             WHERE cm2.channel_id = c.id AND cm2.user_id != $1
             LIMIT 1
           )
           ELSE c.name 
         END as name,
         CASE 
           WHEN c.is_private AND c.max_members = 2 THEN (
             SELECT u.role 
             FROM channel_members cm2 
             JOIN users u ON cm2.user_id = u.id 
             WHERE cm2.channel_id = c.id AND cm2.user_id != $1
             LIMIT 1
           )
           ELSE NULL 
         END as other_user_role,
         (
           SELECT COUNT(*)
           FROM messages m
           WHERE m.channel_id = c.id AND m.sender_id != $1
           AND NOT EXISTS (
             SELECT 1 FROM message_seen_by msb WHERE msb.message_id = m.id AND msb.user_id = $1
           )
         ) as unread
       FROM channels c 
       JOIN channel_members cm ON c.id = cm.channel_id 
       WHERE cm.user_id = $1
       ORDER BY c.updated_at DESC`,
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Leave Channel
export const leaveChannel = async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    await pool.query(
      "DELETE FROM channel_members WHERE channel_id = $1 AND user_id = $2",
      [channelId, userId]
    );

    res.json({ message: "Left channel successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Channel by ID
export const getChannelById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM channels WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const channel = result.rows[0];

    // Get members
    const membersResult = await pool.query(
      "SELECT u.id, u.name, u.email FROM channel_members cm JOIN users u ON cm.user_id = u.id WHERE cm.channel_id = $1",
      [channel.id]
    );
    channel.members = membersResult.rows;

    res.json(channel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createPrivateChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user required" });
    }

    // Check if private chat already exists
    const existingResult = await pool.query(
      `SELECT c.* FROM channels c
       JOIN channel_allowed_users cau1 ON c.id = cau1.channel_id
       JOIN channel_allowed_users cau2 ON c.id = cau2.channel_id
       WHERE c.is_private = true AND cau1.user_id = $1 AND cau2.user_id = $2`,
      [userId, otherUserId]
    );

    if (existingResult.rowCount > 0) {
      const channel = existingResult.rows[0];
      const otherUserResult = await pool.query("SELECT name, role FROM users WHERE id = $1", [otherUserId]);
      channel.name = otherUserResult.rows[0]?.name || "Unknown User";
      channel.other_user_role = otherUserResult.rows[0]?.role || "user";
      return res.status(200).json(channel);
    }

    const result = await pool.query(
      "INSERT INTO channels (name, is_private, is_public, max_members, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      ["private-chat", true, false, 2, userId]
    );

    const channel = result.rows[0];

    // Add allowed users
    await pool.query("INSERT INTO channel_allowed_users (channel_id, user_id) VALUES ($1, $2), ($1, $3)", [channel.id, userId, otherUserId]);
    
    // Add members
    await pool.query("INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2), ($1, $3)", [channel.id, userId, otherUserId]);

    const otherUserResult = await pool.query("SELECT name, role FROM users WHERE id = $1", [otherUserId]);
    channel.name = otherUserResult.rows[0]?.name || "Unknown User";
    channel.other_user_role = otherUserResult.rows[0]?.role || "user";

    // Notify both members of the new private chat
    const io = req.app.get("io");
    if (io) {
      io.to(`user_${userId}`).emit("channel:new");
      io.to(`user_${otherUserId}`).emit("channel:new");
    }

    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all public channels
export const getPublicChannels = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM channels WHERE is_public = true AND is_private = false"
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createGroupChat = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const { name, userIds } = req.body;

    if (!name || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "Group name and at least one other user are required" });
    }

    await client.query('BEGIN');

    // Create the group channel
    const result = await client.query(
      "INSERT INTO channels (name, is_private, is_public, max_members, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, true, false, 50, userId]
    );

    const channel = result.rows[0];

    // Build the query to insert allowed users and members
    const allMemberIds = [userId, ...userIds];
    
    // Convert array of IDs to appropriate postgres parameter format
    for (let i = 0; i < allMemberIds.length; i++) {
      const memberId = allMemberIds[i];
      // Add to allowed users
      await client.query("INSERT INTO channel_allowed_users (channel_id, user_id) VALUES ($1, $2)", [channel.id, memberId]);
      // Add to members
      await client.query("INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2)", [channel.id, memberId]);
    }

    // Notify all members of the new group chat
    const io = req.app.get("io");
    if (io) {
      allMemberIds.forEach((id) => {
        io.to(`user_${id}`).emit("channel:new");
      });
    }

    await client.query('COMMIT');
    res.status(201).json(channel);
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const updateGroupDetails = async (req, res) => {
  try {
    const { channelId } = req.params;
    const { name } = req.body;
    let profile_pic = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if channel exists and is a group
    const channelRes = await pool.query("SELECT * FROM channels WHERE id = $1", [channelId]);
    if (channelRes.rowCount === 0) return res.status(404).json({ message: "Channel not found" });

    const updates = [];
    const values = [];
    let queryIdx = 1;

    if (name) {
      updates.push(`name = $${queryIdx++}`);
      values.push(name);
    }
    if (profile_pic) {
      updates.push(`profile_pic = $${queryIdx++}`);
      values.push(profile_pic);
    }

    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(channelId);
      
      const result = await pool.query(
        `UPDATE channels SET ${updates.join(", ")} WHERE id = $${queryIdx} RETURNING *`,
        values
      );

      const updatedChannel = result.rows[0];

      // Notify members
      const io = req.app.get("io");
      if (io) {
        const membersRes = await pool.query("SELECT user_id FROM channel_members WHERE channel_id = $1", [channelId]);
        membersRes.rows.forEach(row => {
          io.to(`user_${row.user_id}`).emit("channel:updated", updatedChannel);
        });
      }

      return res.status(200).json(updatedChannel);
    }
    
    res.status(200).json(channelRes.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addGroupMembers = async (req, res) => {
  const client = await pool.connect();
  try {
    const { channelId } = req.params;
    const { userIds } = req.body; // array of user IDs

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ message: "No users provided to add" });
    }

    await client.query('BEGIN');
    
    for (const memberId of userIds) {
      await client.query("INSERT INTO channel_allowed_users (channel_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [channelId, memberId]);
      await client.query("INSERT INTO channel_members (channel_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [channelId, memberId]);
    }

    await client.query('COMMIT');

    const io = req.app.get("io");
    if (io) {
      const membersRes = await pool.query("SELECT user_id FROM channel_members WHERE channel_id = $1", [channelId]);
      membersRes.rows.forEach(row => {
        io.to(`user_${row.user_id}`).emit("channel:members_updated", { channelId });
      });
    }

    res.status(200).json({ message: "Members added successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};

export const removeGroupMember = async (req, res) => {
  const client = await pool.connect();
  try {
    const { channelId, userId } = req.params;

    await client.query('BEGIN');
    await client.query("DELETE FROM channel_members WHERE channel_id = $1 AND user_id = $2", [channelId, userId]);
    await client.query("DELETE FROM channel_allowed_users WHERE channel_id = $1 AND user_id = $2", [channelId, userId]);
    await client.query('COMMIT');

    const io = req.app.get("io");
    if (io) {
      const membersRes = await pool.query("SELECT user_id FROM channel_members WHERE channel_id = $1", [channelId]);
      // Notify remaining members
      membersRes.rows.forEach(row => {
        io.to(`user_${row.user_id}`).emit("channel:members_updated", { channelId });
      });
      // Notify removed member
      io.to(`user_${userId}`).emit("channel:members_updated", { channelId, removed: true });
    }

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: error.message });
  } finally {
    client.release();
  }
};
