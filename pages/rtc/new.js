// pages/rtc/new.js
import Header from '@/components/Header';
import RTCForm from '@/components/RTCForm';

export default function NewRTC() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl mb-4">Report Road Traffic Collision</h1>
        <RTCForm />
      </main>
    </div>
  );
}
