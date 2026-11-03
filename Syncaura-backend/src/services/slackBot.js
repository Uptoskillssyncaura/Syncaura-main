import { App } from "@slack/bolt";

export const initSlackBot = async () => {
  const slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
  });

  const handleCommand = async ({ text, user, say, respond }) => {
    const [cmd, ...argsArr] = text.trim().split(" ");
    const args = argsArr.join(" ");

    const reply = say || respond;

    // Basic commands
    switch (cmd.toLowerCase()) {

      // hello - greet the bot
      case "hello":
        return reply(`👋 Hello <@${user}>!`);

      // help - show command guide
      case "help":
        return reply(`🤖 *Bot Command Guide*
          ━━━━━━━━━━━━━━━
          \`hello\` - Greet the bot  
          \`help\` - Show this menu  
          \`ping\` - Check bot status  
          ━━━━━━━━━━━━━━━
          \`time\` - Current time  
          \`date\` - Today's date  
          ━━━━━━━━━━━━━━━
          \`echo <text>\` - Repeat text  
          \`calc <exp>\` - Calculate expression 
          ━━━━━━━━━━━━━━━
          \`remind <sec> <msg>\` - Set reminder  
          \`countdown <seconds>\` - Countdown  
          ━━━━━━━━━━━━━━━
          \`todo add/list/remove\` - Manage tasks
          \`note add/list/delete\` - Manage quick notes
          ━━━━━━━━━━━━━━━
          \`joke\` - Random joke`
        );

      // ping - check bot status
      case "ping":
        return reply("🏓 Pong! Bot is working fine.");

      // time - current time
      case "time":
        return reply(`⏰ ${new Date().toLocaleString()}`);

      // date - current date
      case "date":
        return reply(`📅 ${new Date().toDateString()}`);

      // userinfo - show user info
      case "userinfo":
        return reply(`👤 User Info for <@${user}>`);
      
      // echo - repeat text
      case "echo":
        return reply(args || "No text");
      
      // calc - simple calculator
      case "calc":
        try {
          return reply(`🧮 ${eval(args)}`);
        } catch {
          return reply("❌ Invalid calculation");
        }

      // remind - simple reminder (example: remind 10 Take a break)
      case "remind":
        const [sec, ...msgArr] = args.split(" ");
        const msg = msgArr.join(" ");
        if (!sec || !msg) return reply("Usage: remind <seconds> <msg>");
        setTimeout(() => reply(`⏰ Reminder: ${msg}`), sec * 1000);
        return reply(`⏳ Reminder set for ${sec}s`);

      // countdown - countdown numbers (countdown 5)
      case "countdown":
        const seconds = parseInt(args);
        if (!seconds) return reply("Usage: countdown <seconds>");

        await reply(`⏰ Countdown started! \n⏳ ${seconds}`);

        let remaining = seconds;

        const interval = setInterval(async () => {
          remaining--;

          if (remaining > 0) {
            await reply(`⏳ ${remaining}`);
          } else {
            clearInterval(interval);
            await reply("⏰ Countdown finished!");
          }
        }, 1000);

        return;

      // todo → simple task list
      case "todo":
        const todos = {};
        const [action, ...taskArr] = args.split(" ");
        const task = taskArr.join(" ");
        if (!todos[user]) todos[user] = [];

        if (action === "add") {
          todos[user].push(task);
          return reply(`✅ Added: ${task}`);
        }
        if (action === "list") {
          if (!todos[user].length) return reply("📭 No tasks");
          return reply(
            todos[user].map((t, i) => `${i + 1}. ${t}`).join("\n")
          );
        }
        if (action === "remove") {
          const i = parseInt(task) - 1;
          const removed = todos[user].splice(i, 1);
          return reply(`❌ Removed: ${removed}`);
        }
        return reply(`📝 *Todo Commands:*
          • todo add <task>
          • todo list
          • todo remove <number>`
        );

      // note → quick note list
      case "note":
        const notes = {};
        const [nAction, ...nArr] = args.split(" ");
        const nText = nArr.join(" ");
        if (!notes[user]) notes[user] = [];

        if (nAction === "add") {
          notes[user].push(nText);
          return reply(`📝 Saved`);
        }
        if (nAction === "list") {
          if (!notes[user].length) return reply("📭 No notes");
          return reply(
            notes[user].map((n, i) => `${i + 1}. ${n}`).join("\n")
          );
        }
        if (nAction === "delete") {
          const i = parseInt(nText) - 1;
          const removed = notes[user].splice(i, 1);
          return reply(`❌ Deleted`);
        }
        return reply(`🗒️ *Note Commands:*
          • note add <text>
          • note list
          • note delete <number>`
        );

      // /joke → random joke
      case "joke":
        const jokes = [
          "Why do programmers hate nature? Too many bugs!",
          "Why do Java developers wear glasses? Because they don’t C#!",
          "I told my code a joke… it didn’t compile.",
        ];

        const joke = jokes[Math.floor(Math.random() * jokes.length)];

        return reply(`😂 *Joke Time!*\n${joke}`);

      default:
        return reply(`❌ Unknown command: ${cmd}`);
    }
  };


  // EVENTS

  // Mention handler
  slackApp.event("app_mention", async ({ event, say }) => {
    const text = event.text.replace(/<@[^>]+>/, "").trim();
    await handleCommand({
      text,
      user: event.user,
      say,
    });
  });

  // Basic greeting
  slackApp.message(/hi|hello/i, async ({ message, say }) => {
    await say(`Hey <@${message.user}> 😄`);
  });

  // Slash Commands
  const commands = [
    "hello",
    "help",
    "ping",
    "time",
    "date",
    "echo",
    "calc",
    "remind",
    "countdown",
    "todo",
    "note",
    "joke",
  ];

  // to use slash commands, add following in Slack app configuration:
  /*
    /hello      /calc           /time       /todo
    /help       /remind         /date       /note
    /ping       /countdown      /echo       /joke
  */

  commands.forEach((cmd) => {
    slackApp.command(`/${cmd}`, async ({ command, ack, respond }) => {
      await ack();
      await handleCommand({
        text: `${cmd} ${command.text || ""}`.trim(),
        user: command.user_id,
        respond,
      });
    });
  });

  // START APP
  await slackApp.start();
  console.log("⚡ Slack bot running...");
};

// BOT SETTINGS TO ADD IN SLACK DASHBOARD

// Subscribe to bot events
//    - app_mention
//    - message.channels

// SCOPES
//    - app_mentions:read
//    - chat:write
//    - channels:history
