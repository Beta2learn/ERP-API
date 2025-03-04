import mongoose from 'mongoose';

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('MONGO_URI is not defined in the environment variables.');
    process.exit(1); // Exit process if MONGO_URI is not set
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};
