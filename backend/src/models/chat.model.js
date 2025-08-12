import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userLanguage: {
    type: String,
    default: 'en'
  }
});

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'New conversation'
  },
  messages: [messageSchema],
  userLanguage: {
    type: String,
    default: 'en'
  },
  // Location information for location-based advice
  location: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    },
    city: {
      type: String,
      default: null
    },
    state: {
      type: String,
      default: null
    },
    country: {
      type: String,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt field when messages change
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for message count
conversationSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Ensure virtual fields are serialized
conversationSchema.set('toJSON', { virtuals: true });
conversationSchema.set('toObject', { virtuals: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
