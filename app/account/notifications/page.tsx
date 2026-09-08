import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell, Package, Check, ShieldAlert, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/account/notifications");

  const notifications = await db.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">In-App Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time alerts regarding your orders and account</p>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 bg-slate-50">
          <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-semibold">No notifications at this time.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-xs ${
                n.isRead ? "bg-white border-slate-200 opacity-80" : "bg-indigo-50/40 border-indigo-200 shadow-sm"
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-200 text-indigo-600 shrink-0">
                {n.type === "ORDER" ? (
                  <Package className="w-4 h-4" />
                ) : n.type === "SYSTEM" ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-block mt-2 font-bold text-indigo-600 hover:underline"
                  >
                    View Details &rarr;
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
