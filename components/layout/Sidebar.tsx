"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Satellite, Activity, AlertTriangle, Settings } from "lucide-react";

type Props = {
  alertCount: number;
  systemHealth: "healthy" | "warning" | "critical";
};

const navItems = [
  { name: "Live Telemetry", href: "/dashboard", icon: Activity },
  { name: "Anomaly Monitor", href: "/anomalies", icon: AlertTriangle },
  { name: "Satellite Fleet", href: "/fleet", icon: Satellite },
  { name: "System Settings", href: "/settings", icon: Settings },
];

export default function Sidebar({ alertCount, systemHealth }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 h-screen p-6">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <Satellite className="text-blue-500" size={28} />
        <h1 className="text-lg font-semibold tracking-wide text-white">
          Orbital Systems
        </h1>
      </div>

      {/* System Health Badge */}
      <div className="mb-8">
        <span
          className={`text-xs px-3 py-1 rounded-full inline-block ${
            systemHealth === "healthy"
              ? "bg-green-900 text-green-400"
              : systemHealth === "warning"
              ? "bg-yellow-900 text-yellow-400"
              : "bg-red-900 text-red-400"
          }`}
        >
          {systemHealth.toUpperCase()}
        </span>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map(({ name, href, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={name}
              href={href}
              className={`flex items-center justify-between px-4 py-2 rounded-lg transition ${
                active
                  ? "bg-neutral-800 text-green-400"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span>{name}</span>
              </div>

              {name === "Anomaly Monitor" && alertCount > 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {alertCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}