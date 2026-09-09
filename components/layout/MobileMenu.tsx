"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Home,
  Layers,
  Zap,
  Package,
  Heart,
  Store,
  ShieldAlert,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onLogout: () => void;
}

export function MobileMenu({ isOpen, onClose, user, onLogout }: MobileMenuProps) {
  // Body scroll lock & ESC listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-[85%] max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300 overflow-y-auto">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-amber-400 flex items-center justify-center text-white font-black text-sm">
              MS
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight text-white">
                Market<span className="text-indigo-400">Sphere</span>
              </span>
              <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                Global Marketplace
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                {user.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 px-4 py-4 space-y-6">
          {/* Main Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Marketplace
            </p>
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Home className="w-4 h-4 text-indigo-600" /> Storefront Home
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/categories"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-600" /> All Categories
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/search?flashDeal=true"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-red-500" /> Flash Deals of the Day
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/account/orders"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-indigo-600" /> Track Orders
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/wishlist"
              onClick={onClose}
              className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4 text-pink-500" /> My Saved Wishlist
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Shop Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/search?category=electronics"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 hover:text-indigo-600"
              >
                Electronics
              </Link>
              <Link
                href="/search?category=fashion"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 hover:text-indigo-600"
              >
                Fashion
              </Link>
              <Link
                href="/search?category=home-living"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 hover:text-indigo-600"
              >
                Home & Living
              </Link>
              <Link
                href="/search?category=sports-fitness"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 hover:text-indigo-600"
              >
                Sports & Fitness
              </Link>
              <Link
                href="/search?category=gaming"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 hover:text-indigo-600"
              >
                Gaming
              </Link>
              <Link
                href="/search?category=beauty-wellness"
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 text-[11px] font-medium text-slate-700 hover:text-indigo-600"
              >
                Beauty
              </Link>
            </div>
          </div>

          {/* Portals & Special Modules */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
              Merchant & Administration
            </p>
            {user?.role === "SELLER" ? (
              <Link
                href="/seller/dashboard"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600" /> Vendor Dashboard
                </span>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </Link>
            ) : (
              <Link
                href="/seller/register"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-900 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-600" /> Become a Verified Seller
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            )}

            {user?.role === "ADMIN" && (
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" /> Platform Admin Suite
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 shrink-0 space-y-2">
          {user ? (
            <>
              <Link
                href="/account"
                onClick={onClose}
                className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 py-1"
              >
                <User className="w-4 h-4 text-slate-400" /> Account Settings
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-700 py-1 w-full text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Customer Care: 24/7 Support</span>
              <span className="font-semibold text-indigo-600">USD ($)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
