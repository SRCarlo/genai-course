import Card from "../../components/dashboard/Card";
import ProgressBar from "../../components/dashboard/ProgressBar";

export default function Dashboard() {
  return (
    <div>
      <h1
        className="
text-4xl
font-bold
mb-8
"
      >
        Welcome Back 👋
      </h1>

      <div
        className="
grid
md:grid-cols-3
gap-6
"
      >
        <Card title="Plan" value="Free" />

        <Card title="Usage" value="20" />

        <Card title="Remaining" value="80" />
      </div>

      <div
        className="
bg-white
p-6
rounded-xl
mt-8
"
      >
        <h2
          className="
font-bold
mb-4
"
        >
          AI Usage
        </h2>

        <ProgressBar usage={20} limit={100} />
      </div>
    </div>
  );
}
