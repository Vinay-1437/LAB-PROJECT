import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shopkart";
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[MongoDB] Failed to connect to ${uri} (${err.message}).`);
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      const mongod = await MongoMemoryServer.create();
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to In-Memory MongoDB at ${inMemoryUri}`);
    } catch (memErr) {
      console.error("[MongoDB] In-memory MongoDB failed to start:", memErr.message);
      process.exit(1);
    }
  }
};
