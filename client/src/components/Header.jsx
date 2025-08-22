'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

/*
 * Header компонент за Menu проекта.
 * Навигационното меню включва основните секции на сайта
 * и набор от администраторски връзки, които ще се показват
 * само ако потребителят е логнат. Засега проверката е
 * заменена с фиктивна променлива.
 */
export default function Header() {
  /**
   * TODO: Replace this placeholder with a real authentication check.
   * В бъдеще можем да използваме контекст или hook за да определим
   * дали потребителят е логнат (например useAuth или useSession).
   */
  const isLoggedIn = false;

  // Използваме usePathname, за да определим коя навигационна връзка е активна.
  const pathname = usePathname();

  // Hook за навигация при търсене
  const router = useRouter();

  // Състояние на полето за търсене
  const [searchQuery, setSearchQuery] = useState('');

  // Основни навигационни секции
  const mainLinks = [
    { href: '/', label: 'Начало' },
    { href: '/foods', label: 'Храни' },
    { href: '/drinks', label: 'Напитки' },
    { href: '/allergens', label: 'Алергени' },
    { href: '/contacts', label: 'Контакти' },
  ];

  // Администраторски секции
  const adminLinks = [
    { href: '/admin/categories/create', label: 'Създаване на Категория' },
    { href: '/admin/recipes/create', label: 'Създаване на Рецепта' },
    { href: '/admin/recipes/edit', label: 'Редактиране на Рецепти' },
    { href: '/admin/gallery/add-photo', label: 'Добавяне на снимка към галерия' },
    { href: '/admin/gallery/edit', label: 'Редактиране на галерия' },
    { href: '/admin/banner/add', label: 'Добавяне на заглавен банер' },
    { href: '/admin/banner/edit', label: 'Редактиране на заглавен банер' },
  ];

  return (
    <header>
      {/* Вътрешен контейнер, който ограничава ширината и центрира навигацията */}
      <div className="header-inner">
      <nav className="nav-container">
        {/* Контейнер за навигационните връзки */}
        <div className="nav-items">
          {/* Основни навигационни връзки */}
          {mainLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
          {/* Администраторски секции – показват се само при логнат потребител */}
          {isLoggedIn && adminLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link nav-admin${pathname === href ? ' active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* Форма за търсене. При submit ще навигираме до страницата за търсене. */}
        <form
          className="search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const query = searchQuery.trim();
            if (query) {
              router.push(`/search?q=${encodeURIComponent(query)}`);
              setSearchQuery('');
            }
          }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Търсене..."
            className="search-input"
            aria-label="Търсене"
          />
          <button type="submit" className="search-btn" aria-label="Търси">
            {/* Използваме Font Awesome 6 класове за икона на търсене. В някои версии иконата се казва "magnifying-glass" */}
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          </button>
        </form>
      </nav>
      </div>
    </header>
  );
}