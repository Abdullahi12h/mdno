import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB Atlas...`);
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Reduced to 5s for faster fallback
    });
    console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Atlas Connection Error: ${error.message}`);
    
    if (error.message.includes('whitelist') || error.message.includes('IP address')) {
      console.error('====================================================');
      console.error('CRITICAL: IP NOT WHITELISTED in MongoDB Atlas!');
      console.error('Please add your current IP to Atlas IP Whitelist.');
      console.error('====================================================');
    }

    console.log('Attempting fallback to local MongoDB...');
    try {
      const localConn = await mongoose.connect('mongodb://127.0.0.1:27017/branch2salma', {
        serverSelectionTimeoutMS: 2000
      });
      console.log(`MongoDB Connected (Local): ${localConn.connection.host}`);
    } catch (localError) {
      console.error(`Local MongoDB Connection Error: ${localError.message}`);
      console.error('Please ensure MongoDB is running locally or fix Atlas Whitelist.');
    }
  }
};

export default connectDB;
