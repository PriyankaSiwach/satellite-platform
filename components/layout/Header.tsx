"use client";

import { useSystem } from "@/app/context/SystemContext";

export default function Header() {
  const { config } = useSystem();

  const systemHealth =
    config.dataMode === "real" ? "healthy" : "healthy";

  return (
    <header className="h-20 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold">
          Satellite Telemetry Dashboard
        </h2>
        <p className="text-sm text-neutral-400">
          Real-time orbital system monitoring
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span className="text-neutral-300">
          {systemHealth}
        </span>
      </div>
    </header>
  );
}