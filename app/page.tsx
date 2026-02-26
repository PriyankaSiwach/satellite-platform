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
  const [dataMode, setDataMode] = useState<"real" | "simulation">("simulation");
  const [toast, setToast] = useState<string | null>(null);
  const [savedHistory, setSavedHistory] = useState<Telemetry[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isStreaming) return;

    const eventSource = new EventSource(`/api/stream?satelliteId=${selectedSatellite}`);
    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
      eventSource.close();
    };

    eventSource.onmessage = (event) => {
      const newTelemetry = JSON.parse(event.data);
      console.log("LIVE telemetry:", newTelemetry);
      console.log("Incoming telemetry source:", newTelemetry.sourceMode, newTelemetry);
      setTelemetry(newTelemetry);
      setHistory((prev) =>
        [newTelemetry, ...prev].slice(0, 20)
      );
      setUptime((prev) => prev + 1);
    };
    return () => {
      eventSource.close();
    };
  }, [isStreaming, selectedSatellite]);

  useEffect(() => {
    if (!telemetry) return;


    // We will add new alerts later for real fields (altitude/velocity/visibility) if needed.
  }, [telemetry]);

  useEffect(() => {
    let cancelled = false;

    async function loadSaved() {
      setIsLoadingSaved(true);
      try {
        const res = await fetch(`/api/telemetry/history?satelliteId=${selectedSatellite}&limit=20`);
        const data = await res.json();
        if (!cancelled) setSavedHistory(data.items ?? []);
      } catch (e) {
        if (!cancelled) setSavedHistory([]);
      } finally {
        if (!cancelled) setIsLoadingSaved(false);
      }
    }

    loadSaved();
    const t = setInterval(loadSaved, 15000); // refresh every 15s
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [selectedSatellite]);

  if (!telemetry) {
    return (
      <div className="text-white p-8">
        Connecting to satellite stream...
      </div>
    );
  }

  if (!telemetry) {
    return (
      <div className="text-white p-8">
        Connecting to satellite stream...
      </div>
    );
  }

  async function handleModeSwitch(mode: "real" | "simulation") {
    try {
      const res = await fetch("/api/source", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode }),
      });

      if (!res.ok) {
        throw new Error(`Failed to switch mode: ${res.status}`);
      }

      setDataMode(mode);
      setToast(
        mode === "real"
          ? "✅ Switched to Real Satellite mode"
          : "✅ Switched to Simulation mode"
      );

      // auto-hide toast after 2.5 sec
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error("Mode switch failed:", err);
      setToast("❌ Failed to switch data mode");
      setTimeout(() => setToast(null), 2500);
    }
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


  return (
    <div className="flex">
      <Sidebar
        alertCount={alerts.length}
        systemHealth={systemHealth}
      />

      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-8 space-y-8">
          <div className="text-sm text-neutral-500">
            Data Source:{" "}
            <span
              className={
                dataMode === "real" ? "text-green-400 font-semibold" : "text-blue-400 font-semibold"
              }
            >
              {dataMode === "real" ? "REAL SATELLITE" : "SIMULATION"}
            </span>
          </div>
          {toast && (
            <div className="fixed top-6 right-6 z-50">
              <div
                className={`px-4 py-3 rounded-lg shadow-lg border text-sm font-medium ${toast.includes("❌")
                  ? "bg-red-100 text-red-800 border-red-300"
                  : "bg-green-100 text-green-800 border-green-300"
                  }`}
              >
                {toast}
              </div>
            </div>
          )}
          {/* Control Bar */}
          <section className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <label className="text-sm text-neutral-400">
                Active Satellite
              </label>

              <select
                value={selectedSatellite}
                onChange={(e) => {
                  console.log("Selected satellite:", e.target.value);
                  setSelectedSatellite(e.target.value);
                }}
                className="bg-blue-100 border border-neutral-700 px-4 py-2 rounded-lg text-sm"
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
                title="Latitude"
                value={telemetry.latitude.toFixed(4)}
                unit="°"
                status="normal"
              />

              <MetricsCard
                title="Longitude"
                value={telemetry.longitude.toFixed(4)}
                unit="°"
                status="normal"
              />
            </div>
          </section>
          <section>
            <AlertPanel alerts={alerts} />
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
              dataKey="latitude"
              color="#22c55e"
              title="Latitude Trend"
            />

            <TelemetryChart
              data={history}
              dataKey="longitude"
              color="#a855f7"
              title="Longitude Trend"
            />
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold tracking-wide text-neutral-300">
                Saved Telemetry (DynamoDB)
              </h3>
              <span className="text-xs text-neutral-500">
                {isLoadingSaved ? "Loading..." : `Showing ${savedHistory.length} rows`}
              </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
              {savedHistory.length === 0 ? (
                <p className="text-sm text-neutral-400">
                  No saved rows yet for {selectedSatellite}. (Wait for next save cycle.)
                </p>
              ) : (
                <TelemetryTable data={savedHistory} />
              )}
            </div>
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
                Uptime: {uptime}m
              </div>

            </div>

            <button
              onClick={() => setIsStreaming((prev) => !prev)}
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-500 rounded-lg text-sm"
            >
              {isStreaming ? "Pause Stream" : "Resume Stream"}
            </button>

            <button
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-500 rounded-lg text-sm"
              onClick={() => handleModeSwitch("real")}
            >
              Use Real Satellite
            </button>

            <button
              className="px-4 py-2 bg-neutral-200 hover:bg-neutral-500 rounded-lg text-sm"
              onClick={() => handleModeSwitch("simulation")}
            >
              Use Simulation
            </button>

          </section>
        </main>
      </div >
    </div >
  );
}