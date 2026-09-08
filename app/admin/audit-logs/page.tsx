import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FileText, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/login?redirect=/admin/audit-logs");
  }

  const logs = await db.auditLog.findMany({
    include: {
      actor: { select: { name: true, email: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Platform Audit & Security Logs</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable system logs tracking admin interventions, approvals, suspensions, and price adjustments
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
                <th className="p-4">Metadata / Changes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="p-4 font-bold text-slate-900">
                    {log.actor?.name || "System"}
                    <span className="text-[10px] text-slate-400 block font-normal font-mono">
                      {log.actor?.email || "internal"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-slate-600 text-[11px]">
                    {log.entityType} ({log.entityId.slice(0, 10)})
                  </td>
                  <td className="p-4 max-w-xs truncate font-mono text-[11px] text-slate-500">
                    {log.changesJson || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
