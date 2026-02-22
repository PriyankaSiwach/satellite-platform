"use client";

import { Satellite, Activity, AlertTriangle, Settings } from "lucide-react";
type Props = {
    alertCount: number;
    systemHealth: "healthy" | "warning" | "critical";
};
export default function Sidebar({ alertCount, systemHealth, }: Props) {
    return (
        <aside className="w-64 bg-neutral-900 border-r border-neutral-800 h-screen p-6">
            <div className="flex items-center gap-3 mb-10">
                <Satellite className="text-blue-500" size={28} />
                <h1 className="text-lg font-semibold tracking-wide">
                    Orbital Systems
                </h1>
            </div>
            <div className="mb-8">
                <div
                    className={`text-xs px-3 py-1 rounded-full inline-block ${systemHealth === "healthy"
                        ? "bg-green-900 text-green-400"
                        : systemHealth === "warning"
                            ? "bg-yellow-900 text-yellow-400"
                            : "bg-red-900 text-red-400"
                        }`}>
                    {systemHealth.toUpperCase()}
                </div>
            </div>

            <nav className="space-y-6 text-sm">
                <div className="flex items-center gap-3 text-neutral-300 hover:text-white cursor-pointer">
                    <Activity size={18} />
                    <span>Live Telemetry</span>
                </div>

                <div className="flex items-center justify-between text-neutral-300 hover:text-white cursor-pointer">
                    <div className="flex items-center gap-3">
                        <AlertTriangle size={18} />
                        <span>Anomaly Monitor</span>
                    </div>

                    {alertCount > 0 && (
                        <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {alertCount}
                        </span>
                    )}
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