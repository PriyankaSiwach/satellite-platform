import { Telemetry } from "@/types/telemetry";

let time = 0;

export function generateOrbitTelemetry(): Telemetry {
  time += 0.05;

  const altitude = 420 + Math.sin(time) * 15;
  const velocity = 27600 + Math.cos(time) * 50;

  const radiation =
    120 +
    Math.sin(time * 0.5) * 80 +
    (Math.random() < 0.05 ? 150 : 0);

  const temperature =
    -65 +
    Math.cos(time * 0.7) * 25;

  return {
    altitude,
    velocity,
    temperature,
    radiation,
    timestamp: new Date().toISOString(),
  };
}