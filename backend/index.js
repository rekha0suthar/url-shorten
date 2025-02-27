import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/UserRoute.js';
import urlRoute from './routes/UrlRoute.js';
import analyticsRoute from './routes/AnalyticsRoute.js';
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // for parsing application/json

// Routes
app.use('/api/auth', userRoute); // User authentication route
app.use('/api', urlRoute); // URL shortening route
app.use('/api/analytics', analyticsRoute); // Analytics route

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
