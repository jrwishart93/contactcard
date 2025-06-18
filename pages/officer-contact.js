import Image from "next/image";
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";

export default function OfficerContact() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      {/* Header with background and profile image */}
      <header className="relative pb-20">
        {/* Background banner */}
        <div className="w-full h-48 sm:h-60 md:h-72 lg:h-80 relative">
          <Image
            src="/public/images/queensferrycrossing background.JPG"
            alt="Queensferry Crossing"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "center 75%" }}
          />
        </div>

        {/* Police Scotland logo */}
        <Image
          src="/public/images/police-scotland-logo-2.png"
          alt="Police Scotland Logo"
          width={80}
          height={80}
          className="absolute top-4 right-4"
        />

        {/* Profile picture overlapping banner */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10 w-40 h-40">
          <Image
            src="/public/images/trafficofficercontact.png"
            alt="PC John Smith"
            fill
            className="rounded-full border-4 border-white shadow-md object-cover"
          />
        </div>
      </header>

      {/* Main content with officer details and contact actions */}
      <main className="flex-grow flex flex-col items-center text-center px-4 mt-24">
        {/* Officer details */}
        <div className="mt-4 space-y-1">
          <h1 className="font-bold text-xl">PC JOHN SMITH</h1>
          <p className="font-bold">T123 | 1232342</p>
          <p className="font-bold">ROAD POLICING UNIT</p>
        </div>

        {/* Contact icons */}
        <div className="mt-6 flex space-x-8">
          <a href="tel:101" className="hover:opacity-75" aria-label="Phone">
            <PhoneIcon className="h-6 w-6" />
          </a>
          <a
            href="mailto:folk_dragnet.2a@icloud.com"
            className="hover:opacity-75"
            aria-label="Email"
          >
            <EnvelopeIcon className="h-6 w-6" />
          </a>
          <a href="#" className="hover:opacity-75" aria-label="Location">
            <MapPinIcon className="h-6 w-6" />
          </a>
          <a href="#" className="hover:opacity-75" aria-label="Badge">
            <IdentificationIcon className="h-6 w-6" />
          </a>
        </div>

        {/* Contact button */}
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
