import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load .env

// Use local DB for development, Atlas only for production
const isProduction = process.env.NODE_ENV === "production";

const MONGO_URI = isProduction
  ? process.env.MONGO_URI // Atlas connection
  : "mongodb://127.0.0.1:27017/fintech_wallet"; // Local dev

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI!); // Non-null assertion
    console.log(`MongoDB connected successfully: ${isProduction ? "Atlas" : "Local"}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
