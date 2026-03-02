"use client";

import { useState } from "react";

type Anomaly = {
  satellite: string;
  metric: string;
  severity: "warning" | "critical";
  timestamp: string;
};

export default function AnomaliesPage() {
  const [anomalies] = useState<Anomaly[]>([
    {
      satellite: "SAT-Alpha",
      metric: "Velocity Deviation",
      severity: "warning",
      timestamp: new Date().toISOString(),
    },
  ]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Anomaly Intelligence</h2>

      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        {anomalies.length === 0 ? (
          <p className="text-neutral-400">No anomalies detected.</p>
        ) : (
          anomalies.map((a, i) => (
            <div
              key={i}
              className="flex justify-between items-center border-b border-neutral-800 py-3"
            >
              <div>
                <div className="font-medium">{a.satellite}</div>
                <div className="text-sm text-neutral-400">{a.metric}</div>
              </div>

              <div className="text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    a.severity === "warning"
                      ? "bg-yellow-900 text-yellow-400"
                      : "bg-red-900 text-red-400"
                  }`}
                >
                  {a.severity}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}