"use client";

import { createContext, useContext, useState } from "react";
import { Alert } from "@/types/alert";

type AlertsContextType = {
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
};

const AlertsContext = createContext<AlertsContextType | null>(null);

export function AlertsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  return (
    <AlertsContext.Provider value={{ alerts, setAlerts }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useAlerts must be used inside AlertsProvider");
  }
  return context;
}