const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
 * The holding record for a phone that has been sent a registration OTP but has no account yet.
 * Copied from acadza-backend, `count` (the remaining wrong-OTP attempts) and the 30-minute TTL
 * index included: register refuses any phone without a verified TempUser, so this is the gate.
 */
const tempuserSchema = new Schema(
  {
    phone: { type: String },
    phoneOtp: { type: String },
    email: { type: String },
    emailOtp: { type: String },
    count: { type: Number, default: 10 },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    usercreated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

tempuserSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 1800 });
module.exports = mongoose.model("TempUser", tempuserSchema);
