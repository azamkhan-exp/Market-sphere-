import { NextRequest, NextResponse } from "next/server";
import { AiEngine } from "@/lib/ai";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const prompt = body.prompt || "General marketplace health and recommendations";

    const insights = await AiEngine.adminInsights(prompt);
    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate admin insights" }, { status: 500 });
  }
}
