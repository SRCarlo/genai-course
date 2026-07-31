export default function Card({ title, value }) {
  return (
    <div
      className="
bg-white
rounded-xl
shadow
p-6
"
    >
      <p
        className="
text-gray-500
"
      >
        {title}
      </p>

      <h2
        className="
text-3xl
font-bold
mt-3
"
      >
        {value}
      </h2>
    </div>
  );
}
