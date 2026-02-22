"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Telemetry } from "@/types/telemetry";

type Props = {
  data: Telemetry[];
  dataKey: keyof Telemetry;
  color: string;
  title: string;
};

export default function TelemetryChart({
  data,
  dataKey,
  color,
  title,
}: Props) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
      <h3 className="text-sm font-semibold mb-4 text-neutral-300 tracking-wide">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={[...data].reverse()}>
          <CartesianGrid stroke="#262626" strokeDasharray="3 3" />
          <XAxis hide />
          <YAxis
            stroke="#a3a3a3"
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#171717",
              border: "1px solid #333",
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}