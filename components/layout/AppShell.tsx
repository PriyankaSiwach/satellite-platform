"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <Header onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <main className="flex-1 min-w-0 p-8">{children}</main>
      </div>
    </div>
  );
}