import cron from "node-cron";

import {
    sendUpcomingTaskReminders,
    sendOverdueTaskReminders
} from "./taskReminder.js";

import {
    sendMeetingReminders
} from "./meetingReminder.js";

import {
    sendNotificationEmails
} from "./emailReminder.js";

cron.schedule("*/5 * * * *", async () => {

    console.log("Running Smart Reminder Scheduler...");

    await sendUpcomingTaskReminders();

    await sendOverdueTaskReminders();

    await sendMeetingReminders();

    await sendNotificationEmails();

});

console.log("Reminder Scheduler Started");