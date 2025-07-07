import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Loads .env locally. In production, Railway Variables are used instead.

console.log('MONGO_URI:', process.env.MONGO_URI); // Good: confirms your env is set!

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // kill the process if connection fails
  }
}
