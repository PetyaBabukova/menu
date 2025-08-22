import express from 'express';
import restaurantController from './controllers/restaurantController.js';

const router = express.Router();

// всички /restaurants/* маршрути се обработват от restaurantController
router.use('/restaurants', restaurantController);

// health check или тестов маршрут
router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong!' });
});

export default router;