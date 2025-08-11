'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function LoginPage() {
  const { restaurantName } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);

  // ✱ Проверка за съществуване на ресторант
  useEffect(() => {
    const checkRestaurant = async () => {
      try {
        const res = await fetch(`${API_URL}/restaurants/${restaurantName}/check`);
        if (res.status === 404) {
          router.replace('/404');
        }
      } catch (err) {
        // при мрежова грешка също показваме 404
        router.replace('/404');
      }
    };
    checkRestaurant();
  }, [restaurantName, router]);

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
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Възникна грешка.');

      router.push('/');
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
