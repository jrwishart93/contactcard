import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link href="/" className="px-6 py-3 bg-[#003b77] text-white rounded hover:opacity-90 transition">
          Go Home
        </Link>
      </main>
      <Footer />
    </div>
  )
}
