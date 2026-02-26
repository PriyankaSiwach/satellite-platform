export interface Telemetry {
  altitude: number;
  velocity: number;
  latitude: number;
  longitude: number;
  timestamp: string;
  satelliteId?: string;
  sourceMode?: "real" | "simulation";
  visibility?: string; // optional (daylight/eclipsed), if API gives it
}