import { getRestaurantByName } from '../services/restaurantService.js';

/**
 * Middleware, което проверява дали съответният ресторант съществува в базата.
 * Прилага се към всички динамични маршрути, които имат `:restaurantName` параметър.
 * Ако ресторантът не е регистриран, връща HTTP 404.
 *
 * Използване:
 * ```js
 * import restaurantRegistered from '../middlewares/restaurantRegistered.js';
 * router.post('/:restaurantName/login', restaurantRegistered, async (req, res) => {
 *   // Вашата логика
 * });
 * ```
 */
export default async function restaurantRegistered(req, res, next) {
  const { restaurantName } = req.params;
  try {
    // Извикваме услуга или модел, който връща ресторанта по име
    // Предполага се, че `getRestaurantByName` връща null, ако ресторантът го няма
    const restaurant = await getRestaurantByName(restaurantName);
    if (!restaurant) {
      return res.status(404).json({ message: 'Такъв ресторант не съществува.' });
    }
    // Ако съществува, продължаваме към следващия middleware/контролер
    next();
  } catch (err) {
    // При възникване на грешка предаваме управление на централизираната обработка на грешки
    next(err);
  }
}