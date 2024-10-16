import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('connected to database.');
  } catch (error) {
    console.log('could not connect to database', error);
  }
};
export default dbConnection;
