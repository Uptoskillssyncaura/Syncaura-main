import mongoose from "mongoose";
const noteSchema=new mongoose.Schema({
    meetingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Meeting",
        required:true,
    },
    content:{
        type:String,
        required:true,
     },
},
    {timestamps:true}

);


export default mongoose.model("Note",noteSchema);

// export default mongoose.model("Note",noteSchema);

