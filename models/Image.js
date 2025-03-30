import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true, unique: true },
  uploadedBy: { type: String, required: true }, // Email of the uploader
  uploadedByUsername: { type: String, required: true }, // Username of the uploader
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: String }],
});

export default mongoose.models.Image || mongoose.model("Image", ImageSchema);
