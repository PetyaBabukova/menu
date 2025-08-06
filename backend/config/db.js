import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🟢 Успешна връзка с MongoDB');
  } catch (error) {
    console.error('🔴 Грешка при връзка с MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;
