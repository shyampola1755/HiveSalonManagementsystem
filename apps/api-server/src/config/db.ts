import mongoose from 'mongoose';
import { ENV } from './env';

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Successfully connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error:`, error);
    // Don't kill process immediately in dev so app can still serve helpful health check error
    if (ENV.NODE_ENV === 'production') {
      process.exit(1);
    }
    throw error;
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection re-established');
});
