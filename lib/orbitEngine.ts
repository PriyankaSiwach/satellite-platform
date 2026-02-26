import { Telemetry } from "@/types/telemetry";

let time = 0;

export function generateOrbitTelemetry(): Telemetry {
  time += 0.05;

  const altitude = 420 + Math.sin(time) * 15;
  const velocity = 27600 + Math.cos(time) * 50;

  // Simple orbital-style motion (simulation only)
  const latitude = Math.sin(time * 0.7) * 51.6; // ISS-like inclination range
  let longitude = ((time * 20) % 360) - 180;    // wraps from -180 to 180

  return {
    altitude: Number(altitude.toFixed(2)),
    velocity: Number(velocity.toFixed(2)),
    latitude: Number(latitude.toFixed(4)),
    longitude: Number(longitude.toFixed(4)),
    timestamp: new Date().toISOString(),
    satelliteId: "SAT-Alpha", // route.ts will override this anyway
    sourceMode: "simulation",
  };
}