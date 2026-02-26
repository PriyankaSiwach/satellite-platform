import { Telemetry } from "@/types/telemetry";

export function generateTelemetry(): Telemetry {
  return {
    altitude: 400 + Math.random() * 50,
    velocity: 27000 + Math.random() * 800,
    latitude: -51 + Math.random() * 102,
    longitude: -180 + Math.random() * 360,
    timestamp: new Date().toISOString(),
    satelliteId: "SAT-Alpha",
    sourceMode: "simulation",
  };
}