import { NextRequest, NextResponse } from "next/server";
import { AiEngine } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const structured = await AiEngine.parseNaturalSearch(query);
    return NextResponse.json({ structured });
  } catch (error) {
    return NextResponse.json({ error: "Failed to parse search" }, { status: 500 });
  }
}
