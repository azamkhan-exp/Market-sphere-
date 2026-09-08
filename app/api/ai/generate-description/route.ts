import { NextRequest, NextResponse } from "next/server";
import { AiEngine } from "@/lib/ai";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, category, specifications, keywords } = body;

    if (!title) {
      return NextResponse.json({ error: "Product title is required" }, { status: 400 });
    }

    const generated = await AiEngine.generateProductDescription({
      title,
      category,
      specifications,
      keywords,
    });

    return NextResponse.json(generated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
