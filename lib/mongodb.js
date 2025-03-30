import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error(
    "⚠️ Please define the MONGO_URI environment variable in .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("📡 Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
