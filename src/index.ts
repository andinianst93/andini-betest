import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
    await redis.ping();
    console.log("Connected to Redis");
  } catch (error) {
    console.error(error);
  }

  app.listen(4000, () => {
    console.log("Server is listening on port 4000");
  });
};

start();
