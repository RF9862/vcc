import mongoose from "mongoose";

import { MONGODB_DATABASE, MONGODB_HOST, MONGODB_PORT } from "./index.js";

export default async () => {
  try {
    const url = `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DATABASE}`;
    await mongoose.connect(url);
    console.log(`MongoDB is connected to ${url}!`);
  } catch (err) {
    console.error("MongoDB is not connected");
  }
};
