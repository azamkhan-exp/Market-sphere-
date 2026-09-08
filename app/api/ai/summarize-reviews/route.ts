import { NextRequest, NextResponse } from "next/server";
import { AiEngine } from "@/lib/ai";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const summary = await AiEngine.summarizeReviews(productId);
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json({ error: "Failed to summarize reviews" }, { status: 500 });
  }
}
