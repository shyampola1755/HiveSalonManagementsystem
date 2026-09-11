import mongoose from 'mongoose';
import { ENV } from './env';
import { User } from '../models/User';
import { seedData } from '../seed';

let mongoMemoryServer: any = null;

export const connectDB = async (): Promise<typeof mongoose> => {
  try {
    console.log(`[MongoDB] Connecting to: ${ENV.MONGO_URI}...`);
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[MongoDB] Database is empty. Auto-seeding initial demo records...');
      await seedData();
    }

    return conn;
  } catch (error: any) {
    console.warn(`[MongoDB] External MongoDB server (${ENV.MONGO_URI}) not reachable: ${error.message}`);
    console.log('[MongoDB] Initializing high-speed embedded In-Memory MongoDB engine...');

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'hive_salon_db',
        },
      });
      const memoryUri = mongoMemoryServer.getUri();
      console.log(`[MongoDB] Embedded In-Memory MongoDB active at: ${memoryUri}`);

      const conn = await mongoose.connect(memoryUri, {
        autoIndex: true,
      });

      console.log('[MongoDB] Auto-seeding embedded database with complete enterprise demo data...');
      await seedData();
      return conn;
    } catch (memErr) {
      console.error('[MongoDB] Failed to start embedded MongoDB server:', memErr);
      throw memErr;
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Connection re-established');
});
