// components/Header.js
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('dark');
    if (stored === 'true') {
      document.documentElement.classList.add('dark');
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('dark', next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-black text-white px-6 py-3">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="Police Scotland" className="h-10 w-auto" />
        <span className="sr-only">Police Scotland</span>
      </div>
      <nav>
        <Link href="/" className="hover:underline hover:text-primary">
          Police Scotland
        </Link>
      </nav>
      <button aria-label="Toggle Dark Mode" onClick={toggle} className="ml-4">
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
