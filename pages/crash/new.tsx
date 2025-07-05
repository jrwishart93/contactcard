// pages/crash/new.js
import Header from '@/components/Header';
import CrashForm from '@/components/CrashForm';

export default function NewCrash() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 md:p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl mb-4">Report Road Traffic Collision</h1>
        <CrashForm />
      </main>
    </div>
  );
}
