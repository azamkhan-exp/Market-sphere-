"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, X, Send, Bot, User, ShoppingCart, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ProductImage } from "@/components/ui/ProductImage";

interface Message {
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: any[];
}

export function AiShoppingAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your MarketSphere AI Shopping Assistant. Ask me anything, such as 'Find me a great laptop for programming under $1,500' or 'Best noise-cancelling headphones for travel'.",
    },
  ]);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            recommendedProducts: data.recommendedProducts,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I had trouble checking our product catalog. Please try again.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error occurred while fetching recommendations.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = async (productId: string) => {
    try {
      const res = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("cart-updated"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 p-3 sm:p-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-500 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
        aria-label="Open AI Shopping Assistant"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
        <span className="text-xs font-bold pr-1 hidden sm:inline-block">AI Shopping Assistant</span>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 md:bottom-24 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-[420px] max-w-[calc(100vw-1rem)] h-[580px] max-h-[80vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-amber-400 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-none">MarketSphere AI Assistant</h3>
                <p className="text-[10px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" /> Grounded in Live Catalog
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Grounded Recommended Product Cards */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <p className="font-bold text-[11px] text-indigo-700">Verified Matching Products:</p>
                      {msg.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white transition-colors"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-100">
                            <ProductImage src={prod.image} alt={prod.title} fill />
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${prod.slug}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 truncate block text-[11px]"
                            >
                              {prod.title}
                            </Link>
                            <div className="flex items-center justify-between mt-1">
                              <span className="font-extrabold text-slate-900 text-xs">
                                {formatPrice(prod.price)}
                              </span>
                              <button
                                onClick={() => handleQuickAdd(prod.id)}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <ShoppingCart className="w-3 h-3" /> Add
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-slate-400 text-xs pl-8">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px]">Searching product catalog...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend("Best laptop for programming under $1500")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 shrink-0 font-medium"
            >
              💻 Coding Laptop under $1500
            </button>
            <button
              onClick={() => handleSend("Top noise cancelling headphones")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 shrink-0 font-medium"
            >
              🎧 ANC Headphones
            </button>
            <button
              onClick={() => handleSend("Espresso machine with microfoam")}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 shrink-0 font-medium"
            >
              ☕ Espresso Machine
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask anything about products, specs, budget..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 h-9 px-3 rounded-full border border-slate-300 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
