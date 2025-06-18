import Image from 'next/image';
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function OfficerContact() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <header className="relative">
        <div className="w-full h-48 sm:h-60 relative">
          <Image
            src="/images/queensferrycrossing-background.jpg"
            alt="Queensferry Crossing"
            fill
            priority
            className="object-cover"
          />
        </div>
        <Image
          src="/images/police-scotland-logo-2.png"
          alt="Police Scotland"
          width={80}
          height={80}
          className="absolute top-4 right-4 w-20 h-auto"
        />
      </header>

      <main className="flex-grow flex flex-col items-center text-center px-4">
        <div className="-mt-16">
          <Image
            src="/images/trafficofficercontact.png"
            alt="PC John Smith"
            width={160}
            height={160}
            className="rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>

        <div className="mt-4 space-y-1">
          <h1 className="font-bold text-xl">PC JOHN SMITH</h1>
          <p className="font-bold">T123 | 1232342</p>
          <p className="font-bold">ROAD POLICING UNIT</p>
        </div>

        <div className="mt-6 flex space-x-8">
          <a href="tel:101" className="hover:opacity-75" aria-label="Phone">
            <PhoneIcon className="h-6 w-6" />
          </a>
          <a href="mailto:folk_dragnet.2a@icloud.com" className="hover:opacity-75" aria-label="Email">
            <EnvelopeIcon className="h-6 w-6" />
          </a>
          <a href="#" className="hover:opacity-75" aria-label="Location">
            <MapPinIcon className="h-6 w-6" />
          </a>
        </div>

        <a
          href="mailto:folk_dragnet.2a@icloud.com"
          className="mt-8 mb-12 px-6 py-3 border-2 border-black rounded-full font-semibold hover:bg-black hover:text-white transition"
        >
          CONTACT OFFICER
        </a>
      </main>
    </div>
  );
}
