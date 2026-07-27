import express from 'express';
import pool from '../config/db.js';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/query', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // 1. Optional Auth Check
    let user = null;
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [payload.sub || payload.id]);
        if (result.rowCount > 0) {
          user = result.rows[0];
        }
      } catch (err) {
        console.log("Chatbot optional auth failed:", err.message);
      }
    }

    let dbContext = '';

    if (user) {
      // Fetch user's assigned tasks
      try {
        const taskResult = await pool.query(
          `SELECT t.title, t.description, t.status, t.priority, t.deadline, p.name as project_name 
           FROM tasks t 
           LEFT JOIN projects p ON t.project_id = p.id 
           WHERE t.assigned_to = $1::text OR t.assigned_to = $2 OR t.assigned_to = $3
           ORDER BY t.created_at DESC`,
          [user.id, user.name, user.email]
        );
        if (taskResult.rowCount > 0) {
          dbContext += `\nYour Assigned Tasks:\n` + taskResult.rows.map(t => 
            `- [Status: ${t.status}] "${t.title}" (${t.priority} priority) in project "${t.project_name || 'N/A'}". Deadline: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'None'}. Description: ${t.description || 'No description'}`
          ).join('\n');
        } else {
          dbContext += `\nYour Assigned Tasks:\nYou have no tasks currently assigned to you.\n`;
        }
      } catch (e) {
        console.error("Error fetching tasks for chatbot context:", e);
      }

      // Fetch user's leave requests
      try {
        const leaveResult = await pool.query(
          `SELECT from_date, to_date, reason, status 
           FROM leaves 
           WHERE user_id = $1 
           ORDER BY created_at DESC LIMIT 5`,
          [user.id]
        );
        if (leaveResult.rowCount > 0) {
          dbContext += `\nYour Recent Leave Requests:\n` + leaveResult.rows.map(l => 
            `- Leave from ${new Date(l.from_date).toLocaleDateString()} to ${new Date(l.to_date).toLocaleDateString()}. Reason: "${l.reason}". Status: ${l.status}.`
          ).join('\n');
        } else {
          dbContext += `\nYour Recent Leave Requests:\nYou have not requested any leaves.\n`;
        }
      } catch (e) {
        console.error("Error fetching leaves for chatbot context:", e);
      }

      // Fetch upcoming meetings
      try {
        const meetingResult = await pool.query(
          `SELECT m.title, m.description, m.start_time, m.end_time, m.google_meet_link 
           FROM meetings m 
           LEFT JOIN meeting_participants mp ON m.id = mp.meeting_id 
           WHERE m.created_by = $1 OR mp.email = $2 
           ORDER BY m.start_time ASC LIMIT 5`,
          [user.id, user.email]
        );
        if (meetingResult.rowCount > 0) {
          dbContext += `\nYour Upcoming/Related Meetings:\n` + meetingResult.rows.map(m => 
            `- Meeting "${m.title}" starting at ${new Date(m.start_time).toLocaleString()}. Link: ${m.google_meet_link || 'No Google Meet link'}.`
          ).join('\n');
        } else {
          dbContext += `\nYour Upcoming Meetings:\nYou have no upcoming meetings scheduled.\n`;
        }
      } catch (e) {
        console.error("Error fetching meetings for chatbot context:", e);
      }

      // Fetch recent public announcements (notices)
      try {
        const noticeResult = await pool.query(
          `SELECT title, description, created_at 
           FROM notices 
           ORDER BY created_at DESC LIMIT 3`
        );
        if (noticeResult.rowCount > 0) {
          dbContext += `\nRecent Company Notices/Announcements:\n` + noticeResult.rows.map(n => 
            `- "${n.title}" posted on ${new Date(n.created_at).toLocaleDateString()}: ${n.description}`
          ).join('\n');
        }
      } catch (e) {
        console.error("Error fetching notices for chatbot context:", e);
      }
    }

    let systemPrompt = '';
    if (user) {
      systemPrompt = `You are "Flowbit AI Support Chatbot", the friendly and professional AI assistant for the "Flowbit" website (a comprehensive company productivity suite, formerly known as Syncaura).
Your task is to help the company's employees and admins answer queries about the website, how to use it, and answer questions about their own data.

About the Flowbit platform and features:
1. **Attendance & Leave Management** (accessible on the menu/sidebar at "/attendance-leave"):
   - Attendance marking: Users can mark attendance by clicking "Check-In" or "CheckOut" on the "Mark the Presence" card modal. They select a date, choose check-in/checkout, and mark attendance.
   - Leave requests: Users can apply for leaves by clicking the "Apply Leave" button at the bottom right. The leave list shows status (pending, approved, rejected).
2. **Tasks** (accessible at "/tasks"):
   - Users view their tasks on a board/list.
   - Tasks have title, description, priority, deadline, status ("TODO", "IN_PROGRESS", "DONE").
   - Users can update status, add subtasks, and view Gantt charts for timelines.
3. **Meetings** (accessible at "/meetings"):
   - Users can create meetings, list attendees, and get a generated Google Meet link.
4. **Chat** (accessible at "/chat"):
   - A Slack-like message system with channels (public and private) and direct messages.
5. **Notices** (accessible at "/notice"):
   - Admin announcements and notices.
6. **Documents** (accessible at "/documents"):
   - Collaborative documents.
7. **Complaints** (accessible at "/complaints"):
   - Users can file workplace issues or complaints. They can file anonymously if they wish. Admins review and resolve them.
8. **Settings** (accessible at "/settings"):
   - Manage user details and dark/light themes.

Current User Context:
- User Name: ${user.name}
- User Email: ${user.email}
- User Role: ${user.role} (e.g. user, admin, co-admin)
${dbContext}

Rules:
- Be concise, professional, and friendly.
- Refer to the platform as "Flowbit".
- Use the user's name ("${user.name}") where appropriate to feel personalized.
- Answer queries directly based on the context. If the user asks about their tasks, meetings, or leaves, summarize the database results fetched for them.
- If the user asks about something not in their database record, guide them on how they can perform that action on the Flowbit site (e.g. "To apply for leave, navigate to the Attendance & Leave page...").
- Keep replies clean and format with simple markdown or bullet points. Avoid markdown tables as they can overflow in the chatbot widget.
`;
    } else {
      systemPrompt = `You are "Flowbit AI Support Chatbot", the friendly and professional AI assistant for the "Flowbit" website (a comprehensive company productivity suite, formerly known as Syncaura).
The user is currently a Guest/Visitor who is NOT logged in.

About the Flowbit platform and features:
1. **Attendance & Leave Management** (accessible at "/attendance-leave"):
   - Attendance marking: Users can mark attendance by clicking "Check-In" or "CheckOut" on the "Mark the Presence" card modal. They select a date, choose check-in/checkout, and mark attendance.
   - Leave requests: Users can apply for leaves by clicking the "Apply Leave" button at the bottom right. The leave list shows status (pending, approved, rejected).
2. **Tasks** (accessible at "/tasks"):
   - Users view their tasks on a board/list.
   - Tasks have title, description, priority, deadline, status ("TODO", "IN_PROGRESS", "DONE").
   - Users can update status, add subtasks, and view Gantt charts for timelines.
3. **Meetings** (accessible at "/meetings"):
   - Users can create meetings, list attendees, and get a generated Google Meet link.
4. **Chat** (accessible at "/chat"):
   - A Slack-like message system with channels (public and private) and direct messages.
5. **Notices** (accessible at "/notice"):
   - Admin announcements and notices.
6. **Documents** (accessible at "/documents"):
   - Collaborative documents.
7. **Complaints** (accessible at "/complaints"):
   - Users can file workplace issues or complaints. They can file anonymously if they wish. Admins review and resolve them.
8. **Settings** (accessible at "/settings"):
   - Manage user details and dark/light themes.

Rules:
- Be concise, welcoming, professional, and friendly.
- Refer to the platform as "Flowbit".
- Since the user is not logged in, if they ask about their tasks, meetings, leaves, or personal data, kindly prompt them to Sign In or Sign Up first using the links at the top right of the homepage.
- Explain the features of Flowbit if they ask about what they can do on the platform.
- Keep replies clean and format with simple markdown or bullet points.
`;
    }

    let reply = '';
    let usedModel = '';
    const geminiKey = process.env.GEMINI_API_KEY;
    const openAIKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        console.log("Attempting to query Gemini API...");
        const contents = [];
        if (history && Array.isArray(history)) {
          const contextHistory = history.slice(-6);
          contextHistory.forEach(msg => {
            contents.push({
              role: msg.from === 'user' ? 'user' : 'model',
              parts: [{ text: msg.text }]
            });
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const geminiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`,
          {
            contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500
            }
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          reply = geminiRes.data.candidates[0].content.parts[0].text;
          usedModel = 'Gemini';
          console.log("Gemini API call succeeded!");
        } else {
          throw new Error("Invalid response structure from Gemini API");
        }
      } catch (geminiErr) {
        console.error("Gemini API call failed:", geminiErr.response?.data || geminiErr.message);
        if (openAIKey) {
          console.log("Falling back to OpenAI API...");
        } else {
          throw geminiErr;
        }
      }
    }

    // If Gemini wasn't used/failed, and OpenAI is available
    if (!reply && openAIKey) {
      const apiMessages = [
        { role: "system", content: systemPrompt }
      ];

      if (history && Array.isArray(history)) {
        const contextHistory = history.slice(-6);
        contextHistory.forEach(msg => {
          apiMessages.push({
            role: msg.from === 'user' ? 'user' : 'assistant',
            content: msg.text
          });
        });
      }

      apiMessages.push({ role: "user", content: message });

      const openAIRes = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAIKey}`
          }
        }
      );

      reply = openAIRes.data.choices[0].message.content;
      usedModel = 'OpenAI';
      console.log("OpenAI API call succeeded!");
    }

    if (!reply) {
      return res.status(500).json({
        reply: "No AI API keys are configured or active on the server. Please check your .env settings."
      });
    }

    return res.json({ reply, model: usedModel });

  } catch (error) {
    console.error("Chatbot Error:", error.response?.data || error.message);
    const errorMessage = error.response?.data?.error?.message || "Sorry, I encountered an error communicating with the AI service. Please check configured API keys.";
    return res.status(500).json({ 
      reply: errorMessage
    });
  }
});

export default router;
