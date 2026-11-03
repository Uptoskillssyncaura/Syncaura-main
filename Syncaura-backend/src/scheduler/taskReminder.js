import pool from "../config/db.js";
import { createNotification } from "../utils/notificationService.js";

/**
 * Upcoming task reminders
 */
export const sendUpcomingTaskReminders = async () => {

    try {

        const tasks = await pool.query(
            `
            SELECT
                t.id,
                t.title,
                t.deadline,
                u.id AS user_id,
                u.name
            FROM tasks t
            JOIN users u
                ON t.assigned_to = u.email
            WHERE
                t.deadline IS NOT NULL
                AND t.status != 'DONE'
                AND t.deadline BETWEEN NOW()
                AND NOW() + INTERVAL '30 minutes'
            `
        );

        for (const task of tasks.rows) {

            // Check duplicate notification

            const exists = await pool.query(
                `
                SELECT id
                FROM notifications
                WHERE
                    recipient=$1
                    AND entity_id=$2
                    AND type='TASK_REMINDER'
                `,
                [
                    task.user_id,
                    task.id
                ]
            );

            if (exists.rowCount > 0)
                continue;

            await createNotification({

                recipient: task.user_id,

                type: "TASK_REMINDER",

                title: "Upcoming Task",

                message: `Task "${task.title}" is due within 30 minutes.`,

                entityType: "task",

                entityId: task.id,

                actionUrl: `/tasks/${task.id}`,

                data: {
                    deadline: task.deadline
                }

            });

            console.log(`Reminder created for ${task.title}`);

        }

    }
    catch (err) {

        console.log("Task Reminder Error");

        console.log(err.message);

    }

};  



/**
 * Overdue task reminder
 */

export const sendOverdueTaskReminders = async () => {

    try {

        const tasks = await pool.query(
            `
            SELECT
                t.id,
                t.title,
                t.deadline,
                u.id AS user_id
            FROM tasks t
            JOIN users u
                ON t.assigned_to=u.email
            WHERE
                t.deadline < NOW()
                AND t.status!='DONE'
            `
        );

        for (const task of tasks.rows) {

            const exists = await pool.query(
                `
                SELECT id
                FROM notifications
                WHERE
                    recipient=$1
                    AND entity_id=$2
                    AND type='TASK_OVERDUE'
                `,
                [
                    task.user_id,
                    task.id
                ]
            );

            if (exists.rowCount > 0)
                continue;

            await createNotification({

                recipient: task.user_id,

                type: "TASK_OVERDUE",

                title: "Task Overdue",

                message: `"${task.title}" deadline has passed.`,

                entityType: "task",

                entityId: task.id,

                actionUrl: `/tasks/${task.id}`,

                data: {
                    deadline: task.deadline
                }

            });

            console.log(`${task.title} overdue notification created`);

        }

    }
    catch (err) {

        console.log(err.message);

    }

};