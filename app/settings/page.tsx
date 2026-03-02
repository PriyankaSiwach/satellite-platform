"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [mode, setMode] = useState("simulation");
  const [interval, setInterval] = useState(1000);
  const [threshold, setThreshold] = useState(500);

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-semibold">System Configuration</h2>

      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-4">
        <div>
          <label className="block text-sm mb-1">Data Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-neutral-800 p-2 rounded"
          >
            <option value="simulation">Simulation</option>
            <option value="real">Real Satellite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Ingestion Interval (ms)
          </label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full bg-neutral-800 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">
            Alert Threshold (Velocity)
          </label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="w-full bg-neutral-800 p-2 rounded"
          />
        </div>
      </div>
    </div>
  );
}