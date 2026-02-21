"use client";

import { Satellite, Activity, AlertTriangle, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 h-screen p-6">
      <div className="flex items-center gap-3 mb-10">
        <Satellite className="text-blue-500" size={28} />
        <h1 className="text-lg font-semibold tracking-wide">
          Orbital Systems
        </h1>
      </div>

      <nav className="space-y-6 text-sm">
        <div className="flex items-center gap-3 text-neutral-300 hover:text-white cursor-pointer">
          <Activity size={18} />
          <span>Live Telemetry</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-300 hover:text-white cursor-pointer">
          <AlertTriangle size={18} />
          <span>Anomaly Monitor</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-300 hover:text-white cursor-pointer">
          <Satellite size={18} />
          <span>Satellite Fleet</span>
        </div>

        <div className="flex items-center gap-3 text-neutral-300 hover:text-white cursor-pointer">
          <Settings size={18} />
          <span>System Settings</span>
        </div>
      </nav>
    </aside>
  );
}