import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add indexes for frequently queried fields
    await Promise.all([
      mongoose.model('User').createIndexes(),
      mongoose.model('Resource').createIndexes(),
      mongoose.model('StockPrediction').createIndexes()
    ]);
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;