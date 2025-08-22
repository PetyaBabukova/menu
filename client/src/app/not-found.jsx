/*
 * Персонализирана 404 страница за Menu проекта.
 * Този компонент се използва автоматично от Next.js,
 * когато дадена страница не е намерена. Показва
 * кратко съобщение и връзка към началната страница.
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ textAlign: 'center', padding: '3em 1em' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '0.5em' }}>404</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '1em' }}>
        Тази страница не беше намерена.
      </p>
      <Link href="/" className="nav-link">
        Върни се към началната страница
      </Link>
    </main>
  );
}