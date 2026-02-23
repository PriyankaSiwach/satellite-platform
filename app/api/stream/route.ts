import { generateTelemetry } from "@/lib/telemetryService";
import { generateOrbitTelemetry } from "@/lib/orbitEngine";
import { fetchRealTelemetry } from "@/lib/realSatelliteService";
import { getDataSource } from "@/lib/dataSource";


export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {

      const sendTelemetry = async () => {

        const source = getDataSource();

        let telemetry;

        if (source === "real") {
          telemetry = await fetchRealTelemetry();
        } else {
          telemetry = generateOrbitTelemetry();
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(telemetry)}\n\n`)
        );
      };

      sendTelemetry();

      const interval = setInterval(sendTelemetry, 1000);

      return () => clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}