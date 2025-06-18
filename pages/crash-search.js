import Header from '@/components/Header';
import CrashSearchForm from '@/components/CrashSearchForm';

export default function CrashSearchPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 md:p-8 max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl mb-4">Find Crash Report</h1>
        <CrashSearchForm />
      </main>
    </div>
  );
}
