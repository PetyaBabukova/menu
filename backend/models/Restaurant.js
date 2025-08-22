import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Модел за ресторант.
 * Съдържа уникално име (restaurantName), име на собственик, email и парола.
 * restaurantName и email се нормализират до lower case за лесно търсене.
 */
const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook за хеширане на паролата
restaurantSchema.pre('save', async function (next) {
  const restaurant = this;
  if (!restaurant.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    restaurant.password = await bcrypt.hash(restaurant.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

export default mongoose.model('Restaurant', restaurantSchema);