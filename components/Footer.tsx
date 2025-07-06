// components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 text-center py-6">
      <nav className="space-x-2">
        <Link href="/" className="hover:underline">Home</Link>
        <span>•</span>
        <a href="#how-it-works" className="hover:underline">How It Works</a>
        <span>•</span>
        <a href="#officers" className="hover:underline">Officer Contacts</a>
        <span>•</span>
        <Link href="/privacy" className="hover:underline">Privacy &amp; GDPR</Link>
      </nav>
      <p className="text-xs text-gray-500 mt-2">© 2025 Police Scotland. All rights reserved.</p>
    </footer>
  );
}
