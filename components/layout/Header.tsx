export default function Header() {
  return (
    <header className="h-20 border-b border-neutral-800 text-neutral-100 bg-neutral-950 flex items-center justify-between px-8">
      <div>
        <h2 className="text-xl font-semibold">
          Satellite Telemetry Dashboard
        </h2>
        <p className="text-sm text-neutral-400">
          Real-time orbital system monitoring
        </p>
      </div>

      <div className="flex items-center gap-4 text-sm text-neutral-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>System Healthy</span>
        </div>
      </div>
    </header>
  );
}