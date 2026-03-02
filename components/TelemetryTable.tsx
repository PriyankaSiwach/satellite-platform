import { Telemetry } from "@/types/telemetry";

type Props = {
  data: Telemetry[];
};

export default function TelemetryTable({ data }: Props) {
  const format = (value: number | undefined, digits: number) =>
    value !== undefined ? value.toFixed(digits) : "--";
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
              <th>Latitude (°)</th>
              <th>Longitude (°)</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-neutral-800 hover:bg-neutral-800/40 transition"
              >
                <td>{format(item.altitude, 1)}</td>
                <td>{format(item.velocity, 0)}</td>
                <td>{format(item.latitude, 4)}</td>
                <td>{format(item.longitude, 4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}