import MetricsCard from "@/components/MetricsCard";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold mb-6 tracking-wide">
          Live Satellite Metrics
        </h2>

        <div className="grid grid-cols-4 gap-6">
          <MetricsCard
            title="Altitude"
            value="421.6"
            unit="km"
            status="normal"
          />

          <MetricsCard
            title="Velocity"
            value="27,540"
            unit="km/h"
            status="normal"
          />

          <MetricsCard
            title="Temperature"
            value="-84"
            unit="°C"
            status="warning"
          />

          <MetricsCard
            title="Radiation"
            value="186"
            unit="µSv"
            status="critical"
          />
        </div>
      </section>
    </div>
  );
}