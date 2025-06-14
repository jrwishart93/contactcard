// pages/team/[shoulderNumber].js
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import ContactCard from '@/components/ContactCard';
import { officers } from '@/data/officers';
import { generateVCard } from '@/utils/vcard';
import { useEffect, useState } from 'react';

export default function OfficerPage() {
  const router = useRouter();
  const { shoulderNumber } = router.query;
  const [officer, setOfficer] = useState(null);

  useEffect(() => {
    if (shoulderNumber) {
      const found = officers.find(o => o.shoulderNumber === shoulderNumber);
      setOfficer(found);
    }
  }, [shoulderNumber]);

  if (!officer) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 flex justify-center">
        <div className="max-w-md w-full">
          <ContactCard {...officer} />
          <a
            href={`data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard(officer))}`}
            download="officer.vcf"
            className="block mt-4 px-4 py-2 rounded-full bg-blue-600 text-white text-center hover:bg-blue-700 transition"
          >
            Download vCard
          </a>
        </div>
      </main>
    </div>
  );
}
