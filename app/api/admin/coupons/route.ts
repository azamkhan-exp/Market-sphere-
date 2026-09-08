import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CouponSchema } from "@/validators";

export async function GET() {
  try {
    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = CouponSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid coupon data", details: result.error.flatten() }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}
