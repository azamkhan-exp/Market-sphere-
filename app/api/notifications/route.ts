import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }

    const [notifications, unreadCount] = await Promise.all([
      db.notification.findMany({
        where: { userId: session.userId },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      db.notification.count({
        where: { userId: session.userId, isRead: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    if (body.id) {
      await db.notification.update({
        where: { id: body.id },
        data: { isRead: true },
      });
    } else {
      await db.notification.updateMany({
        where: { userId: session.userId, isRead: false },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 });
  }
}
