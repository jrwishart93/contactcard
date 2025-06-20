import Link from 'next/link';
import Header from '@/components/Header';
import { officerProfiles } from '@/data/officerProfiles';

export default function OfficersIndex() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {officerProfiles.map((officer) => (
          <Link key={officer.id} href={`/officers/${officer.id}`} className="border rounded-lg p-4 hover:shadow">
            <p className="font-semibold">{officer.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{officer.unit}</p>
          </Link>
        ))}
      </main>
    </div>
  );
}
