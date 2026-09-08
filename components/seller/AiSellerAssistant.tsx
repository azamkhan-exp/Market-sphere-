"use client";

import * as React from "react";
import { Sparkles, Send, Bot, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "Which products are low stock?",
  "What were my best-selling products?",
  "What should I restock first?",
  "How much revenue did I make?",
];

export function AiSellerAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your MarketSphere AI Vendor Assistant. Ask me anything about your catalog, low-stock inventory, customer ratings, or best-performing SKUs.",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/seller-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      } else {
        const err = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${err.error || "Failed to retrieve insights"}` },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error communicating with AI Assistant service." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-indigo-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              AI Vendor Intelligence
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                Grounded Live DB
              </span>
            </h3>
            <p className="text-xs text-indigo-200">Real-time inventory advice, top SKU tracking, and sales analytics</p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="h-64 overflow-y-auto space-y-3 pr-2 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed shadow-sm ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-none"
                  : "bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-bl-none"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 items-center text-indigo-300 text-xs py-2">
            <Bot className="w-4 h-4 animate-spin text-amber-400" />
            <span>Analyzing real inventory and sales records...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap gap-2 pt-1">
        {QUICK_QUESTIONS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            disabled={loading}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-950/80 border border-indigo-700/60 hover:border-amber-400 hover:text-amber-300 text-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            {chip} <ArrowRight className="w-3 h-3 opacity-60" />
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2 pt-2 border-t border-indigo-800/60"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your stock, revenue, or restock recommendations..."
          className="flex-1 h-10 px-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          size="sm"
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-4 gap-1.5 text-xs shadow-sm"
        >
          <Send className="w-3.5 h-3.5" /> Ask
        </Button>
      </form>
    </div>
  );
}
