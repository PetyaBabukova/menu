import express from 'express';
import restaurantController from './controllers/restaurantController.js';

const router = express.Router();

router.use('/restaurants', restaurantController); // всички /users/* маршрути

router.get('/ping', (req, res) => {
  res.json({ message: '🍽️ Меню сървърът работи' });
});

export default router;
