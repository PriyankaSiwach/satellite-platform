import { getDataSource, setDataSource } from "@/lib/dataSource";

export async function GET() {
  return Response.json({
    success: true,
    mode: getDataSource(),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = body?.mode;

    if (mode !== "real" && mode !== "simulation") {
      return Response.json(
        { success: false, error: "Invalid mode" },
        { status: 400 }
      );
    }

    setDataSource(mode);

    return Response.json({
      success: true,
      mode,
      message: `Switched to ${mode}`,
    });
  } catch (error) {
    console.error("POST /api/source error:", error);

    return Response.json(
      { success: false, error: "Bad request body" },
      { status: 400 }
    );
  }
}