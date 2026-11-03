import pool from "../config/db.js";

/**
 * Create a notification
 */
export const createNotification = async ({
    recipient,
    type,
    title,
    message,
    entityType = null,
    entityId = null,
    actionUrl = null,
    data = {}
}) => {

    const result = await pool.query(
        `
        INSERT INTO notifications
        (
            recipient,
            type,
            title,
            message,
            entity_type,
            entity_id,
            action_url,
            data
        )
        VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `,
        [
            recipient,
            type,
            title,
            message,
            entityType,
            entityId,
            actionUrl,
            data
        ]
    );

    return result.rows[0];
};