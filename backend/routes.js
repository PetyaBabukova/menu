import express from 'express';
import userController from './controllers/restaurantController.js';

const router = express.Router();

router.use('/users', userController); // всички /users/* маршрути

router.get('/ping', (req, res) => {
  res.json({ message: '🍽️ Меню сървърът работи' });
});

export default router;
