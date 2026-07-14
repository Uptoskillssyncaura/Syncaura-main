import pool from "../config/db.js";
import { sendEmail } from "../services/emailService.js"; // Change if your function name differs

/**
 * Send email for unread notifications
 */
export const sendNotificationEmails = async () => {

    try {

        const result = await pool.query(`
            SELECT
                n.id,
                n.title,
                n.message,
                u.email,
                u.name
            FROM notifications n
            JOIN users u
                ON n.recipient = u.id
            WHERE
                n.data->>'email_sent' IS NULL
        `);

        for (const notification of result.rows) {

            try {

                await sendEmail({

                    to: notification.email,

                    subject: notification.title,

                    html: `
                        <h2>Hello ${notification.name}</h2>

                        <p>${notification.message}</p>

                        <hr>

                        <p>SyncAura Notification System</p>
                    `
                });

                await pool.query(
                    `
                    UPDATE notifications
                    SET data = COALESCE(data,'{}'::jsonb)
                    || '{"email_sent":true}'::jsonb
                    WHERE id=$1
                    `,
                    [notification.id]
                );

                console.log(`Email sent to ${notification.email}`);

            } catch (err) {

                console.log(err.message);

            }

        }

    } catch (err) {

        console.log(err.message);

    }

};