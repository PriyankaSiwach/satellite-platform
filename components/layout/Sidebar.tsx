"use client";

import Link from "next/link";
import {
  Satellite,
  Activity,
  AlertTriangle,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
};

export default function Sidebar({ isOpen, onToggle }: Props) {
  return (
    <aside
      className={`bg-neutral-950 border-r border-neutral-800 min-h-screen transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <Satellite className="text-blue-500 shrink-0" size={28} />
          {isOpen && (
            <h1 className="text-lg font-semibold whitespace-nowrap">
              Orbital Systems
            </h1>
          )}
        </div>

        <button
          onClick={onToggle}
          className="text-neutral-400 hover:text-white"
        >
          {isOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <div className="px-4 pb-4">
        {isOpen ? (
          <span className="inline-block px-4 py-2 rounded-full text-sm bg-green-900 text-green-400">
            HEALTHY
          </span>
        ) : (
          <div className="w-3 h-3 rounded-full bg-green-500 mx-auto" />
        )}
      </div>

      <nav className="mt-4 space-y-2 px-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200"
        >
          <Activity size={20} className="shrink-0" />
          {isOpen && <span>Live Telemetry</span>}
        </Link>

        <Link
          href="/anomalies"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200"
        >
          <AlertTriangle size={20} className="shrink-0" />
          {isOpen && <span>Anomaly Monitor</span>}
        </Link>

        <Link
          href="/fleet"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200"
        >
          <Satellite size={20} className="shrink-0" />
          {isOpen && <span>Satellite Fleet</span>}
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-neutral-900 text-neutral-200"
        >
          <Settings size={20} className="shrink-0" />
          {isOpen && <span>System Settings</span>}
        </Link>
      </nav>
    </aside>
  );
}