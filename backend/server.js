import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './src/routes/auth.js';
import equipmentRoutes from './src/routes/equipment.js';
import loanRoutes from './src/routes/loan.js';

dotenv.config();
const app = express();

// ✅ Allow CORS from everywhere (for local dev)
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/loans', loanRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB Error:', err));
