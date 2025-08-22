import MenuItem from '../models/MenuItem.js';

/**
 * Връща всички артикули от менюто за даден ресторант.
 * @param {string} restaurantName
 * @returns {Promise<Array>}
 */
export async function getMenu(restaurantName) {
  const normalized = restaurantName.toLowerCase().trim();
  return await MenuItem.find({ restaurantName: normalized });
}

/**
 * Добавя нов артикул към менюто на ресторанта.
 * @param {string} restaurantName
 * @param {Object} itemData
 */
export async function addMenuItem(restaurantName, itemData) {
  const normalized = restaurantName.toLowerCase().trim();
  const item = new MenuItem({
    ...itemData,
    restaurantName: normalized,
  });
  await item.save();
  return item;
}

/**
 * Обновява артикул от менюто по ID.
 * @param {string} restaurantName
 * @param {string} itemId
 * @param {Object} updatedData
 */
export async function updateMenuItem(restaurantName, itemId, updatedData) {
  const normalized = restaurantName.toLowerCase().trim();
  return await MenuItem.findOneAndUpdate(
    { _id: itemId, restaurantName: normalized },
    { $set: updatedData },
    { new: true },
  );
}

/**
 * Изтрива артикул от менюто по ID.
 * @param {string} restaurantName
 * @param {string} itemId
 */
export async function deleteMenuItem(restaurantName, itemId) {
  const normalized = restaurantName.toLowerCase().trim();
  return await MenuItem.findOneAndDelete({ _id: itemId, restaurantName: normalized });
}