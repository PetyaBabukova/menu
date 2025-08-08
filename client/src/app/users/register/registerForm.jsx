'use client';
import { useState } from 'react';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return setMessage('❌ Паролите не съвпадат.');
    }

    // Client-side check for Latin restaurant name
    const latinPattern = /^[a-zA-Z0-9-]+$/;
    if (!latinPattern.test(formData.restaurantName)) {
      return setMessage('❌ Името на ресторанта трябва да съдържа само латински букви, цифри или тирета, без интервали.');
    }

    try {
      const res = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Възникна грешка.');

      setMessage('✅ Ресторантът е регистриран успешно.');
      setFormData({
        restaurantName: '',
        ownerName: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow">
      <input
        name="restaurantName"
        placeholder="URL име на ресторанта (на латиница)"
        value={formData.restaurantName}
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />
      <p className="text-sm text-gray-500">
        Това ще се използва в URL: <code>/restaurant-name/login</code><br />
        Използвай само латински букви, цифри и тирета (пример: <strong>mamma-mia</strong>)
      </p>

      <input
        name="ownerName"
        placeholder="Име на собственика"
        value={formData.ownerName}
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />

      <input
        type="password"
        name="password"
        placeholder="Парола"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />

      <input
        type="password"
        name="confirmPassword"
        placeholder="Потвърди парола"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        className="w-full p-2 border"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Регистрирай ресторант
      </button>

      {message && <p className={`mt-2 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
        {message}
      </p>}
    </form>
  );
}
