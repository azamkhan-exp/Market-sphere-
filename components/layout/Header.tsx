"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Bell,
  Menu,
  X,
  Store,
  ShieldAlert,
  LogOut,
  Package,
  Layers,
  ChevronDown,
} from "lucide-react";
import { Button } from "../ui/Button";

export function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const [cartCount, setCartCount] = React.useState(0);
  const [unreadNotifications, setUnreadNotifications] = React.useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  // Fetch current user and cart on mount
  const refreshUserAndCart = React.useCallback(async () => {
    try {
      const meRes = await fetch("/api/auth/me");
      if (meRes.ok) {
        const data = await meRes.json();
        setUser(data.user);
      }

      const cartRes = await fetch("/api/cart");
      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const count = cartData.cart?.items?.reduce((acc: number, i: any) => acc + i.quantity, 0) || 0;
        setCartCount(count);
      }

      const notifRes = await fetch("/api/notifications");
      if (notifRes.ok) {
        const notifData = await notifRes.json();
        setUnreadNotifications(notifData.unreadCount || 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  React.useEffect(() => {
    refreshUserAndCart();

    const handleCartUpdated = () => refreshUserAndCart();
    window.addEventListener("cart-updated", handleCartUpdated);
    return () => window.removeEventListener("cart-updated", handleCartUpdated);
  }, [refreshUserAndCart]);

  // Autocomplete fetcher
  React.useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (err) {
        console.error(err);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setUserMenuOpen(false);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-between max-w-7xl mx-auto">
        <div className="hidden sm:block">
          🚚 Free nationwide express delivery on orders over $100 with code <span className="font-bold text-amber-400">FREESHIP</span>
        </div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link href="/seller/register" className="hover:text-white flex items-center gap-1">
            <Store className="w-3.5 h-3.5 text-amber-400" /> Become a Seller
          </Link>
          <span>|</span>
          <Link href="/account/orders" className="hover:text-white">Track Order</Link>
          <span>|</span>
          <span>USD ($)</span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-xl tracking-tighter">MS</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Market<span className="text-indigo-600">Sphere</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase -mt-1">
                Global Marketplace
              </span>
            </div>
          </Link>

          {/* Large Search Bar with Autocomplete Suggestions */}
          <div className="relative flex-1 max-w-2xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search over 30,000 products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full h-11 pl-11 pr-24 rounded-full border border-slate-300 bg-slate-50 focus:bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 h-8 px-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute top-12 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 py-2"
                onMouseLeave={() => setShowSuggestions(false)}
              >
                {suggestions.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.url}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-2.5" />
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Nav Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Seller / Admin Portal Quick Link */}
            {user?.role === "SELLER" && (
              <Link href="/seller/dashboard" className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                <Store className="w-3.5 h-3.5 text-indigo-600" /> Seller Hub
              </Link>
            )}
            {user?.role === "ADMIN" && (
              <Link href="/admin/dashboard" className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Admin Suite
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <Link href="/account/notifications" className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Link>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors hidden sm:block">
              <Heart className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <Link href="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center animate-scale">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 hidden md:block max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Account Settings
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                      >
                        <Package className="w-4 h-4 text-slate-400" /> My Orders
                      </Link>

                      {user.role === "SELLER" && (
                        <Link
                          href="/seller/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                        >
                          <Store className="w-4 h-4 text-slate-400" /> Seller Portal
                        </Link>
                      )}

                      {user.role === "ADMIN" && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                        >
                          <ShieldAlert className="w-4 h-4 text-slate-400" /> Admin Suite
                        </Link>
                      )}

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-xs font-semibold">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 md:hidden rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-20 rounded-full border border-slate-300 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button type="submit" className="absolute right-1 top-1 h-8 px-3 rounded-full bg-indigo-600 text-white text-[11px] font-semibold">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Sub-header (Categories & Deals) */}
      <div className="hidden md:block bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10 text-xs font-medium text-slate-700">
          <div className="flex items-center gap-6">
            <Link href="/search" className="flex items-center gap-1.5 font-bold text-slate-900 hover:text-indigo-600">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> All Categories
            </Link>
            <Link href="/search?category=electronics" className="hover:text-indigo-600">Electronics</Link>
            <Link href="/search?category=fashion" className="hover:text-indigo-600">Fashion</Link>
            <Link href="/search?category=home-living" className="hover:text-indigo-600">Home & Kitchen</Link>
            <Link href="/search?category=sports-fitness" className="hover:text-indigo-600">Sports</Link>
            <Link href="/search?category=beauty-wellness" className="hover:text-indigo-600">Beauty</Link>
            <Link href="/search?category=gaming" className="hover:text-indigo-600">Gaming</Link>
            <Link href="/search?flashDeal=true" className="font-semibold text-red-600 hover:text-red-700">⚡ Flash Deals</Link>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Customer Service 24/7</span>
            <span>|</span>
            <Link href="/seller/register" className="font-semibold text-indigo-600 hover:underline">
              Sell on MarketSphere
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-6 space-y-4 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link href="/search?category=electronics" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-slate-50">Electronics</Link>
            <Link href="/search?category=fashion" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-slate-50">Fashion</Link>
            <Link href="/search?category=home-living" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-slate-50">Home & Living</Link>
            <Link href="/search?category=sports-fitness" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-slate-50">Sports & Fitness</Link>
            <Link href="/search?category=gaming" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-slate-50">Gaming</Link>
            <Link href="/search?flashDeal=true" onClick={() => setMobileMenuOpen(false)} className="p-2.5 rounded-lg bg-red-50 text-red-600 font-bold">⚡ Flash Deals</Link>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 py-1">My Wishlist</Link>
            <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-slate-700 py-1">Track Order</Link>
            <Link href="/seller/register" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-indigo-600 py-1">Become a Seller</Link>
          </div>
        </div>
      )}
    </header>
  );
}
