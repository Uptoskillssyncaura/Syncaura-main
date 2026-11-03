import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 2000
    },
    category: {
      type: String,
      enum: ['workplace', 'harassment', 'safety', 'discrimination', 'other'],
      default: 'other',
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      required: true
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open'
    },
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    attachments: [{
      type: String,
      trim: true
    }],
    resolution: {
      type: String,
      trim: true,
      default: null,
      maxlength: 1000
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal'
    },
    isAnonymous: {
      type: Boolean,
      default: false
    },
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      text: {
        type: String,
        required: true,
        trim: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;
