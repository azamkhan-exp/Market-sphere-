"use client";

import * as React from "react";
import { Search, UserCheck, ShieldAlert, UserX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async (q = "") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      setUpdatingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      if (res.ok) fetchUsers(search);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "CUSTOMER" ? "SELLER" : "CUSTOMER";
    try {
      setUpdatingId(userId);
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) fetchUsers(search);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">User Account Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">Manage customer and vendor access, roles, and status</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              fetchUsers(e.target.value);
            }}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
              <tr>
                <th className="p-4">Name & Registered</th>
                <th className="p-4">Email</th>
                <th className="p-4">System Role</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] text-slate-400">{formatDate(u.createdAt)}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === "ADMIN"
                          ? "bg-slate-900 text-white"
                          : u.role === "SELLER"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-700">{u._count?.orders || 0}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.isActive ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.isActive ? "Active" : "Suspended"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {u.role !== "ADMIN" && (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleRole(u.id, u.role)}
                          isLoading={updatingId === u.id}
                          className="text-[11px] h-7 px-2.5"
                        >
                          Toggle Role
                        </Button>
                        <Button
                          size="sm"
                          variant={u.isActive ? "danger" : "primary"}
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          isLoading={updatingId === u.id}
                          className="text-[11px] h-7 px-2.5"
                        >
                          {u.isActive ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    )}
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
