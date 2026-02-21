
type Alert = {
  id: number;
  message: string;
  severity: "warning" | "critical";
};

const alerts: Alert[] = [
  {
    id: 1,
    message: "Radiation spike detected above threshold",
    severity: "critical",
  },
  {
    id: 2,
    message: "Temperature approaching thermal boundary",
    severity: "warning",
  },
];

export default function AlertPanel() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold mb-4 text-neutral-300 tracking-wide">
        Active Alerts
      </h3>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg text-sm border ${
              alert.severity === "critical"
                ? "bg-red-950 border-red-800 text-red-400"
                : "bg-yellow-950 border-yellow-800 text-yellow-400"
            }`}
          >
            {alert.message}
          </div>
        ))}
      </div>
    </div>
  );
}