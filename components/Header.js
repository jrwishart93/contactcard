// components/Header.js
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-black text-white px-6 py-3">
      <Link href="/" className="flex items-center space-x-2" onClick={() => setMenuOpen(false)}>
        <img src="/images/police-scotland-logo-2.png" alt="Police Scotland" className="h-10 w-auto" />
        <span className="sr-only">Police Scotland</span>
      </Link>
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>
      <nav
        className={`${menuOpen ? 'block' : 'hidden'} absolute top-full right-0 bg-black text-white w-48 p-4 space-y-2 md:static md:block md:w-auto md:p-0 md:space-y-0 md:flex md:space-x-4`}
      >
        <Link href="/" className="block hover:underline" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/rtc/new" className="block hover:underline" onClick={() => setMenuOpen(false)}>
          Start Report
        </Link>
        <Link href="/statements/new" className="block hover:underline" onClick={() => setMenuOpen(false)}>
          Statement
        </Link>
        <Link href="/officers" className="block hover:underline" onClick={() => setMenuOpen(false)}>
          Officers
        </Link>
        <Link href="/team" className="block hover:underline" onClick={() => setMenuOpen(false)}>
          Team
        </Link>
        <Link href="/privacy" className="block hover:underline" onClick={() => setMenuOpen(false)}>
          Privacy
        </Link>
      </nav>
    </header>
  );
}
