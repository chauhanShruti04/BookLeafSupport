
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "book",
      default: null,
    },
    bookTitle: {
      type: String,
      default: "General / Account Level",
    },
    category: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    attachment: {
      type: String,
      default: "",
    },
    adminReply: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

ticketSchema.pre("validate", function () {
  if (!this.ticketId) {
    this.ticketId = `TKT-${Date.now()}`;
  }
});

module.exports = mongoose.model("Ticket", ticketSchema);
