import mongoose from 'mongoose';
import { fastify } from '../main';

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error) {
    fastify.log.error(error, 'error connectiong to database');
    process.exit(1);
  }
}
