export type Alert = {
  id: number;
  message: string;
  severity: "warning" | "critical";
  timestamp: string;
};