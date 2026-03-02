"use client";

import { useEffect, useMemo, useState } from "react";

type SatelliteStatus = {
  id: string;
  health: "healthy" | "warning" | "critical";
  streaming: boolean;
  lastUpdate: string;
  anomalyCount: number;
  latencyMs: number;
};

const satellites = ["SAT-Alpha", "SAT-Beta", "SAT-Gamma"];

export default function FleetPage() {
  const [fleet, setFleet] = useState<SatelliteStatus[]>([]);
  const [sortBy, setSortBy] = useState<"health" | "latency" | "anomalies">(
    "health"
  );

  const randomHealth = (): "healthy" | "warning" | "critical" => {
    const r = Math.random();
    if (r > 0.95) return "critical";
    if (r > 0.8) return "warning";
    return "healthy";
  };

  useEffect(() => {
    const simulatedFleet: SatelliteStatus[] = satellites.map((id) => ({
      id,
      health: randomHealth(),
      streaming: true,
      lastUpdate: new Date().toISOString(),
      anomalyCount: Math.floor(Math.random() * 3),
      latencyMs: Math.floor(Math.random() * 200),
    }));

    setFleet(simulatedFleet);
  }, []);

  /* =========================
     DERIVED ANALYTICS (INSIDE COMPONENT)
     ========================= */

  const total = fleet.length;

  const healthyCount = fleet.filter((s) => s.health === "healthy").length;
  const warningCount = fleet.filter((s) => s.health === "warning").length;
  const criticalCount = fleet.filter((s) => s.health === "critical").length;

  const avgLatency =
    total > 0
      ? fleet.reduce((sum, s) => sum + s.latencyMs, 0) / total
      : 0;

  const totalAnomalies = fleet.reduce(
    (sum, s) => sum + s.anomalyCount,
    0
  );

  const fleetHealthScore =
    total > 0
      ? (
          (healthyCount * 1 +
            warningCount * 0.5 +
            criticalCount * 0) /
          total
        ).toFixed(2)
      : "0";

  /* =========================
     SORTING
     ========================= */

  const sortedFleet = useMemo(() => {
    const copy = [...fleet];

    if (sortBy === "latency") {
      return copy.sort((a, b) => b.latencyMs - a.latencyMs);
    }

    if (sortBy === "anomalies") {
      return copy.sort((a, b) => b.anomalyCount - a.anomalyCount);
    }

    // health priority sort
    const priority = { critical: 3, warning: 2, healthy: 1 };
    return copy.sort(
      (a, b) => priority[b.health] - priority[a.health]
    );
  }, [fleet, sortBy]);

  /* =========================
     UI
     ========================= */

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">
        Satellite Fleet Overview
      </h2>

      {/* ===== Fleet Summary ===== */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 grid grid-cols-4 gap-6 text-sm">
        <div>
          <div className="text-neutral-400">Total Satellites</div>
          <div className="text-white font-semibold">{total}</div>
        </div>

        <div>
          <div className="text-neutral-400">Healthy</div>
          <div className="text-green-400 font-semibold">
            {healthyCount}
          </div>
        </div>

        <div>
          <div className="text-neutral-400">Warnings</div>
          <div className="text-yellow-400 font-semibold">
            {warningCount}
          </div>
        </div>

        <div>
          <div className="text-neutral-400">Critical</div>
          <div className="text-red-400 font-semibold">
            {criticalCount}
          </div>
        </div>

        <div>
          <div className="text-neutral-400">Avg Latency</div>
          <div className="font-semibold text-white">
            {avgLatency.toFixed(0)} ms
          </div>
        </div>

        <div>
          <div className="text-neutral-400">
            Total Anomalies
          </div>
          <div className="font-semibold text-white">{totalAnomalies}</div>
        </div>

        <div>
          <div className="text-neutral-400">
            Fleet Health Score
          </div>
          <div className="font-semibold text-white ">
            {fleetHealthScore}
          </div>
        </div>
      </div>

      {/* ===== Sort Control ===== */}
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as
                | "health"
                | "latency"
                | "anomalies"
            )
          }
          className="bg-white-800 border border-neutral-700 px-3 py-2 rounded-lg text-sm"
        >
          <option value="health">Sort by Health</option>
          <option value="latency">Sort by Latency</option>
          <option value="anomalies">
            Sort by Anomalies
          </option>
        </select>
      </div>

      {/* ===== Satellite Cards ===== */}
      <div className="grid grid-cols-3 gap-6">
        {sortedFleet.map((sat) => (
          <div
            key={sat.id}
            className="bg-neutral-900 p-6 rounded-xl border border-neutral-800"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">
                {sat.id}
              </h3>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  sat.health === "healthy"
                    ? "bg-green-900 text-green-400"
                    : sat.health === "warning"
                    ? "bg-yellow-900 text-yellow-400"
                    : "bg-red-900 text-red-400"
                }`}
              >
                {sat.health}
              </span>
            </div>

            <div className="text-sm text-neutral-400 space-y-2">
              <div>
                Streaming:{" "}
                {sat.streaming ? "Active" : "Stopped"}
              </div>
              <div>Latency: {sat.latencyMs} ms</div>
              <div>Anomalies: {sat.anomalyCount}</div>
              <div>
                Last Update: {sat.lastUpdate}
              </div>
            </div>

            <button
              onClick={() =>
                setFleet((prev) =>
                  prev.map((s) =>
                    s.id === sat.id
                      ? {
                          ...s,
                          streaming: !s.streaming,
                        }
                      : s
                  )
                )
              }
              className="mt-4 w-full bg-blue-500 hover:bg-neutral-700 py-2 rounded-lg text-sm"
            >
              Toggle Stream
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}