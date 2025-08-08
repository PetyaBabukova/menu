import Restaurant from '../models/Restaurant.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function loginRestaurant(email, password) {
  const restaurant = await Restaurant.findOne({ email });
  if (!restaurant) {
    console.log('❌ Няма такъв ресторант!');
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, restaurant.password);
  console.log('✅ bcrypt.compare резултат:', isValid);

  if (!isValid) {
    console.log('❌ Паролата е невалидна!');
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    {
      _id: restaurant._id,
      restaurantName: restaurant.restaurantName,
      email: restaurant.email
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      _id: restaurant._id,
      restaurantName: restaurant.restaurantName,
      email: restaurant.email,
    }
  };
}

export async function registerRestaurant({ restaurantName, ownerName, email, password }) {
  const existing = await Restaurant.findOne({ email });
  if (existing) {
    throw new Error('Ресторант с този email вече съществува!');
  }

  const isStrong = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  });

  if (!isStrong) {
    throw new Error(
      'Паролата трябва да е поне 8 символа, да съдържа малки и главни латински букви, поне 1 цифра и поне един символ!'
    );
  }

  const restaurant = new Restaurant({
    restaurantName,
    ownerName,
    email,
    password
  });

  await restaurant.save();

  return {
    _id: restaurant._id,
    restaurantName: restaurant.restaurantName,
    email: restaurant.email
  };
}
