import { Alert } from "@/types/alert";

type Props = {
  alerts: Alert[];
};

export default function AlertPanel({ alerts }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold mb-4 text-neutral-300 tracking-wide">
        Active Alerts
      </h3>

      {alerts.length === 0 && (
        <p className="text-neutral-500 text-sm">
          No active anomalies detected.
        </p>
      )}

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg text-sm border ${
              alert.severity === "critical"
                ? "bg-red-950 border-red-800 text-red-400"
                : "bg-yellow-950 border-yellow-800 text-yellow-400"
            }`}
          >
            <div className="flex justify-between">
              <span>{alert.message}</span>
              <span className="text-xs opacity-70">
                {alert.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}