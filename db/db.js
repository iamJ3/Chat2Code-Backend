import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Loads .env locally. In production, Railway Variables are used instead.

console.log('MONGO_URI:', process.env.MONGO_URI); // Good: confirms your env is set!

let isConnected = false;

export default async function connect() {
  try {
    if (isConnected) {
      console.log("✅ Already connected to MongoDB Atlas");
      return { success: true, message: "Already connected" };
    }

    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
    return { success: true, message: "Connected to MongoDB Atlas" };
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    isConnected = false;
    
    // Return error object instead of killing process
    return { 
      success: false, 
      message: "Database connection failed", 
      error: err.message 
    };
  }
}

// Helper function to check if database is connected
export function isDatabaseConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

// Helper function to get connection status
export function getConnectionStatus() {
  return {
    isConnected: isDatabaseConnected(),
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
}
