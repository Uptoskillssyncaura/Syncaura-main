import mongoose from "mongoose";
const attachmentSchema=new mongoose.Schema({
    meetingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting",
        required:true,
    },
    fileName:String,
    fileUrl:String,
},
{timestamps:true}
);

export default mongoose.model("Attachment",attachmentSchema);