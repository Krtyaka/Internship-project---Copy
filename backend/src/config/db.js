import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful!");
  } catch (error) {
    console.log("Failed to connect to the database. ", error);
    process.exit(1);
  }
};
