import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import plannerRoutes from './routes/planner.routes';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/planner', plannerRoutes);

app.get('/', (req, res) => {
  res.send('Schedule Planner API');
});

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
    } else {
      console.log('MONGO_URI not found in environment variables. Starting without DB connection.');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDB();
});
