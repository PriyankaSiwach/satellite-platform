import { getLatestTelemetry } from "@/lib/telemetryRepo";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const satelliteId = searchParams.get("satelliteId") || "SAT-Alpha";
  const limit = Number(searchParams.get("limit") ?? "20");

  const items = await getLatestTelemetry(satelliteId, Math.min(limit, 50));

  return Response.json({ satelliteId, items });
}