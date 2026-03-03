"use client";

import { Menu } from "lucide-react";

type Props = {
  onToggleSidebar: () => void;
};

export default function Header({ onToggleSidebar }: Props) {
  return (
    <header className="h-20 border-b border-neutral-800 text-neutral-100 bg-neutral-950 flex items-center justify-between px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-neutral-400 hover:text-white"
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-xl font-semibold">Satellite Telemetry Dashboard</h2>
          <p className="text-sm text-neutral-400">
            Real-time orbital system monitoring
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <div className="w-2 h-2 bg-green-500 rounded-full" />
        <span>healthy</span>
      </div>
    </header>
  );
}