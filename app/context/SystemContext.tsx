"use client";

import { createContext, useContext, useState } from "react";

export type SystemConfig = {
  dataMode: "simulation" | "real";
  streamingInterval: number;
  anomalyThreshold: number;
};

type SystemContextType = {
  config: SystemConfig;
  applyConfig: (newConfig: SystemConfig) => void;
};

const defaultConfig: SystemConfig = {
  dataMode: "simulation",
  streamingInterval: 1000,
  anomalyThreshold: 2,
};

const SystemContext = createContext<SystemContextType | null>(null);

export function SystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);

  const applyConfig = (newConfig: SystemConfig) => {
    setConfig(newConfig);
  };

  return (
    <SystemContext.Provider value={{ config, applyConfig }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error("useSystem must be used inside SystemProvider");
  }
  return context;
}