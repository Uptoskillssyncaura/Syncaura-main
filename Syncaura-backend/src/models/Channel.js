import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
    isPrivate: {
    type: Boolean,
    default: false,
  },
    allowedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
   maxMembers: {
      type: Number,
      default: 5
    },
      createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isPublic: {
  type: Boolean,
  default: true,
},

}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);