import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, Package, Bell, Shield, Heart, MapPin, Store } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login?redirect=/account");
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      addresses: true,
      sellerProfile: true,
      _count: { select: { orders: true, reviews: true, notifications: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 font-black text-2xl flex items-center justify-center text-white border-2 border-indigo-400">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-black">{user.name}</h1>
            <p className="text-xs text-slate-400">{user.email}</p>
            <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                {user.role}
              </span>
              <span className="text-xs text-slate-400">Member since {formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>

        {user.role === "SELLER" && (
          <Link
            href="/seller/dashboard"
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0"
          >
            <Store className="w-4 h-4" /> Go to Seller Portal
          </Link>
        )}
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/account/orders"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md transition-all group"
        >
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 w-fit mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Your Orders</h3>
          <p className="text-xs text-slate-500 mt-1">
            Track packages, review items, or request returns ({user._count.orders} orders)
          </p>
        </Link>

        <Link
          href="/wishlist"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md transition-all group"
        >
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 w-fit mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Wishlist & Saved</h3>
          <p className="text-xs text-slate-500 mt-1">
            View saved favorites and price drop notifications
          </p>
        </Link>

        <Link
          href="/account/notifications"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-600 hover:shadow-md transition-all group"
        >
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 w-fit mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">
            Delivery updates and promotion alerts ({user._count.notifications} total)
          </p>
        </Link>
      </div>

      {/* Saved Addresses */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-indigo-600" /> Saved Addresses
          </h3>
        </div>

        {user.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div key={addr.id} className="p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                  <span>{addr.fullName}</span>
                  {addr.isDefault && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">Default</span>
                  )}
                </div>
                <p>{addr.street} {addr.apartment}</p>
                <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                <p>{addr.country} • {addr.phone}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">No saved addresses on file yet.</p>
        )}
      </div>
    </div>
  );
}
