import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
  },
  topic: {
    type: String,
    enum: ['acquisition', 'activation', 'retention', 'others'],
    default: 'others',
  },
  user: {
    type: String, // Store user's email
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  clicks: [
    {
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
      os: String,
      device: String,
      location: {
        country: String,
        city: String,
      },
    },
  ],
});

const Url = mongoose.model('Url', urlSchema);

export default Url;
