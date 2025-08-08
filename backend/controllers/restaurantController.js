import express from 'express';
import jwt from 'jsonwebtoken';
import { loginRestaurant, registerRestaurant } from '../services/restaurantService.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'secret';

// 🧾 Роутове
const ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
  LOGOUT: '/logout',
  ME: '/me',
};

// 🍪 Настройки на cookie
const COOKIE_NAME = 'token';
const COOKIE_CONFIG = {
  httpOnly: true,
  sameSite: 'Lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 24 * 60 * 60 * 1000, // 1 ден
};

// 👉 Регистрация
router.post(ROUTES.REGISTER, async (req, res) => {
  try {
  console.log('📨 Регистрационни данни:', req.body); // 🔍 ВАЖНО
    const user = await registerRestaurant(req.body);
    res.status(201).json(user);

  } catch (err) {
    let message = err.message;
    if (err.name === 'ValidationError') {
      const firstError = Object.values(err.errors)[0];
      message = firstError?.message || 'Invalid input';
    }
    res.status(400).json({ message });
  }
});

// 👉 Логване
router.post(ROUTES.LOGIN, async (req, res) => {
  try {
    const { token, user } = await loginRestaurant(req.body.email, req.body.password);
    res.cookie(COOKIE_NAME, token, COOKIE_CONFIG);
    res.status(200).json(user);
  } catch (err) {
    res.status(401).json({ message: 'Невалиден e-mail или парола' });
  }
});

// 👉 Изход
router.post(ROUTES.LOGOUT, (req, res) => {
  res.clearCookie(COOKIE_NAME, COOKIE_CONFIG);
  res.status(204).end();
});

// 👉 Провери токена и върни потребителските данни
router.get(ROUTES.ME, (req, res) => {
  const token = req.cookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: 'No token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    res.status(200).json({
      _id: decoded._id,
      username: decoded.username,
      email: decoded.email,
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});




export default router;
