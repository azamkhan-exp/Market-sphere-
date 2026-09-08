import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const users = await db.user.findMany({
      where: q
        ? {
            OR: [{ name: { contains: q } }, { email: { contains: q } }],
          }
        : {},
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true, reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, role, isActive } = body;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        role: role || undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    await createAuditLog({
      actorId: session.userId,
      actorRole: "ADMIN",
      action: isActive === false ? "USER_SUSPENDED" : "USER_UPDATED",
      entityType: "USER",
      entityId: userId,
      changesJson: JSON.stringify({ role, isActive }),
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
