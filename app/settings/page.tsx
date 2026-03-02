"use client";

import { useState, useEffect } from "react";
import { useSystem } from "../context/SystemContext";
import type { SystemConfig } from "../context/SystemContext";

export default function SettingsPage() {
  const { config, applyConfig } = useSystem();

  // Draft state (local only)
  const [draft, setDraft] = useState<SystemConfig>(config);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    setDraft(config);
  }, [config]);

  const handleApply = () => {
    applyConfig(draft);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">
        System Configuration
      </h2>

      <div className="bg-neutral-900 p-6 rounded-xl border border-neutral-800 space-y-6">

        {/* Data Mode */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            Data Source
          </label>
          <select
            value={draft.dataMode}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                dataMode: e.target.value as "simulation" | "real",
              }))
            }
            className="w-full bg-neutral-800 border text-white border-neutral-700 px-4 py-2 rounded-lg"
          >
            <option value="simulation">Simulation</option>
            <option value="real">Real API</option>
          </select>
        </div>

        {/* Streaming Interval */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            Streaming Interval (ms)
          </label>
          <input
            type="number"
            value={draft.streamingInterval}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                streamingInterval: Number(e.target.value),
              }))
            }
            className="w-full bg-neutral-800 border text-white border-neutral-700 px-4 py-2 rounded-lg"
          />
        </div>

        {/* Anomaly Threshold */}
        <div>
          <label className="block text-sm text-neutral-400 mb-2">
            Anomaly Threshold
          </label>
          <input
            type="number"
            value={draft.anomalyThreshold}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                anomalyThreshold: Number(e.target.value),
              }))
            }
            className="w-full bg-neutral-800 text-white border border-neutral-700 px-4 py-2 rounded-lg"
          />
        </div>

        {/* Apply Button */}
        <div className="pt-4">
          <button
            onClick={handleApply}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-medium"
          >
            Apply Changes
          </button>

          {applied && (
            <p className="text-green-400 text-sm mt-3">
              Configuration applied successfully.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}