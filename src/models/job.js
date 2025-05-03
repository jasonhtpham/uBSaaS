import mongoose, { Schema } from "mongoose";

const MLJob = new Schema({
  // jobId: { type: String, unique: true, sparse: true }, job_Id is for userID.
  serviceID: { type: Schema.Types.ObjectId, ref: "service", required: true },
  jobName: { type: String },
  jobCreator: { type: Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: String, default: Date.now.toString() },
  jobStatus: {
    type: String,
    enum: ["INITIATED", "RUNNING", "FAILED", "SUCCESS"],
  },
  firebaseMessagingToken: { type: String, default: "" },
  executionTime: { type: String, default: "Calculating..." },
  dataURL: { type: Object, default: "NO URL GENERATED YET" },
  insightsURL: { type: Object, default: "NO URL GENERATED YET" },
  returnData: { type: Object, required: false },
});

export default mongoose.model("MLJob", MLJob);
