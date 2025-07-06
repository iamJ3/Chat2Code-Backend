import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();  // Ensure .env is loaded here if needed

console.log('MONGO_URI:', process.env.MONGO_URI);  // Good debug!

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Exit process if DB fails
  }
}
