import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import routes from './routes.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.use('/', routes);

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Страницата не съществува' });
});

export default app;
