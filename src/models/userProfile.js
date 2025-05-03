import mongoose, { Schema } from "mongoose";

const userProfile = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  firstName: { type: Schema.Types.String, required: true },
  lastName: { type: Schema.Types.String, required: true },
  role: { type: Schema.Types.String, required: true },
  description: { type: Schema.Types.String, default: null },
  picture: { type: Schema.Types.String, default: null },
  services: [{ type: Schema.Types.ObjectId, ref: "service" }],
  researchInterests: { type: Schema.Types.String, default: null },
  organization: { type: Schema.Types.String, default: null },
  createdAt: { type: Schema.Types.Date, default: Date.now(), required: true },
  updatedAt: { type: Schema.Types.Date, default: Date.now(), required: true },
  signedLogicSig: { type: Array, required: false },
});

export default mongoose.model("userprofile", userProfile);
