// pages/team/index.js
import Header from '@/components/Header';
import ContactCard from '@/components/ContactCard';
import Link from 'next/link';

import { officers } from '@/data/officers';

export default function Team() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {officers.map(officer => (
          <Link key={officer.shoulderNumber} href={`/team/${officer.shoulderNumber}`} className="hover:opacity-90 transition">
            <ContactCard {...officer} />
          </Link>
        ))}
      </main>
    </div>
  );
}
