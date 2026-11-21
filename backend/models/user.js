const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/*
 * The User schema of acadza-backend, trimmed to the fields login/register actually touch.
 * Field names and defaults are kept verbatim so a record written here is shaped like a record
 * written there — `role` defaults to "student", `planType` to "silver", `course` to "JEE".
 */
const UserSchema = new Schema(
  {
    name: { type: String },
    username: { type: String },
    phone: { type: String },
    password: { type: String },
    role: { type: String, default: "student" }, //['superadmin','staff','teacher','parent','student', coaching]
    email: { type: String },
    city: { type: String },
    language: { type: String },
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    planType: { type: String, default: "silver" },
    course: { type: String, default: "JEE" },
    programme: { type: String },
    signupMode: { type: String },
    signupCoupon: { type: String },
    referralCode: { type: String },
    orionClass: { type: Number },
    reference: { type: String, default: "" },
    isBlocked: { type: Boolean, default: false },
    deviceId: { type: String },
    deviceType: { type: String },
    lastActive: { type: Date },
    meta: {},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
