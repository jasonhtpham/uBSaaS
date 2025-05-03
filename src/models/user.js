import mongoose, { Schema } from "mongoose";

const user = new Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true, required: true },
  emailId: { type: String, trim: true, required: true, unique: true },
  phoneNumber: {
    type: String,
    trim: true,
    index: true,
    min: 5,
    max: 15,
  },
  password: { type: String },
  deakinSSO: { type: Boolean, default: false },
  initialPassword: { type: String },
  firstLogin: { type: Boolean, default: false },
  countryCode: { type: String },
  role: { type: String, trim: true, min: 1, max: 1 },
  code: { type: String, trim: true },
  OTPCode: { type: String, trim: true },
  emailVerified: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  codeUpdatedAt: { type: Date, default: Date.now, required: true },
  isBlocked: { type: Boolean, default: false, required: true },
  secretKey: { type: String, required: false },
  services: { type: [Schema.Types.ObjectId], ref: "serviceInfo", required: false }
});

export default mongoose.model("user", user);
