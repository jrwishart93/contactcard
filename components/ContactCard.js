// components/ContactCard.js
export default function ContactCard({ name, badge, unit, email, phone, image }) {
  return (
    <div className="border rounded-lg p-4 text-center shadow hover:shadow-md transition">
      <img
        src={image || '/badge.png'}
        alt={`Portrait of ${name}`}
        className="mx-auto mb-2 w-16 h-16 object-cover rounded-full"
      />
      <h2 className="text-xl font-semibold">{name}</h2>
      <p>{badge}</p>
      {unit && <p>{unit}</p>}
      <p className="mt-2">
        <a href={`mailto:${email}`} className="text-blue-600 underline">{email}</a>
      </p>
      {phone && <p>{phone}</p>}
    </div>
  );
}
