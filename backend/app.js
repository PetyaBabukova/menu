import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes.js';
import errorHandler from './middlewares/errorHandler.js';

// Импорт на mongoose за свързване към MongoDB
import mongoose from 'mongoose';

// Зареждаме .env файлът, ако съществува
dotenv.config();

const app = express();

// Настройка на CORS – разрешаваме изпращане на cookie от клиента
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
// Поддържаме JSON заявки
app.use(express.json());
// Cookie parser – за четене на HttpOnly бисквитки
app.use(cookieParser());

// -----------------------
// Свързване към MongoDB
// Използваме променливите на средата MONGO_URI или MONGODB_URI
// Ако липсват, извеждаме предупреждение.
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (mongoUri) {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Успешно свързване към MongoDB.');
    })
    .catch((err) => {
      console.error('Грешка при свързване към MongoDB:', err);
    });
} else {
  console.warn(
    'MONGO_URI не е конфигуриран. Моля, задайте MONGO_URI или MONGODB_URI в .env файла.',
  );
}
// -----------------------

// Главен рутер – всички маршрути се дефинират в router
app.use(router);

// Маршрут за 404 – ако никой рут не съвпадне
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Не съществува такава страница.' });
});

// Глобален обработчик на грешки
app.use(errorHandler);

export default app;