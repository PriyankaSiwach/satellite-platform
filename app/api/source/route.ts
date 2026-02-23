import { setDataSource } from "@/lib/dataSource";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("mode");

  if (mode === "real" || mode === "simulation") {
    setDataSource(mode);
  }

  return Response.json({ success: true });
}