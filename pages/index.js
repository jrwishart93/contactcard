// pages/index.js
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { QrCodeIcon, ListBulletIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactCard from '@/components/ContactCard'
import ReportLookupForm from '@/components/ReportLookupForm'
import { officers } from '@/data/officers'

export default function Home() {
  const previewOfficers = officers.slice(0, 4)

  return (
    <>
      <Head>
        <title>Crash-Report in Seconds | Police Scotland</title>
        <meta
          name="description"
          content="Scan the QR code on your officer’s card, fill in your details, and receive a crash-report summary emailed instantly—no paperwork."
        />
      </Head>

      <div className="min-h-screen flex flex-col bg-white text-black">
        <Header />

        <main className="flex-grow">

          {/* HERO */}
          <section className="text-center py-20 px-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Crash-Report in Seconds
            </h1>
            <p className="mt-4 text-lg text-gray-800 max-w-2xl mx-auto">
              Scan the QR code on your officer’s card, enter your vehicle and
              insurance details, and get a complete report emailed—no paperwork.
            </p>

            <div className="mt-8 flex flex-col items-center space-y-3">
              {/* Start Report */}
              <Link
                href="/rtc/new"
                className="px-6 py-3 bg-[#003b77] text-white rounded shadow hover:opacity-90 transition"
              >
                Start Report →
              </Link>
              <a
                href="#how-it-works"
                className="text-[#003b77] underline hover:no-underline"
              >
                How it works
              </a>
            </div>

            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <Image
                  src="/images/iPhone.png"
                  alt="Crash-Report app on iPhone"
                  width={400}
                  height={800}
                  className="mx-auto"
                />
              </div>
            </div>
          </section>

          {/* FIND REPORT */}
          <section className="bg-gray-50 py-12 px-4">
            <div className="max-w-md mx-auto text-center">
              <h2 className="text-2xl font-semibold mb-2">Find Your Crash Report</h2>
              <p className="text-gray-700 mb-4">
                Enter your details below to securely access your crash report. Reports are available for 30 days after submission.
              </p>
              <ReportLookupForm />
            </div>
          </section>

          {/* HOW IT WORKS */}
          <section id="how-it-works" className="bg-gray-50 py-16 px-4">
            <h2 className="text-3xl font-semibold text-center mb-8">
              How It Works
            </h2>

            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
              <div className="bg-white border border-gray-200 p-6 rounded text-center">
                <QrCodeIcon
                  className="mx-auto mb-4 h-12 w-12 text-[#003b77]"
                  aria-hidden="true"
                >
                  <title>Scan QR code</title>
                </QrCodeIcon>
                <h3 className="font-semibold mb-2">Scan QR / Visit URL</h3>
                <p className="text-gray-600">
                  Pull out your phone, scan the code on our card or go to{' '}
                  <strong>crash-report.scot</strong>.
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded text-center">
                <ListBulletIcon
                  className="mx-auto mb-4 h-12 w-12 text-[#003b77]"
                  aria-hidden="true"
                >
                  <title>Fill in your info</title>
                </ListBulletIcon>
                <h3 className="font-semibold mb-2">Fill in Your Info</h3>
                <p className="text-gray-600">
                  Enter your name, vehicle details, insurance info…
                </p>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded text-center">
                <EnvelopeIcon
                  className="mx-auto mb-4 h-12 w-12 text-[#003b77]"
                  aria-hidden="true"
                >
                  <title>Get your email</title>
                </EnvelopeIcon>
                <h3 className="font-semibold mb-2">Get Your Email</h3>
                <p className="text-gray-600">
                  We’ll bundle everyone’s inputs plus the officer’s reference
                  into one secure PDF.
                </p>
              </div>
            </div>
          </section>

          {/* KEY FEATURES */}
          <section className="py-16 px-4">
            <h2 className="text-3xl font-semibold text-center mb-12">
              Key Features
            </h2>
            <div className="max-w-5xl mx-auto space-y-16">
              <div className="md:flex md:items-center md:space-x-8">
                <div className="md:w-1/2 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  [ No Paperwork Visual ]
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <h3 className="text-xl font-semibold mb-2">No Paperwork</h3>
                  <p className="text-gray-600">
                    All crash details are captured digitally and emailed
                    instantly—no pens or forms required.
                  </p>
                </div>
              </div>

              <div className="md:flex md:items-center md:flex-row-reverse md:space-x-reverse md:space-x-8">
                <div className="md:w-1/2 h-48 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                  [ GDPR Security Visual ]
                </div>
                <div className="md:w-1/2 mt-6 md:mt-0">
                  <h3 className="text-xl font-semibold mb-2">
                    Secure & GDPR-Compliant
                  </h3>
                  <p className="text-gray-600">
                    Encrypted storage on EU-hosted servers, auto-delete after 30
                    days.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* TEAM CONTACTS */}
          <section id="team" className="bg-gray-50 py-16 px-4">
            <h2 className="text-3xl font-semibold text-center mb-8">
              Team Contacts
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {previewOfficers.map((officer) => (
                <ContactCard key={officer.shoulderNumber} {...officer} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/team"
                className="inline-block border border-[#003b77] text-[#003b77] px-6 py-2 rounded hover:bg-[#003b77] hover:text-white transition"
              >
                View All Officers →
              </Link>
            </div>
          </section>

          <div className="py-8 text-center">
            <Link
              href="/team"
              className="inline-block px-6 py-3 bg-[#003b77] text-white rounded shadow hover:opacity-90 transition"
            >
              Team Contacts
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
