import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: false,
    },

    participants: {
      type: [String], // emails
      default: [],
    },


    createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    },
   // ✅ Google Calendar integration proof
    googleEventId: {
      type: String,
    },

    googleEventId: {
      type: String,
    },
    googleMeetLink: {
  type: String,
},

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

  },
  { timestamps: true }
);


export default mongoose.model("Meeting", meetingSchema);


