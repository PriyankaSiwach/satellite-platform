export type Alert = {
  id: string;
  satelliteId: string;
  message: string;
  type: "velocity" | "altitude" | "orbit" | "system";
  severity: "warning" | "critical";
  timestamp: string;
};