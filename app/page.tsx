"use client";
import AlertPanel from "@/components/AlertPanel";
import { generateTelemetry } from "@/lib/generateTelemetry";
import { Telemetry } from "@/types/telemetry";
import { useState, useEffect } from "react";
import MetricsCard from "@/components/MetricsCard";
import { Alert } from "@/types/alert";
import TelemetryTable from "@/components/TelemetryTable";
import TelemetryChart from "@/components/TelemetryChart";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { generateOrbitTelemetry } from "@/lib/orbitEngine";
import { fetchRealTelemetry } from "@/lib/realSatelliteService";
import { getDataSource } from "@/lib/dataSource";

export default function Home() {
  const [selectedSatellite, setSelectedSatellite] = useState("SAT-Alpha");
  const [time, setTime] = useState(new Date());
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<Telemetry[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    const eventSource = new EventSource("/api/stream");
    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    eventSource.onmessage = (event) => {
      const newTelemetry = JSON.parse(event.data);
      setTelemetry(newTelemetry);
      setHistory((prev) =>
        [newTelemetry, ...prev].slice(0, 20)
      );
      setUptime((prev) => prev + 1);
    };
    return () => {
      eventSource.close();
    };
  }, [isStreaming]);

  useEffect(() => {
    if (!telemetry) return;

    const newAlerts: Alert[] = [];

    if (telemetry.radiation > 200) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: "radiation",
        message: `High radiation detected: ${telemetry.radiation.toFixed(1)} µSv`,
        severity: "critical",
        timestamp: new Date().toISOString(),
      });
    }

    if (telemetry.temperature < -100) {
      newAlerts.push({
        id: crypto.randomUUID(),
        type: "temperature",
        message: `Extreme temperature drop: ${telemetry.temperature.toFixed(1)} °C`,
        severity: "warning",
        timestamp: new Date().toISOString(),
      });
    }


    if (newAlerts.length > 0) {
      setAlerts((prev) => {
        const filtered = newAlerts.filter(
          (newAlert) =>
            !prev.some(
              (existing) =>
                existing.message === newAlert.message &&
                existing.timestamp === newAlert.timestamp
            )
        );
        return [...filtered, ...prev].slice(0, 50);
      });
    }

  }, [telemetry]);

  if (!telemetry) {
    return (
      <div className="text-white p-8">
        Connecting to satellite stream...
      </div>
    );
  }

  function computeSystemHealth() {
    const criticalCount = alerts.filter(
      (a) => a.severity === "critical"
    ).length;

    if (criticalCount > 0) return "critical";

    const warningCount = alerts.filter(
      (a) => a.severity === "warning"
    ).length;

    if (warningCount > 0) return "warning";

    return "healthy";
  }

  const systemHealth = computeSystemHealth();

  function getTemperatureStatus(temp: number) {
    if (temp > -40) return "warning";
    if (temp > -20) return "critical";
    return "normal";
  }

  function getRadiationStatus(rad: number) {
    if (rad > 180) return "critical";
    if (rad > 120) return "warning";
    return "normal";
  }
  if (!telemetry) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar
        alertCount={alerts.length}
        systemHealth={systemHealth}
      />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-8 space-y-8">
          {/* Control Bar */}
          <section className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <label className="text-sm text-neutral-400">
                Active Satellite
              </label>

              <select
                value={selectedSatellite}
                onChange={(e) => setSelectedSatellite(e.target.value)}
                className="bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-sm"
              >
                <option>SAT-Alpha</option>
                <option>SAT-Beta</option>
                <option>SAT-Gamma</option>
              </select>
            </div>

            <div className="text-sm text-neutral-400">
              {time.toUTCString()}
            </div>
          </section>

          {/* Metrics */}
          <section>
            <h2 className="text-lg font-semibold mb-6 tracking-wide">
              Live Satellite Metrics
            </h2>

            <div className="grid grid-cols-4 gap-6">
              <MetricsCard
                title="Altitude"
                value={telemetry.altitude.toFixed(1)}
                unit="km"
                status="normal"
              />

              <MetricsCard
                title="Velocity"
                value={telemetry.velocity.toFixed(0)}
                unit="km/h"
                status="normal"
              />

              <MetricsCard
                title="Temperature"
                value={telemetry.temperature.toFixed(0)}
                unit="°C"
                status={getTemperatureStatus(telemetry.temperature)}
              />

              <MetricsCard
                title="Radiation"
                value={telemetry.radiation.toFixed(0)}
                unit="µSv"
                status={getRadiationStatus(telemetry.radiation)}
              />
            </div>
          </section>
          <section>
            <AlertPanel alerts={alerts} />
          </section>
          <section>
            <TelemetryTable data={history} />
          </section>
          <section className="grid grid-cols-3 gap-6">
            <TelemetryChart
              data={history}
              dataKey="altitude"
              color="#3b82f6"
              title="Altitude Trend"
            />

            <TelemetryChart
              data={history}
              dataKey="temperature"
              color="#facc15"
              title="Temperature Trend"
            />

            <TelemetryChart
              data={history}
              dataKey="radiation"
              color="#ef4444"
              title="Radiation Trend"
            />
          </section>
          <section className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-xl p-4">

            <div className="flex items-center gap-6 text-sm">

              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${isStreaming ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                />
                <span className={isStreaming ? "text-green-500 animate-pulse" : "text-red-500"}>
                  {isStreaming ? "Streaming Active" : "Streaming Paused"}
                </span>
              </div>

              <div className="text-neutral-100">
                Uptime: {uptime}s
              </div>

            </div>

            <button
              onClick={() => setIsStreaming((prev) => !prev)}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-500 rounded-lg text-sm"
            >
              {isStreaming ? "Pause Stream" : "Resume Stream"}
            </button>

            <button className="px-4 py-2 bg-neutral-200 hover:bg-neutral-500 rounded-lg text-sm"
              onClick={() =>
                fetch("/api/source", {
                  method: "POST",
                  body: JSON.stringify({ mode: "real" }),
                })
              }

            >
              Use Real Satellite
            </button>

            <button className="px-4 py-2 bg-neutral-200 hover:bg-neutral-500 rounded-lg text-sm"
              onClick={() =>
                fetch("/api/source", {
                  method: "POST",
                  body: JSON.stringify({ mode: "simulation" }),
                })
              }

            >
              Use Simulation
            </button>

          </section>
        </main>
      </div >
    </div >
  );
}