// utils/vcard.js
export function generateVCard({ name, email, phone }) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `EMAIL:${email}`,
    phone ? `TEL:${phone}` : '',
    'END:VCARD',
  ];
  return lines.filter(Boolean).join('\n');
}
