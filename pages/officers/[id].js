import { useRouter } from 'next/router';
import OfficerProfile from '@/components/OfficerProfile';
import { officerProfiles } from '@/data/officerProfiles';

export default function OfficerPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || Array.isArray(id)) return null;

  const officer = officerProfiles.find((o) => o.id === id);
  if (!officer) return <p className="p-4">Officer not found</p>;
  return <OfficerProfile {...officer} />;
}
