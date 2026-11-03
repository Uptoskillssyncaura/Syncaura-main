import crypto from "crypto";
import { getCalendarClient } from "../utils/googleAuth.js";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || "primary";
const TIME_ZONE = "Asia/Kolkata";

/**
 * Create Google Calendar Event + Google Meet
 */
export const createCalendarEvent = async ({
  tokens,
  userId,
  title,
  description,
  startTime,
  endTime,
  attendees = [],
}) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    const event = await calendar.events.insert({
      calendarId: CALENDAR_ID,

      // Required for Google Meet conference creation
      conferenceDataVersion: 1,

      // Send invitation emails to attendees
      sendUpdates: attendees.length > 0 ? "all" : "none",

      requestBody: {
        summary: title,
        description: description || "",

        start: {
          dateTime: startTime,
          timeZone: TIME_ZONE,
        },

        end: {
          dateTime: endTime,
          timeZone: TIME_ZONE,
        },

        // Meeting participants
        attendees: attendees
          .filter(Boolean)
          .map((email) => ({
            email,
          })),

        // Create Google Meet
        conferenceData: {
          createRequest: {
            requestId: crypto.randomUUID(),

            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      },
    });

    const eventData = event.data;

    // Extract Google Meet URL
    let meetLink = eventData.hangoutLink || null;

    if (!meetLink && eventData.conferenceData?.entryPoints) {
      const videoEntry =
        eventData.conferenceData.entryPoints.find(
          (entry) => entry.entryPointType === "video"
        );

      meetLink = videoEntry?.uri || null;
    }

    return {
      ...eventData,

      meetLink,
    };
  } catch (error) {
    console.error(
      "Error creating Google Calendar event:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Failed to create Google Calendar event."
    );
  }
};


/**
 * Update Google Calendar Event
 */
export const updateCalendarEvent = async (
  eventId,
  {
    tokens,
    userId,
    title,
    description,
    startTime,
    endTime,
    attendees = [],
  }
) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    const event = await calendar.events.update({
      calendarId: CALENDAR_ID,

      eventId,

      sendUpdates: attendees.length > 0 ? "all" : "none",

      requestBody: {
        summary: title,
        description: description || "",

        start: {
          dateTime: startTime,
          timeZone: TIME_ZONE,
        },

        end: {
          dateTime: endTime,
          timeZone: TIME_ZONE,
        },

        ...(attendees.length > 0 && {
          attendees: attendees
            .filter(Boolean)
            .map((email) => ({
              email,
            })),
        }),
      },
    });

    const eventData = event.data;

    let meetLink = eventData.hangoutLink || null;

    if (!meetLink && eventData.conferenceData?.entryPoints) {
      const videoEntry =
        eventData.conferenceData.entryPoints.find(
          (entry) => entry.entryPointType === "video"
        );

      meetLink = videoEntry?.uri || null;
    }

    return {
      ...eventData,

      meetLink,
    };
  } catch (error) {
    console.error(
      "Error updating Google Calendar event:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Failed to update Google Calendar event."
    );
  }
};


/**
 * Delete Google Calendar Event
 */
export const deleteCalendarEvent = async (
  eventId,
  tokens,
  userId = null
) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    await calendar.events.delete({
      calendarId: CALENDAR_ID,

      eventId,

      // Notify attendees about cancellation
      sendUpdates: "all",
    });

    return {
      success: true,

      message:
        "Google Calendar event deleted successfully.",
    };
  } catch (error) {
    console.error(
      "Error deleting Google Calendar event:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Failed to delete Google Calendar event."
    );
  }
};


/**
 * List Google Calendar Events
 */
export const listCalendarEvents = async ({
  tokens,
  userId,
  timeMin,
  timeMax,
}) => {
  try {
    const calendar = getCalendarClient(tokens, userId);

    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,

      timeMin:
        timeMin ||
        new Date(
          Date.now() -
            30 * 24 * 60 * 60 * 1000
        ).toISOString(),

      timeMax:
        timeMax ||
        new Date(
          Date.now() +
            60 * 24 * 60 * 60 * 1000
        ).toISOString(),

      singleEvents: true,

      orderBy: "startTime",

      // Include cancelled events? No
      showDeleted: false,
    });

    return response.data.items || [];
  } catch (error) {
    console.error(
      "Error listing Google Calendar events:",
      error.response?.data || error
    );

    throw new Error(
      error.response?.data?.error?.message ||
        error.message ||
        "Failed to fetch Google Calendar events."
    );
  }
};