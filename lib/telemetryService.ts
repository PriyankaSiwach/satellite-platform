import { Telemetry } from "@/types/telemetry";

let lastTelemetry: Telemetry | null = null;

export function generateTelemetry(): Telemetry {
  const baseAltitude = 420;
  const baseVelocity = 27500;
  const baseTemp = -65;
  const baseRadiation = 120;

  const telemetry: Telemetry = {
    altitude: baseAltitude + (Math.random() - 0.5) * 10,
    velocity: baseVelocity + (Math.random() - 0.5) * 200,
    temperature: baseTemp + (Math.random() - 0.5) * 20,
    radiation: baseRadiation + (Math.random() - 0.5) * 100,
    timestamp: new Date().toISOString(),
  };

  lastTelemetry = telemetry;
  return telemetry;
}

export function getTelemetry(): Telemetry {
  if (!lastTelemetry) {
    lastTelemetry = generateTelemetry();
  }
  return lastTelemetry;
}