'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// API base URL – използва се от .env или дефолтно http://localhost:5000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Страница за изход на ресторант. При зареждане прави заявка към бекенда,
 * за да изтрие authToken cookie, след което пренасочва потребителя към
 * страницата за вход на същия ресторант.
 */
export default function LogoutPage() {
  const { restaurantName } = useParams();
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${API_URL}/restaurants/${restaurantName}/logout`, {
          method: 'GET',
          credentials: 'include',
        });
      } catch (err) {
        // Игнорираме грешките – дори и да има проблем, ще се пренасочим към входа
      } finally {
        router.replace(`/restaurants/${restaurantName}/login`);
      }
    };
    logout();
  }, [restaurantName, router]);

  return (
    <div className="p-6 max-w-md mx-auto">
      <p>Излизане...</p>
    </div>
  );
}