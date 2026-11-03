import {
    sendUpcomingTaskReminders,
    sendOverdueTaskReminders
} from "./scheduler/taskReminder.js";

await sendUpcomingTaskReminders();

await sendOverdueTaskReminders();

process.exit();