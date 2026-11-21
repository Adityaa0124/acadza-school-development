const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// One row per account, upserted on every register and every login — same as acadza-backend.
const loginTrackSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LoginTrack", loginTrackSchema);
