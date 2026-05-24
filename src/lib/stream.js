import { StreamClient } from "@stream-io/node-sdk";

export const getStreamClient = () => {
  if (!process.env.NEXT_PUBLIC_STREAM_API_KEY || !process.env.STREAM_SECRET_KEY) {
    throw new Error("Stream API keys are missing in environment variables.");
  }
  
  return new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_API_KEY,
    process.env.STREAM_SECRET_KEY
  );
};
