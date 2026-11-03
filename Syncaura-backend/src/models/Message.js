import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    default: null,
  },
  messageType:{
    type:String,
    enum:["text","image","file","audio"],
    default:"text",
  },
  fileUrl:{
    type:String,
    default:null,
  },
  seenBy:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);