import mongoose, { Schema } from "mongoose";

const serviceInfo = new Schema({
  apiKey: { type: String, trim: true, required: true },
  name: { type: String, trim: true, required: true },
  registrationDate: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "user", required: true }
});

export default mongoose.model("serviceInfo", serviceInfo);