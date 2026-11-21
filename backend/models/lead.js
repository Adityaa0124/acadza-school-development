const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Chronological log entry tracking interactions, status handovers, and counsel notes.
 */
const HistorySchema = new Schema(
  {
    actor: { type: String, default: "Admissions Desk" },
    at: { type: Date, default: Date.now },
    text: { type: String, required: true },
  },
  { _id: true }
);

/**
 * Admissions Lead / Enquiry Model
 * Reflects complete lifecycle from clerk intake to calling desk, entrance evaluation, and admission.
 */
const LeadSchema = new Schema(
  {
    leadId: { type: String, required: true, unique: true },
    school: { type: String, default: "Acadza Greenfield School" },
    student: { type: String, required: true },
    parent: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    alternate: { type: String, default: "" },
    grade: { type: String, required: true },
    source: {
      type: String,
      enum: ["Walk-in", "Phone", "Website", "Referral", "School event", "Other"],
      default: "Walk-in",
    },
    cycle: { type: String, default: "2027/28" },
    stage: {
      type: String,
      enum: [
        "ENQUIRY",
        "INTERESTED",
        "READY_FOR_CBT",
        "CBT_SCHEDULED",
        "CBT_COMPLETED",
        "ADMISSION_IN_PROGRESS",
        "CONVERTED",
        "LOST",
        "INVALID",
      ],
      default: "ENQUIRY",
      index: true,
    },
    caller: { type: String, default: null },
    nextAction: { type: String, default: "Arrange welcome call" },
    due: { type: Date, default: null, index: true },
    lastOutcome: { type: String, default: "" },
    history: [HistorySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", LeadSchema);

