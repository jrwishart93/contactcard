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
    <header className="sticky top-0 bg-white dark:bg-black text-black dark:text-white border-b flex items-center justify-between px-4 py-2 z-10">
      <h1 className="font-bold">Roads Policing</h1>
      <nav className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/team">Team Directory</Link>
        <Link href="/rtc/new">Report RTC</Link>
      </nav>
      <button aria-label="Toggle Dark Mode" onClick={toggle} className="ml-4">
        {dark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
