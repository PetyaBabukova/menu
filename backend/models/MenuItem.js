import mongoose from 'mongoose';

// Схема за единичен артикул от менюто. Свързва се с ресторант чрез restaurantName.
const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
    },
    image: {
      type: String,
    },
    restaurantName: {
      type: String,
      required: true,
      index: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('MenuItem', menuItemSchema);