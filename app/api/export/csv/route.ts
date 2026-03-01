import { getTelemetryForExport } from "@/lib/telemetryRepo";

function escapeCsv(value: unknown) {
  const s = String(value ?? "");
  // wrap if it contains comma/quote/newline
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const satelliteId = searchParams.get("satelliteId") || "SAT-Alpha";
  const limit = Number(searchParams.get("limit") || "500");

  const rows = await getTelemetryForExport(satelliteId, limit);

  // choose columns you want in the export
  const headers = ["timestamp", "satelliteId", "sourceMode", "altitude", "velocity", "latitude", "longitude"];

  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escapeCsv(r[h])).join(",")),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${satelliteId}-telemetry.csv"`,
      "Cache-Control": "no-store",
    },
  });
}