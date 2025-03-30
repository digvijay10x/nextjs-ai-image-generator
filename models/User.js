import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true }, // Unique username
    bio: { type: String, default: "" }, // User bio
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "users" } // Store profiles in the 'users' collection
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
