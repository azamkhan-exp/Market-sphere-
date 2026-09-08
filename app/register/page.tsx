"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (role === "SELLER") {
          router.push("/seller/dashboard");
        } else {
          router.push("/");
        }
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err: any) {
      setError("Network error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md shadow-indigo-600/20">
          MS
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
        <p className="text-xs text-slate-500">Join thousands of customers and verified sellers on MarketSphere</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleRegister} className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 shadow-sm">
        {/* Account Role Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === "CUSTOMER" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Buyer / Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("SELLER")}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === "SELLER" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Store / Vendor
          </button>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
          <div className="relative">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Eleanor Vance"
              className="w-full h-11 pl-10 pr-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>
        </div>

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
          <label className="text-xs font-bold text-slate-700 block mb-1">Password (min 8 characters)</label>
          <div className="relative">
            <input
              type="password"
              required
              minLength={8}
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
          Create Account &rarr;
        </Button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
