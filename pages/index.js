// pages/index.js
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactCard from '@/components/ContactCard';
import Link from 'next/link';
import { officers } from '@/data/officers';

export default function Home() {
  const preview = officers.slice(0, 4);
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow">
        {/* Hero */}
        <section className="text-center py-20 px-4 bg-white">
          <h1 className="text-4xl md:text-5xl font-bold">Crash-Report in Seconds</h1>
          <p className="mt-4 text-lg text-gray-800 max-w-xl mx-auto">
            Scan the QR on your officer&rsquo;s card, fill in your details, and have a full report emailed—no paperwork needed.
          </p>
          <div className="mt-8 flex flex-col items-center space-y-3">
            <Link href="/rtc/new" className="px-6 py-3 rounded bg-primary text-white shadow hover:bg-primary/90">
              Start Your Report →
            </Link>
            <a href="#how-it-works" className="text-primary underline hover:no-underline">
              How It Works
            </a>
          </div>
          <div className="mt-12 flex justify-center">
            <div className="bg-gray-100 rounded-lg shadow-inner h-80 w-full max-w-md flex items-center justify-center text-gray-500">
              Form Image
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-gray-50 py-16 px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">How It Works</h2>
          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
            <div className="bg-white border border-gray-200 p-6 rounded text-center">
              <svg className="mx-auto mb-4 text-primary" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4z" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" fill="currentColor"/>
              </svg>
              <h3 className="font-semibold mb-2">Scan the QR or Visit URL</h3>
              <p>Use your phone&rsquo;s camera to scan the QR printed on the officer&rsquo;s card—or go to crash-report.scot.</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded text-center">
              <svg className="mx-auto mb-4 text-primary" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 5h16M4 12h16M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 className="font-semibold mb-2">Fill in Your Info</h3>
              <p>Enter your name, vehicle registration, make/model, insurance details and more.</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded text-center">
              <svg className="mx-auto mb-4 text-primary" width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 8l10 6 10-6" fill="none" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 8v8l10 6 10-6V8" fill="none" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <h3 className="font-semibold mb-2">Get Your Email</h3>
              <p>We&rsquo;ll bundle everyone&rsquo;s inputs plus the police reference into one secure email for you.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-4 bg-white">
          <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="md:flex md:items-center md:space-x-8">
              <div className="md:w-1/2 h-40 bg-gray-100 rounded mb-4 md:mb-0 flex items-center justify-center text-gray-500">
                Image
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">No Paperwork</h3>
                <p>All crash details are captured digitally and emailed immediately—no pen or paper required.</p>
              </div>
            </div>
            <div className="md:flex md:items-center md:flex-row-reverse md:space-x-reverse md:space-x-8">
              <div className="md:w-1/2 h-40 bg-gray-100 rounded mb-4 md:mb-0 flex items-center justify-center text-gray-500">
                Image
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Secure &amp; GDPR-Compliant</h3>
                <p>Data encrypted in transit and at rest, stored on EU servers, auto-deleted after 30 days.</p>
              </div>
            </div>
            <div className="md:flex md:items-center md:space-x-8">
              <div className="md:w-1/2 h-40 bg-gray-100 rounded mb-4 md:mb-0 flex items-center justify-center text-gray-500">
                Image
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-semibold mb-2">Team Contacts at Your Fingertips</h3>
                <p>Quickly view and download vCards for every officer on your incident team.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Contacts Preview */}
        <section id="team" className="bg-gray-50 py-16 px-4">
          <h2 className="text-3xl font-semibold text-center mb-8">Team Contacts</h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {preview.map((o) => (
              <ContactCard key={o.shoulderNumber} {...o} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/team" className="inline-block border border-primary text-primary px-6 py-2 rounded hover:bg-primary hover:text-white transition">
              View All Team Members →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
