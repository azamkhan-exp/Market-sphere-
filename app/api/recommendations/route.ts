import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { RecommendationService } from "@/services/recommendationService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const limit = parseInt(searchParams.get("limit") || "6", 10);

    if (productId) {
      const products = await RecommendationService.getCustomersAlsoBought(productId, limit);
      return NextResponse.json({ success: true, products });
    }

    const products = await RecommendationService.getPersonalizedRecommendations(session?.userId, limit);
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error("Recommendations API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
