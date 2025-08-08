import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

const restaurantSchema = new mongoose.Schema({
  restaurantName: {
    type: String,
    required: [true, 'Името на ресторанта е задължително!'],
    trim: true,
    unique: true,
    minLength: [2, 'Минимум 2 символа'],
  },
  ownerName: {
    type: String,
    required: [true, 'Името на собственика е задължително!'],
    trim: true,
    minLength: [2, 'Минимум 2 символа'],
  },
  email: {
    type: String,
    required: [true, 'Email е задължителен!'],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Невалиден email адрес!',
    },
  },
  password: {
    type: String,
    required: [true, 'Паролата е задължителна!'],
    minLength: [6, 'Минимум 6 символа'],
  }
}, { timestamps: true });

restaurantSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema, 'restaurants');
export default Restaurant;
