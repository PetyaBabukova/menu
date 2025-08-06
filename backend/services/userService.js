import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/constants.js';


export async function registerUser(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Невалидни данни', errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Проверка дали потребителят вече съществува
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Потребител с този email или username вече съществува' });
    }

    // Хеширане на паролата
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Създаване на нов потребител
    const newUser = await User.create({ username, email, password: hashedPassword });

    // Генериране на JWT токен
    const token = jwt.sign(
  { id: user._id, username: user.username },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);


    // Задаване на токена в cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дни
    });

    // Връщаме данните на новия потребител (без паролата)
    res.status(201).json({
      message: 'Регистрацията е успешна',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (err) {
    console.error('Грешка при регистрация:', err);
    res.status(500).json({ message: 'Възникна грешка при регистрацията' });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Проверка за празни полета
    if (!email || !password) {
      return res.status(400).json({ message: 'Попълнете всички полета' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Невалиден e-mail или парола' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Невалиден e-mail или парола' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN || '2d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 дни
      sameSite: 'Lax',
    });

    res.status(200).json({ message: 'Успешен вход', user: { username: user.username, id: user._id } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Грешка при вход' });
  }
}