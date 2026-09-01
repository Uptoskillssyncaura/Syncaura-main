import { google } from "googleapis";
import { getCalendarClient } from "../utils/googleAuth.js";

export const createCalendarEvent = async ({
  tokens,
  userId,
  title,
  description,
  startTime,
  endTime,
}) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    const event = await calendar.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: title,
        description,
        start: {
          dateTime: startTime,
        },
        end: {
          dateTime: endTime,
        },
        conferenceData: {
          createRequest: {
            requestId: Date.now().toString(),
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    return event.data;
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    throw new Error(error.message || "Failed to create Google Calendar event.");
  }
};

export const updateCalendarEvent = async (
  eventId,
  {
    tokens,
    userId,
    title,
    description,
    startTime,
    endTime,
  }
) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    const event = await calendar.events.update({
      calendarId: "primary",
      eventId,
      requestBody: {
        summary: title,
        description,
        start: {
          dateTime: startTime,
        },
        end: {
          dateTime: endTime,
        },
      },
    });

    return event.data;
  } catch (error) {
    console.error("Error updating Google Calendar event:", error);
    throw new Error(error.message || "Failed to update Google Calendar event.");
  }
};

export const deleteCalendarEvent = async (eventId, tokens, userId = null) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });

    return {
      success: true,
      message: "Google Calendar event deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
    throw new Error(error.message || "Failed to delete Google Calendar event.");
  }
};

export const listCalendarEvents = async ({ tokens, userId, timeMin, timeMax }) => {
  try {
    const calendar = getCalendarClient(tokens, userId);
    const response = await calendar.events.list({
      calendarId: "primary",
      timeMin: timeMin || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      timeMax: timeMax || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Error listing Google Calendar events:", error);
    throw new Error(error.message || "Failed to fetch Google Calendar events.");
  }
};
