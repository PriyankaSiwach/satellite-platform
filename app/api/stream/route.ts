import { generateTelemetry } from "@/lib/telemetryService";
import { generateOrbitTelemetry } from "@/lib/orbitEngine";
import { fetchRealTelemetry } from "@/lib/realSatelliteService";
import { getDataSource } from "@/lib/dataSource";
import { saveTelemetry } from "@/lib/telemetryRepo";


export async function GET(req: Request) {

  const encoder = new TextEncoder();
  const { searchParams } = new URL(req.url);

  const satelliteId =
    searchParams.get("satelliteId") || "SAT-Alpha";

  console.log("Incoming satelliteId:", satelliteId);

  let interval: NodeJS.Timeout;
  let closed = false;

  const stream = new ReadableStream({

    start(controller) {
      const sendTelemetry = async () => {
        if (closed) return;
        try {
          const source = getDataSource();
          let telemetry;
          if (source === "real") {
            telemetry = await fetchRealTelemetry();
          } else {
            telemetry = generateOrbitTelemetry();
          }
          await saveTelemetry(satelliteId, telemetry);
          if (!closed) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify(telemetry)}\n\n`
              )
            );
          }
        } catch (err) {
          console.error("Telemetry error:", err);
        }
      };

      sendTelemetry();
      interval = setInterval(sendTelemetry, 1000);
    },
    cancel() {
      closed = true;
      clearInterval(interval);
      console.log("Stream closed for:", satelliteId);
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

}