import { NextRequest, NextResponse } from "next/server";
import { AiEngine } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Query message is required" }, { status: 400 });
    }

    const response = await AiEngine.shoppingAssistant(message, history || []);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("AI Assistant error:", error);
    return NextResponse.json({ error: "Failed to process AI assistant request" }, { status: 500 });
  }
}
