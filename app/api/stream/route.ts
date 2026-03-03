import { generateOrbitTelemetry } from "@/lib/orbitEngine";
import { fetchRealTelemetry } from "@/lib/realSatelliteService";
import { getDataSource } from "@/lib/dataSource";
import { saveTelemetry } from "@/lib/telemetryRepo";

export async function GET(req: Request) {
  const encoder = new TextEncoder();
  const { searchParams } = new URL(req.url);
  const satelliteId = searchParams.get("satelliteId") || "SAT-Alpha";
  const intervalMs = Number(searchParams.get("interval")) || 1000;

  console.log("Streaming started for:", satelliteId);

  let intervalId: ReturnType<typeof setInterval> | null = null;
  let closed = false;

  const cleanup = () => {
    if (closed) return;
    closed = true;

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    console.log("Streaming stopped for:", satelliteId);
  };

  // Important: detect browser disconnect / tab change / component unmount
  req.signal.addEventListener("abort", () => {
    cleanup();
  });

  const stream = new ReadableStream({
    async start(controller) {

      const sendTelemetry = async () => {
        if (closed) return;

        try {
          const source = getDataSource();

          let telemetry;
          if (source === "real") {
            telemetry = await fetchRealTelemetry();
          } else {
            telemetry = generateOrbitTelemetry(); // no await
          }
          telemetry.sourceMode = source;      // "real" or "simulation"
          telemetry.satelliteId = satelliteId;

          // Ensure selected satellite is attached to outgoing payload + DB item
          telemetry = {
            ...telemetry,
            satelliteId,
          };

          await saveTelemetry(satelliteId, telemetry);

          if (closed) return;

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(telemetry)}\n\n`)
          );
        } catch (err) {
          console.error("Telemetry error:", err);

          // Optional: send SSE error event to client instead of crashing stream
          if (!closed) {
            try {
              controller.enqueue(
                encoder.encode(
                  `event: error\ndata: ${JSON.stringify({
                    message: "Telemetry stream error",
                  })}\n\n`
                )
              );
            } catch {
              cleanup();
            }
          }
        }
      };

      // Send first data immediately
      await sendTelemetry();

      // Then every 3 seconds
      intervalId = setInterval(sendTelemetry, intervalMs);
    },

    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}