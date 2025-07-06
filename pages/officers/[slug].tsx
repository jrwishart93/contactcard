// pages/officers/[slug].tsx
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import OfficerProfile from '@/components/OfficerProfile';
import { officers } from '@/data/officers';
import { useEffect, useState } from 'react';

export default function OfficerPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [officer, setOfficer] = useState(null);

  useEffect(() => {
    if (slug) {
      const found = officers.find((o) => o.slug === slug);
      setOfficer(found);
    }
  }, [slug]);

  if (!officer) return null;

  const mappedOfficer = {
    name: officer.name,
    badgeNumber: officer.badge,
    collarNumber: officer.shoulderNumber,
    unit: officer.unit,
    email: officer.email,
    phone: officer.phone,
    profileImage: officer.image,
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 flex justify-center">
        <div className="max-w-md w-full">
          <OfficerProfile {...mappedOfficer} />
        </div>
      </main>
    </div>
  );
}
