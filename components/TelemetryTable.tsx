import { Telemetry } from "@/types/telemetry";

type Props = {
  data: Telemetry[];
};

export default function TelemetryTable({ data }: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold mb-4 text-neutral-300 tracking-wide">
        Telemetry History (Last 20 Readings)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-neutral-200">
          <thead className="text-neutral-400 border-b border-neutral-700">
            <tr>
              <th className="py-2">Altitude (km)</th>
              <th className="py-2">Velocity (km/h)</th>
              <th className="py-2">Temp (°C)</th>
              <th className="py-2">Radiation (µSv)</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-neutral-800 hover:bg-neutral-800/40 transition"
              >
                <td className="py-2 text-neutral-300">{item.altitude.toFixed(1)}</td>
                <td className="py-2 text-neutral-300">{item.velocity.toFixed(0)}</td>
                <td className="py-2 text-neutral-300">{item.temperature.toFixed(0)}</td>
                <td className="py-2 text-neutral-300">{item.radiation.toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}