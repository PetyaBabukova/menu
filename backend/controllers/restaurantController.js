import express from 'express';
import {
  loginRestaurant,
  registerRestaurant,
} from '../services/restaurantService.js';
import {
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../services/menuService.js';
import restaurantRegistered from '../middlewares/restaurantRegistered.js';

const router = express.Router();

// Регистрация на ресторант (само от админ)
router.post('/register', async (req, res, next) => {
  try {
    const result = await registerRestaurant(req.body);
    res.status(201).json({ message: 'Ресторантът е регистриран успешно.', result });
  } catch (err) {
    // ако грешката няма статус, приемаме 400 (лоша заявка)
    err.status = err.status || 400;
    next(err);
  }
});

// Проверка дали ресторант съществува
router.get('/:restaurantName/check', restaurantRegistered, (req, res) => {
  // middleware restaurantRegistered вече ще върне 404, ако ресторантът липсва
  res.status(200).json({ message: 'OK' });
});

// Вход на ресторант
router.post('/:restaurantName/login', restaurantRegistered, async (req, res, next) => {
  const { email, password } = req.body;
  const { restaurantName } = req.params;

  try {
    const result = await loginRestaurant(email, password, restaurantName);

    // Задаване на токен в HttpOnly cookie
    res.cookie('authToken', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 ден
      path: '/',
    });

    res.status(200).json({
      message: '✅ Успешен вход',
      restaurantName: result.user.restaurantName,
      email: result.user.email,
    });
  } catch (err) {
    // неправилни данни за вход → 401 Unauthorized
    err.status = err.status || 401;
    next(err);
  }
});

// Меню: извличане на всички артикули за ресторант
router.get('/:restaurantName/menu', restaurantRegistered, async (req, res, next) => {
  try {
    const items = await getMenu(req.params.restaurantName);
    res.status(200).json({ items });
  } catch (err) {
    err.status = err.status || 500;
    next(err);
  }
});

// Меню: добавяне на нов артикул
router.post('/:restaurantName/menu', restaurantRegistered, async (req, res, next) => {
  try {
    const newItem = await addMenuItem(req.params.restaurantName, req.body);
    res.status(201).json({ message: 'Артикулът беше добавен успешно.', item: newItem });
  } catch (err) {
    err.status = err.status || 400;
    next(err);
  }
});

// Меню: обновяване на артикул по ID
router.put('/:restaurantName/menu/:itemId', restaurantRegistered, async (req, res, next) => {
  try {
    const updatedItem = await updateMenuItem(
      req.params.restaurantName,
      req.params.itemId,
      req.body,
    );
    if (!updatedItem) {
      const error = new Error('Артикулът не е намерен.');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: 'Артикулът беше обновен.', item: updatedItem });
  } catch (err) {
    err.status = err.status || 400;
    next(err);
  }
});

// Меню: изтриване на артикул по ID
router.delete('/:restaurantName/menu/:itemId', restaurantRegistered, async (req, res, next) => {
  try {
    const deletedItem = await deleteMenuItem(
      req.params.restaurantName,
      req.params.itemId,
    );
    if (!deletedItem) {
      const error = new Error('Артикулът не е намерен.');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ message: 'Артикулът беше изтрит.', item: deletedItem });
  } catch (err) {
    err.status = err.status || 400;
    next(err);
  }
});

// Изход (logout) – премахване на authToken cookie
// Този маршрут трябва да се извика за да изчисти сесията на ресторанта
router.get('/:restaurantName/logout', restaurantRegistered, (req, res) => {
  // Изчистваме authToken cookie. Задаваме същите опции като при създаване на бисквитката,
  // за да може да бъде изтрита коректно.
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
  res.status(200).json({ message: 'Успешен изход' });
});

export default router;