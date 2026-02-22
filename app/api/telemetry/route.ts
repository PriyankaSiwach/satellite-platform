import { NextResponse } from "next/server";

function generateTelemetry() {
  return {
    altitude: 420 + Math.random() * 30,
    velocity: 27000 + Math.random() * 500,
    temperature: -60 - Math.random() * 70,
    radiation: 50 + Math.random() * 200,
    timestamp: new Date().toISOString(),
  };
}

export async function GET() {
  const data = generateTelemetry();
  return NextResponse.json(data);
}