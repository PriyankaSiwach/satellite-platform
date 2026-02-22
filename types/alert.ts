export type Alert = {
  id: string;
  type: string;
  message: string;
  severity: "warning" | "critical";
  timestamp: string;
};