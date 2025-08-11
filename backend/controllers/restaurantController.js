import express from 'express';
import { loginRestaurant, registerRestaurant } from '../services/restaurantService.js';
import restaurantRegistered from '../middlewares/restaurantRegistered.js';


const router = express.Router();

// Регистрация на ресторант (само от админ - ти)
router.post('/register', async (req, res) => {
  try {
    const result = await registerRestaurant(req.body);
    res.status(201).json({ message: 'Ресторантът е регистриран успешно.', result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Проверка дали ресторант съществува
router.get('/:restaurantName/check', restaurantRegistered, (req, res) => {
  res.status(200).json({ message: 'OK' });
});

// Логин на ресторант
router.post('/:restaurantName/login', restaurantRegistered, async (req, res) => {
  const { email, password } = req.body;
  const { restaurantName } = req.params;

  try {
    const result = await loginRestaurant(email, password, restaurantName);

    // Задаваме токен в HttpOnly cookie
    res.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',              // по-щадящо за навигация
      maxAge: 24 * 60 * 60 * 1000,  // 1 ден
      path: '/',                    // валидно за целия сайт
    });

    res.status(200).json({
      message: '✅ Успешен вход',
      restaurantName: result.user.restaurantName,
      email: result.user.email,
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
});

export default router;
