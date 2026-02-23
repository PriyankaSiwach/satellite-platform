import { NextResponse } from "next/server";
import { generateTelemetry } from "@/lib/telemetryService";

export async function GET() {
  const telemetry = generateTelemetry();

  return NextResponse.json(telemetry);
}