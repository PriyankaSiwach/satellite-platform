import { Telemetry } from "@/types/telemetry";

export function generateTelemetry(): Telemetry {
  return {
    altitude: 400 + Math.random() * 50,
    velocity: 27000 + Math.random() * 800,
    temperature: -120 + Math.random() * 100,
    radiation: 50 + Math.random() * 200,
  };
}