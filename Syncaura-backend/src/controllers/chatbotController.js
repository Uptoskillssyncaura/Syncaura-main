import pool from '../config/db.js';
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: "Message is required." });
    }

    const userId = req.user.id;
    const userEmail = req.user.email;
    const userName = req.user.name;
    const userRole = req.user.role || 'user';

    // Scrape/fetch database context based on message content
    const lowerMessage = message.toLowerCase();
    let dbContext = {};
    let fetchedCategories = [];

    // 1. Projects
    if (lowerMessage.includes('project')) {
      const result = await pool.query(
        "SELECT id, name, description, status FROM projects WHERE created_by = $1 OR status = 'ACTIVE' LIMIT 10",
        [userId]
      );
      dbContext.projects = result.rows;
      fetchedCategories.push('projects');
    }

    // 2. Tasks
    if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
      const result = await pool.query(
        "SELECT t.id, t.title, t.description, t.status, t.priority, t.deadline, p.name as project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.assigned_to = $1 OR t.assigned_to = $2 OR t.assigned_to = $3 LIMIT 15",
        [userId, userEmail, userName]
      );
      dbContext.tasks = result.rows;
      fetchedCategories.push('tasks');
    }

    // 3. Meetings
    if (lowerMessage.includes('meeting') || lowerMessage.includes('meet') || lowerMessage.includes('appointment')) {
      const result = await pool.query(
        `SELECT m.id, m.title, m.description, m.start_time, m.end_time, m.google_meet_link 
         FROM meetings m 
         LEFT JOIN meeting_participants p ON m.id = p.meeting_id 
         WHERE m.created_by = $1 OR p.email = $2 
         ORDER BY m.start_time ASC LIMIT 10`,
        [userId, userEmail]
      );
      dbContext.meetings = result.rows;
      fetchedCategories.push('meetings');
    }

    // 4. Notices
    if (lowerMessage.includes('notice') || lowerMessage.includes('announcement') || lowerMessage.includes('broadcast')) {
      const result = await pool.query(
        "SELECT id, title, description, created_by, created_at FROM notices ORDER BY created_at DESC LIMIT 5"
      );
      dbContext.notices = result.rows;
      fetchedCategories.push('notices');
    }

    // 5. Complaints
    if (lowerMessage.includes('complaint') || lowerMessage.includes('issue')) {
      const result = await pool.query(
        "SELECT id, title, description, category, severity, status FROM complaints WHERE filed_by = $1 LIMIT 10",
        [userId]
      );
      dbContext.complaints = result.rows;
      fetchedCategories.push('complaints');
    }

    // Standard Workspace Info fallback if no database tables matched
    if (fetchedCategories.length === 0) {
      const projectsCount = await pool.query("SELECT COUNT(*) FROM projects WHERE created_by = $1", [userId]);
      const tasksCount = await pool.query("SELECT COUNT(*) FROM tasks WHERE assigned_to = $1 OR assigned_to = $2", [userId, userEmail]);
      const meetingsCount = await pool.query(
        "SELECT COUNT(*) FROM meetings m LEFT JOIN meeting_participants p ON m.id = p.meeting_id WHERE m.created_by = $1 OR p.email = $2",
        [userId, userEmail]
      );
      dbContext.summary = {
        userName,
        userRole,
        projectsCount: parseInt(projectsCount.rows[0].count),
        tasksCount: parseInt(tasksCount.rows[0].count),
        meetingsCount: parseInt(meetingsCount.rows[0].count)
      };
    }

    const provider = process.env.LLM_PROVIDER || 'ollama';
    const apiKey = process.env.GEMINI_API_KEY;
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3';

    let modelFailed = false;

    const systemPrompt = `You are Syncaura AI, the virtual assistant for the Syncaura workspace management portal.
You help customers and team members access information easily and effectively.

User Information:
- Name: ${userName}
- Role: ${userRole}
- Email: ${userEmail}

Database Context (from PostgreSQL):
${JSON.stringify(dbContext, null, 2)}

Instructions:
1. Use the Database Context to answer questions about projects, tasks, meetings, complaints, and notices when relevant.
2. Present lists or details using clear, professional, and well-structured Markdown (like lists, tables, bold text, bullet points).
3. If no database records exist for a request, state that politely (e.g., "You do not have any active tasks assigned right now.").
4. Keep answers friendly, concise, and helpful.
5. If the user asks you to do something you cannot do (like update a task), guide them on how to do it manually in the portal.
6. Make sure to refer to the user by their name (${userName}) if appropriate.`;

    if (provider === 'gemini' && apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
      try {
        // Gemini Integration
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `User: ${message}`;
        const result = await model.generateContent([
          { text: systemPrompt },
          { text: prompt }
        ]);
        
        const reply = result.response.text();
        return res.json({ reply });
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local context mode:", geminiError.message);
        modelFailed = true;
      }
    } else if (provider === 'ollama') {
      try {
        // Ollama Integration
        const response = await axios.post(`${ollamaUrl}/api/chat`, {
          model: ollamaModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          stream: false
        }, {
          timeout: 90000 // 90s timeout (allows model loading on startup)
        });

        if (response.data && response.data.message && response.data.message.content) {
          const reply = response.data.message.content;
          return res.json({ reply });
        } else {
          throw new Error("Invalid response format from Ollama");
        }
      } catch (ollamaError) {
        console.warn("Ollama API call failed, falling back to local context mode:", ollamaError.message);
        modelFailed = true;
      }
    }

    // Local fall-back response generation (if API key is missing or failed)
    let reply = `👋 Hi ${userName}! Here is what I retrieved from your Syncaura workspace databases for you:\n\n`;

      if (fetchedCategories.includes('projects')) {
        reply += `### 📁 Projects:\n`;
        if (dbContext.projects && dbContext.projects.length > 0) {
          dbContext.projects.forEach(p => {
            reply += `- **${p.name}** (${p.status}): ${p.description || 'No description provided'}\n`;
          });
        } else {
          reply += `_No active projects found._\n`;
        }
      }

      if (fetchedCategories.includes('tasks')) {
        reply += `\n### 📝 Your Tasks:\n`;
        if (dbContext.tasks && dbContext.tasks.length > 0) {
          dbContext.tasks.forEach(t => {
            const dateStr = t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline';
            reply += `- **${t.title}** [${t.status}] (Priority: ${t.priority}, Due: ${dateStr}) - ${t.description || 'No details'}\n`;
          });
        } else {
          reply += `_No tasks assigned to you._\n`;
        }
      }

      if (fetchedCategories.includes('meetings')) {
        reply += `\n### 📅 Meetings:\n`;
        if (dbContext.meetings && dbContext.meetings.length > 0) {
          dbContext.meetings.forEach(m => {
            const startStr = new Date(m.start_time).toLocaleString();
            const linkStr = m.google_meet_link ? `[Join Meet](${m.google_meet_link})` : 'No meeting link';
            reply += `- **${m.title}**: starts at ${startStr} (${linkStr})\n`;
          });
        } else {
          reply += `_No upcoming meetings found._\n`;
        }
      }

      if (fetchedCategories.includes('notices')) {
        reply += `\n### 📢 Announcements / Notices:\n`;
        if (dbContext.notices && dbContext.notices.length > 0) {
          dbContext.notices.forEach(n => {
            reply += `- **${n.title}** (by ${n.created_by}): ${n.description}\n`;
          });
        } else {
          reply += `_No recent announcements._\n`;
        }
      }

      if (fetchedCategories.includes('complaints')) {
        reply += `\n### ⚠️ Complaints filed by you:\n`;
        if (dbContext.complaints && dbContext.complaints.length > 0) {
          dbContext.complaints.forEach(c => {
            reply += `- **${c.title}** (${c.category}, status: ${c.status}) - ${c.description}\n`;
          });
        } else {
          reply += `_No complaints filed._\n`;
        }
      }

      if (fetchedCategories.length === 0) {
        reply += `I can query and display information about your **projects**, **tasks**, **meetings**, **notices**, and **complaints**.\n\n`;
        reply += `**Current Workspace Summary:**\n`;
        reply += `- Projects Managed: **${dbContext.summary.projectsCount}**\n`;
        reply += `- Tasks Assigned: **${dbContext.summary.tasksCount}**\n`;
        reply += `- Meetings Scheduled: **${dbContext.summary.meetingsCount}**\n\n`;
      }

      if (modelFailed) {
        if (provider === 'ollama') {
          reply += `\n> 💡 *Note: The AI assistant is currently showing database records directly because the local Ollama service (model: "${ollamaModel}" at ${ollamaUrl}) could not be reached. Make sure Ollama is running on your machine.*`;
        } else {
          reply += `\n> 💡 *Note: The AI assistant is currently showing database records directly because your Gemini API key has hit a rate limit or quota restriction.*`;
        }
      } else if (provider === 'gemini' && (!apiKey || apiKey === 'your_gemini_api_key_here')) {
        reply += `\n> 💡 *Tip for Admin: Set the \`GEMINI_API_KEY\` environment variable in the backend \`.env\` file to enable full conversational AI with Gemini!*`;
      }

      return res.json({ reply });
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    return res.status(500).json({ message: "An error occurred while processing your request.", error: error.message });
  }
};
