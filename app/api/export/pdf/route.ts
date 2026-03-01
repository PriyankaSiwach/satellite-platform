import { getTelemetryForExport } from "@/lib/telemetryRepo";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const satelliteId = searchParams.get("satelliteId") || "SAT-Alpha";
  const limit = Number(searchParams.get("limit") || "200");

  const rows = await getTelemetryForExport(satelliteId, limit);

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${satelliteId} Telemetry Export</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    h1 { margin: 0 0 8px; }
    .meta { color: #555; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
    th { background: #f3f3f3; }
  </style>
</head>
<body>
  <h1>Telemetry Export: ${satelliteId}</h1>
  <div class="meta">Rows: ${rows.length} • Generated: ${new Date().toISOString()}</div>

  <table>
    <thead>
      <tr>
        <th>timestamp</th>
        <th>altitude</th>
        <th>velocity</th>
        <th>latitude</th>
        <th>longitude</th>
        <th>sourceMode</th>
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (r) => `
        <tr>
          <td>${r.timestamp ?? ""}</td>
          <td>${r.altitude ?? ""}</td>
          <td>${r.velocity ?? ""}</td>
          <td>${r.latitude ?? ""}</td>
          <td>${r.longitude ?? ""}</td>
          <td>${r.sourceMode ?? ""}</td>
        </tr>`
        )
        .join("")}
    </tbody>
  </table>

  <script>
    // Optional: auto-open print dialog
    // window.print();
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}