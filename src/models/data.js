import mongoose, {Schema} from "mongoose";

const Data = new Schema({
  // jobId: { type: String, unique: true, sparse: true }, job_Id is for userID.
  creatorID: {type: Schema.Types.ObjectId, ref: "user", required: true},
  // jobCreator: { type: Schema.Types.ObjectId, ref: "user", required: true },
  name: {type: String, trim: true, required: true},
  description: {type: String, default: "Description", trim: true, required: true},
  dataURL: {type: String, default: "NO URL GENERATED YET", trim: true, required: true},
});

export default mongoose.model('Data', Data);
