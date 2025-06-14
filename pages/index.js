// pages/index.js
import Header from '@/components/Header';
import ContactCard from '@/components/ContactCard';
import Link from 'next/link';
import { generateVCard } from '@/utils/vcard';

export default function Home() {
  const officer = {
    name: 'Officer James Wishart',
    badge: 'PC 123',
    unit: 'Roads Policing Unit',
    email: 'james.wishart@scotland.police.uk',
    phone: '101'
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="flex flex-col items-center justify-center py-20 px-4 space-y-8">
        <ContactCard {...officer} />
        <a
          href={`data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(officer))}`}
          download="officer.vcf"
          className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Download vCard
        </a>
        <div className="flex space-x-4">
          <Link href="/team" className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Team Directory</Link>
          <Link href="/rtc/new" className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition">Report RTC</Link>
        </div>
      </main>
    </div>
  );
}
