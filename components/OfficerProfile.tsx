import Image from 'next/image';
import Link from 'next/link';
import { PhoneIcon, EnvelopeIcon, MapPinIcon, IdentificationIcon } from '@heroicons/react/24/outline';
import type { FC } from 'react';
import { generateVCard } from '@/utils/vcard';

export interface OfficerProfileProps {
  name: string;
  badgeNumber: string;
  collarNumber: string;
  unit: string;
  email: string;
  phone?: string;
  profileImage: string;
}

const OfficerProfile: FC<OfficerProfileProps> = ({
  name,
  badgeNumber,
  collarNumber,
  unit,
  email,
  phone,
  profileImage,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Header with hero image */}
      <div className="relative w-full h-56 sm:h-72 md:h-80">
        <Image
          src="/images/queensferrycrossing-background.jpg"
          alt="Banner image"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute top-4 right-4 w-24 sm:w-32">
          <Link href="/">
            <Image
              src="/images/police-scotland-logo-2.png"
              alt="Police Scotland logo"
              width={128}
              height={128}
            />
          </Link>
        </div>
        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg overflow-hidden">
          <Image
            src={profileImage || '/images/trafficofficercontact.png'}
            alt={`Portrait of ${name}`}
            fill
            sizes="160px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 mt-20 px-4 text-center">
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="mt-1 font-medium">Badge: {badgeNumber}</p>
        <p className="mt-1">Collar Number: {collarNumber}</p>
        <p className="mt-1 italic">{unit}</p>

        <div className="mt-4 flex justify-center space-x-6">
          {phone && (
            <a href={`tel:${phone}`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
              <PhoneIcon className="w-6 h-6" />
            </a>
          )}
          <a href={`mailto:${email}`} className="text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <EnvelopeIcon className="w-6 h-6" />
          </a>
          <a
            href="https://maps.app.goo.gl/QjDwBoPHeP6so7Ko8?g_st=ipc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            <MapPinIcon className="w-6 h-6" />
          </a>
          <a
            href={`data:text/vcard;charset=utf-8,${encodeURIComponent(generateVCard({ name, email, phone, unit }))}`}
            download={`${name.replace(/\s+/g, '_')}.vcf`}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600"
          >
            <IdentificationIcon className="w-6 h-6" />
          </a>
        </div>

        <div className="mt-6">
          <a
            href={`mailto:${email}`}
            className="inline-block px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Contact Officer
          </a>
        </div>
      </main>
    </div>
  );
};

export default OfficerProfile;

