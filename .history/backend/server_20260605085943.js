import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Working!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server on http://localhost:${PORT}`);
});