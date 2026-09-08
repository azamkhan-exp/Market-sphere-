"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
        if (data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (data.user.role === "SELLER") {
          router.push("/seller/dashboard");
        } else {
          router.push(redirectUrl);
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err: any) {
      setError("Network error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md shadow-indigo-600/20">
          MS
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to MarketSphere</h1>
        <p className="text-xs text-slate-500">Access your orders, saved wishlist, and seller dashboard</p>
      </div>

      {/* Demo Credentials Quick Switcher */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2.5">
        <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> One-Click Demo Credentials:
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setDemoCredentials("alex.customer@example.com", "CustomerPass123!")}
            className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-600 shadow-xs cursor-pointer"
          >
            <p className="text-[10px] text-slate-400 font-semibold">Customer</p>
            <p className="text-xs font-bold text-slate-900 truncate">Alex M.</p>
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials("seller@apextech.com", "SellerPass123!")}
            className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-600 shadow-xs cursor-pointer"
          >
            <p className="text-[10px] text-amber-500 font-semibold">Seller</p>
            <p className="text-xs font-bold text-slate-900 truncate">ApexTech</p>
          </button>
          <button
            type="button"
            onClick={() => setDemoCredentials("admin@marketsphere.com", "AdminPass123!")}
            className="p-2 rounded-xl bg-white border border-indigo-200 text-left hover:border-indigo-600 shadow-xs cursor-pointer"
          >
            <p className="text-[10px] text-rose-500 font-semibold">Admin</p>
            <p className="text-xs font-bold text-slate-900 truncate">Victoria</p>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-slate-700 block">Password</label>
            <span className="text-[11px] text-indigo-600 hover:underline cursor-pointer">Forgot password?</span>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs mt-2"
        >
          Sign In &rarr;
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
