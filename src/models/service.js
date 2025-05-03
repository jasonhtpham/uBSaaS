import mongoose, { Schema } from "mongoose";

const service = new Schema({
  url: { type: String, trim: true, required: true },
  name: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  endpoint: { type: String, trim: true, required: true },
  requirements: { type: String, trim: true, required: true },
  cost: { type: String, trim: true, required: true },
  creator_id: { type: Schema.Types.ObjectId, ref: "user", required: true },
  requires_asset_opt_in: { type: Boolean, required: true },
  active: { type: Boolean, default: true }
});

export default mongoose.model("service", service);
