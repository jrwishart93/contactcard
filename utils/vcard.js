// utils/vcard.js
export function generateVCard({ name, email, phone, unit }) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${name}`,
    `ORG:Police Scotland${unit ? `, ${unit}` : ''}`,
    `EMAIL:${email}`,
    phone ? `TEL;TYPE=WORK,VOICE:${phone}` : '',
    'END:VCARD',
  ];
  return lines.filter(Boolean).join('\n');
}
