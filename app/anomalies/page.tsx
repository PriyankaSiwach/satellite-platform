"use client";

import { useMemo, useState, useEffect } from "react";
import { useAlerts } from "../context/AlertsContext";

type Anomaly = {
  satellite: string;
  metric: string;
  severity: "warning" | "critical";
  timestamp: string;
};

export default function AnomaliesPage() {
  const { alerts } = useAlerts();
  const [sortBy, setSortBy] = useState<"severity" | "satellite">("severity");
  const anomalies: Anomaly[] = alerts.map((alert) => ({
    satellite: alert.satelliteId,
    metric: alert.type,
    severity: alert.severity,
    timestamp: alert.timestamp,
  }));




  /* =========================
     DERIVED INTELLIGENCE
     ========================= */

  const total = anomalies.length;
  const criticalCount = anomalies.filter(
    (a) => a.severity === "critical"
  ).length;

  const warningCount = anomalies.filter(
    (a) => a.severity === "warning"
  ).length;

  const riskScore =
    total > 0
      ? (
        (criticalCount * 1 + warningCount * 0.5) /
        total
      ).toFixed(2)
      : "0";

  // Satellite-level aggregation
  const satelliteSummary = useMemo(() => {
    const map: Record<
      string,
      { total: number; critical: number }
    > = {};

    anomalies.forEach((a) => {
      if (!map[a.satellite]) {
        map[a.satellite] = { total: 0, critical: 0 };
      }
      map[a.satellite].total++;
      if (a.severity === "critical") {
        map[a.satellite].critical++;
      }
    });

    return Object.entries(map).map(([satellite, data]) => ({
      satellite,
      total: data.total,
      critical: data.critical,
      riskLevel:
        data.critical > 0
          ? "high"
          : data.total > 1
            ? "medium"
            : "low",
    }));
  }, [anomalies]);

  const sortedAnomalies = useMemo(() => {
    const copy = [...anomalies];

    if (sortBy === "satellite") {
      return copy.sort((a, b) =>
        a.satellite.localeCompare(b.satellite)
      );
    }

    const priority = { critical: 2, warning: 1 };
    return copy.sort(
      (a, b) => priority[b.severity] - priority[a.severity]
    );
  }, [anomalies, sortBy]);

  /* =========================
     UI
     ========================= */

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">
        Anomaly Intelligence
      </h2>

      {/* ===== Risk Overview ===== */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 grid grid-cols-4 gap-6 text-sm">
        <div>
          <div className="text-neutral-400">
            Total Anomalies
          </div>
          <div className="text-green-400 font-semibold">
            {total}
          </div>
        </div>

        <div>
          <div className="text-neutral-400">Critical</div>
          <div className="text-red-400 font-semibold">
            {criticalCount}
          </div>
        </div>

        <div>
          <div className="text-neutral-400">Warnings</div>
          <div className="text-yellow-400 font-semibold">
            {warningCount}
          </div>
        </div>

        <div>
          <div className="text-neutral-400">
            Risk Score
          </div>
          <div className="font-semibold text-white">
            {riskScore}
          </div>
        </div>
      </div>

      {/* ===== Satellite Risk Ranking ===== */}
      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800">
        <h3 className="mb-4 font-semibold text-white">
          Satellite Risk Ranking
        </h3>

        {satelliteSummary.map((s) => (
          <div
            key={s.satellite}
            className="flex justify-between items-center border-b border-neutral-800 py-2 text-white"
          >
            <div>{s.satellite}</div>
            <div>
              <span className="text-neutral-400 mr-4">
                {s.total} anomalies
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs ${s.riskLevel === "high"
                    ? "bg-red-900 text-red-400"
                    : s.riskLevel === "medium"
                      ? "bg-yellow-900 text-yellow-400"
                      : "bg-green-900 text-green-400"
                  }`}
              >
                {s.riskLevel}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Sort Control ===== */}
      <div className="flex justify-end">
        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(
              e.target.value as "severity" | "satellite"
            )
          }
          className="bg-white-800 border border-neutral-700 px-3 py-2 rounded-lg text-sm"
        >
          <option value="severity">
            Sort by Severity
          </option>
          <option value="satellite">
            Sort by Satellite
          </option>
        </select>
      </div>

      {/* ===== Detailed Anomaly List ===== */}
      <div className="bg-neutral-900 rounded-xl p-6 border border-neutral-800">
        {sortedAnomalies.length === 0 ? (
          <p className="text-neutral-400 text-sm">No active anomalies detected.</p>
        ) : (sortedAnomalies.map((a, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b border-neutral-800 py-3 text-sm"
          >
            <div>
              <div className="font-medium">
                {a.satellite}
              </div>
              <div className="text-neutral-400">
                {a.metric}
              </div>
              <div className="text-neutral-500 text-xs">
                {a.timestamp}
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs ${a.severity === "warning"
                  ? "bg-yellow-900 text-yellow-400"
                  : "bg-red-900 text-red-400"
                }`}
            >
              {a.severity}
            </span>
          </div>
        )))}
      </div>
    </div>
  );
}