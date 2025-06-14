// pages/privacy.js
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Header />
      <main className="flex-grow p-4 max-w-3xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Privacy &amp; GDPR</h1>
        <p>This is a placeholder privacy notice.</p>
      </main>
      <Footer />
    </div>
  );
}
