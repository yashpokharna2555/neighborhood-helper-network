// server/models/HelpRequest.js
const mongoose = require("mongoose");

const HelpRequestSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String }, // e.g., 'medical', 'grocery', etc.
    urgency: { type: String, enum: ["Immediate", "Today", "This Week"], default: "Today" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    status: { type: String, enum: ["pending", "accepted", "completed", "cancelled"], default: "pending" },
    acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

HelpRequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("HelpRequest", HelpRequestSchema);
