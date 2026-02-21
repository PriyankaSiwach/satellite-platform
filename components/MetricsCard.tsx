type MetricsCardProps = {
  title: string;
  value: string;
  unit?: string;
  status?: "normal" | "warning" | "critical";
};

export default function MetricsCard({
  title,
  value,
  unit,
  status = "normal",
}: MetricsCardProps) {
  const statusColor =
    status === "normal"
      ? "text-green-400"
      : status === "warning"
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-md">
      <p className="text-sm text-neutral-400 mb-2 tracking-wide">
        {title}
      </p>

      <div className="flex items-end gap-2">
        <h3 className={`text-3xl font-semibold ${statusColor}`}>
          {value}
        </h3>
        {unit && (
          <span className="text-sm text-neutral-500 mb-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}