import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  content: {
    type: String,
    required: [true, 'Please provide content']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'trading-basics',
      'technical-analysis',
      'fundamental-analysis',
      'algorithmic-trading',
      'risk-management',
      'other'
    ]
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', ResourceSchema);