import mongoose, { Schema } from "mongoose";

const serviceGroup = new Schema({
  name: { type: String, trim: true, required: true },
  description: { type: String, trim: true, required: true },
  creator: { type: Schema.Types.ObjectId, ref: "user", required: true },
  services: [{ type: Schema.Types.ObjectId, ref: "service" }]
});

export default mongoose.model("serviceGroup", serviceGroup);
