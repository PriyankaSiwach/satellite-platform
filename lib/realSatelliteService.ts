import { Telemetry } from "@/types/telemetry";

export async function fetchRealTelemetry(): Promise<Telemetry> {
  try {
    const res = await fetch(
      "https://api.wheretheiss.at/v1/satellites/25544"
    );

    const data = await res.json();

    // SAFETY CHECK
    if (!data || !data.latitude) {
      throw new Error("Invalid satellite data");
    }

    return {
      altitude: data.altitude ?? 420,
      velocity: data.velocity ?? 27500,
      temperature: -65 + Math.random() * 10,
      radiation: 120 + Math.random() * 50,
      timestamp: new Date().toISOString(),
    };

  } catch (err) {

    console.error("Real satellite fetch failed, using fallback");

    // fallback simulation
    return {
      altitude: 420 + Math.random() * 10,
      velocity: 27500 + Math.random() * 200,
      temperature: -65 + Math.random() * 10,
      radiation: 120 + Math.random() * 50,
      timestamp: new Date().toISOString(),
    };
  }
}