import pool from "../config/db.js";
import { createNotification } from "../utils/notificationService.js";

/**
 * Notify users about meetings starting within 15 minutes
 */
export const sendMeetingReminders = async () => {

    try {

        const meetings = await pool.query(`
            SELECT
                m.id,
                m.title,
                m.start_time,
                u.id AS user_id,
                u.email
            FROM meetings m
            JOIN meeting_participants mp
                ON mp.meeting_id = m.id
            JOIN users u
                ON u.email = mp.email
            WHERE
                m.start_time BETWEEN NOW()
                AND NOW() + INTERVAL '15 minutes'
        `);

        for (const meeting of meetings.rows) {

            const alreadySent = await pool.query(
                `
                SELECT id
                FROM notifications
                WHERE
                    recipient=$1
                    AND entity_id=$2
                    AND type='MEETING_REMINDER'
                `,
                [
                    meeting.user_id,
                    meeting.id
                ]
            );

            if (alreadySent.rowCount > 0)
                continue;

            await createNotification({

                recipient: meeting.user_id,

                type: "MEETING_REMINDER",

                title: "Upcoming Meeting",

                message: `Meeting "${meeting.title}" starts in 15 minutes.`,

                entityType: "meeting",

                entityId: meeting.id,

                actionUrl: `/meetings/${meeting.id}`,

                data: {
                    start_time: meeting.start_time
                }

            });

            console.log(`Meeting reminder created for ${meeting.title}`);

        }

    }
    catch (err) {

        console.log("Meeting Reminder Error");

        console.log(err.message);

    }

};