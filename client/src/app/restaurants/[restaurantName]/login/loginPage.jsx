'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// API base URL – използва се от .env или дефолтно http://localhost:5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Страница за вход на конкретен ресторант. При зареждане проверява
 * дали ресторантът съществува, като извиква /restaurants/{restaurantName}/check.
 * Ако маршрутът върне 404, потребителят се пренасочва към 404 страница.
 */
export default function LoginPage() {
  const { restaurantName } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);

  // Проверява съществуването на ресторанта при първоначално зареждане.
  // В зависимост само от restaurantName – не добавяме router към зависимостите,
  // за да избегнем излишни повторения.
  useEffect(() => {
    const checkRestaurant = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants/${restaurantName}/check`);
        if (res.status === 404) {
          router.replace('/404');
        }
      } catch (err) {
        router.replace('/404');
      }
    };
    checkRestaurant();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantName]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/restaurants/${restaurantName}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // за HttpOnly cookie
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Възникна грешка.');

      // ✅ успешен вход → пренасочване към страницата на ресторанта
      router.push(`/${restaurantName}`);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Вход за {restaurantName}</h1>
      <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded bg-white shadow">
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
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Вход
        </button>
        {message && (
          <p className={`mt-2 ${message.startsWith('✅') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}