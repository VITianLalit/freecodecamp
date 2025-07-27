import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connectDB = async () => {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
        console.log("Already connected to MongoDB");
        return;
    }
    if (connectionState === 2) {
        console.log("Connecting to MongoDB...");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI!, {
            dbName: "freecodecamp",
            bufferCommands: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error: any) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB");
    }
}

export default connectDB;