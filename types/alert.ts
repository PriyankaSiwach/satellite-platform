export type Alert = {
  id: string;
  satelliteId: string;
  message: string;
  severity: "warning" | "critical";
  timestamp: string;
};