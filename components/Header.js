// components/Header.js
import Link from 'next/link';
import { useEffect } from 'react';

export default function Header() {
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-black text-white px-6 py-3">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/images/police-scotland-logo-2.png" alt="Police Scotland" className="h-10 w-auto" />
        <span className="sr-only">Police Scotland</span>
      </Link>
      <nav>
        <Link href="/" className="hover:underline hover:text-primary">
          Police Scotland
        </Link>
      </nav>
    </header>
  );
}
