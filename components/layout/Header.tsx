type Props = {
  systemHealth: "healthy" | "warning" | "critical";
  ingestionRate?: number;
  latencyMs?: number;
};

export default function Header({
  systemHealth,
  ingestionRate,
  latencyMs,
}: Props) {
  const color =
    systemHealth === "healthy"
      ? "bg-green-500"
      : systemHealth === "warning"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <header className="h-20 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Satellite Telemetry Dashboard
        </h2>
        <p className="text-sm text-neutral-400">
          Real-time orbital system monitoring
        </p>
      </div>

      <div className="flex items-center gap-6 text-sm text-neutral-300">
        {ingestionRate !== undefined && (
          <div>Ingestion: {ingestionRate}/sec</div>
        )}
        {latencyMs !== undefined && <div>Latency: {latencyMs} ms</div>}

        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span>{systemHealth}</span>
        </div>
      </div>
    </header>
  );
}