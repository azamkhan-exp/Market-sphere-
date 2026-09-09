import { NextResponse } from "next/server";
import { CategoryRepository } from "@/repositories";

export async function GET() {
  try {
    const categories = await CategoryRepository.getAll();
    return NextResponse.json({ categories });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
