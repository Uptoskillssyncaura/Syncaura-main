import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Project",
  required: false // keep optional for now
},
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
  default: "TODO"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },
    assignedTo: {
      type: String
    },
    deadline: {
      type: Date
    },
    dependencies: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
  },
],
reminderAt: {
  type: Date,
},
startDate: Date,
endDate: Date,

     subtasks: [
      {
        title: { type: String, required: true },
        status: {
          type: String,
          enum: ["TODO", "DONE"],
          default: "TODO",
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
