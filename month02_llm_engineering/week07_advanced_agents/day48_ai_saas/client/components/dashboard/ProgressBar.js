export default function ProgressBar({ usage, limit }) {
  const percent = (usage / limit) * 100;

  return (
    <div>
      <div
        className="
h-3
bg-gray-200
rounded-full
"
      >
        <div
          className="
h-3
bg-blue-600
rounded-full
"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>
    </div>
  );
}
