"use client";
import AlertPanel from "@/components/AlertPanel";
import { generateTelemetry } from "@/lib/generateTelemetry";
import { Telemetry } from "@/types/telemetry";
import { useState, useEffect } from "react";
import MetricsCard from "@/components/MetricsCard";
import { Alert } from "@/types/alert";
import TelemetryTable from "@/components/TelemetryTable";

export default function Home() {
  const [selectedSatellite, setSelectedSatellite] = useState("SAT-Alpha");
  const [time, setTime] = useState(new Date());
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [history, setHistory] = useState<Telemetry[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTelemetry(generateTelemetry());

    const interval = setInterval(() => {
      const newTelemetry = generateTelemetry();
      setTelemetry(newTelemetry);
      setHistory((prev) =>
        [newTelemetry, ...prev].slice(0, 20)
      );

      const newAlerts: Alert[] = [];

      if (newTelemetry.radiation > 180) {
        newAlerts.push({
          id: Date.now(),
          message: "Critical radiation spike detected",
          severity: "critical",
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      if (newTelemetry.temperature > -40) {
        newAlerts.push({
          id: Date.now() + 1,
          message: "Thermal boundary warning",
          severity: "warning",
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      if (newAlerts.length > 0) {
        setAlerts((prev) =>
          [...newAlerts, ...prev].slice(0, 10)
        );
      }

    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
    <div className="space-y-8">
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
    </div>
  );
}