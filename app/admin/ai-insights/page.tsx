"use client";

import * as React from "react";
import { Sparkles, Send, Bot, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export default function AdminAiInsightsPage() {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState<any>(null);

  const handleQuery = async (queryText?: string) => {
    const text = queryText || prompt;
    if (!text.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/ai/admin-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      if (res.ok) {
        const json = await res.json();
        setResponse(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    handleQuery("Executive Overview: Analyze marketplace transaction health, active vendor base, and replenishment risks.");
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" /> AI Executive Business Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Query deep analytics grounded directly in database orders, vendor performance, and catalog metrics
          </p>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => handleQuery("What is our current Gross Merchandise Value and take-rate?")}
          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-slate-700 transition-colors cursor-pointer"
        >
          💰 GMV & Take-Rate Analysis
        </button>
        <button
          onClick={() => handleQuery("Which products are operating near safety thresholds?")}
          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-slate-700 transition-colors cursor-pointer"
        >
          ⚠ Inventory Stockout Risks
        </button>
        <button
          onClick={() => handleQuery("What is our vendor onboarding pipeline health?")}
          className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-slate-700 transition-colors cursor-pointer"
        >
          🏪 Vendor Pipeline Status
        </button>
      </div>

      {/* Input Prompt Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask an executive question, e.g. 'How can we increase electronics category GMV?'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 h-11 px-4 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600"
        />
        <Button
          type="submit"
          isLoading={loading}
          className="h-11 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-2"
        >
          <Send className="w-3.5 h-3.5" /> Analyze
        </Button>
      </form>

      {/* Results Display */}
      {response && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-xl border border-slate-800">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-400 flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">MarketSphere Intelligence Output</h3>
              <p className="text-[11px] text-slate-400">Grounded in verified live platform records</p>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          {response.metrics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-semibold">Total GMV</span>
                <span className="text-base font-black text-indigo-400">
                  {formatPrice(response.metrics.gmv)}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-semibold">Total Orders</span>
                <span className="text-base font-black text-white">{response.metrics.totalOrders}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-semibold">Approved Sellers</span>
                <span className="text-base font-black text-amber-400">{response.metrics.totalSellers}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-semibold">Low Stock Warnings</span>
                <span className="text-base font-black text-red-400">{response.metrics.lowStockCount}</span>
              </div>
            </div>
          )}

          <div className="space-y-3 text-xs leading-relaxed text-slate-200 whitespace-pre-line bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 font-sans">
            {response.analysis}
          </div>
        </div>
      )}
    </div>
  );
}
