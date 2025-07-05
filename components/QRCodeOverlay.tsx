// components/QRCodeOverlay.js
import { useState } from 'react';
import dynamic from 'next/dynamic';

const QRCode: any = dynamic(() => import('qrcode.react').then(m => m.default as any), { ssr: false });

export default function QRCodeOverlay({ url }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button onClick={() => setOpen(true)} className="px-2 py-1 bg-gray-200 rounded">QR</button>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div className="bg-white p-4" onClick={e => e.stopPropagation()}>
            <QRCode value={typeof window !== 'undefined' ? location.origin + url : url} size={200} />
          </div>
        </div>
      )}
    </div>
  );
}
