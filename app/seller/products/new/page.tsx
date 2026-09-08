"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft, Image as ImageIcon, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loadingCats, setLoadingCats] = React.useState(true);

  // Form states
  const [title, setTitle] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [sku, setSku] = React.useState("");
  const [basePrice, setBasePrice] = React.useState("");
  const [salePrice, setSalePrice] = React.useState("");
  const [stockQuantity, setStockQuantity] = React.useState("50");
  const [headline, setHeadline] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState(
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  );
  const [tagsInput, setTagsInput] = React.useState("electronics, premium, audio");

  // AI Generator state
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  // Load categories
  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          if (data.categories?.length > 0) {
            setCategoryId(data.categories[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCats(false);
      }
    }
    load();
  }, []);

  // Trigger AI Product Copywriter
  const handleGenerateAi = async () => {
    if (!title.trim()) {
      setError("Please enter a product title first so AI can generate accurate description.");
      return;
    }

    setIsGeneratingAi(true);
    setError("");
    try {
      const selectedCat = categories.find((c) => c.id === categoryId)?.name || "General";
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category: selectedCat,
          keywords: tagsInput,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setHeadline(data.headline || "");
        setDescription(
          `${data.description}\n\nKey Highlights:\n${data.bulletPoints.map((b: string) => `• ${b}`).join("\n")}`
        );
        if (data.tags) {
          setTagsInput(data.tags.join(", "));
        }
        setAiGeneratedSuccess(true);
        setTimeout(() => setAiGeneratedSuccess(false), 4000);
      } else {
        setError("AI generation failed");
      }
    } catch (err) {
      setError("Network error connecting to AI copywriter");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          categoryId,
          sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
          basePrice: parseFloat(basePrice),
          salePrice: salePrice ? parseFloat(salePrice) : undefined,
          stockQuantity: parseInt(stockQuantity),
          headline,
          description,
          tags,
          images: [imageUrl],
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/seller/products");
      } else {
        setError(data.error || "Failed to create product");
      }
    } catch (err: any) {
      setError("Network error creating product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create New Product Listing</h2>
          <p className="text-xs text-slate-500 mt-0.5">List your product to millions of active buyers</p>
        </div>
        <Link
          href="/seller/products"
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-sm">
        {/* Title & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-800 block mb-1">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. ApexBook Studio 16 OLED Workstation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-600"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Base Price ($)</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="299.00"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Sale Price ($) [Optional]</label>
            <input
              type="number"
              step="0.01"
              placeholder="249.00"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Stock Quantity</label>
            <input
              type="number"
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">SKU Code</label>
            <input
              type="text"
              placeholder="AUTO-GENERATED"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Image URL */}
        <div className="text-xs">
          <label className="font-bold text-slate-800 block mb-1">Primary Image URL (Unsplash or direct URL)</label>
          <input
            type="url"
            required
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        {/* AI Copywriter Section */}
        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" /> AI Product Description Generator
              </h4>
              <p className="text-[11px] text-slate-500">
                Let AI automatically craft compelling headlines, SEO descriptions, and highlights
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleGenerateAi}
              isLoading={isGeneratingAi}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Generate Copy with AI
            </Button>
          </div>
          {aiGeneratedSuccess && (
            <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Generated copy populated below. Review and adjust anytime!
            </p>
          )}
        </div>

        {/* Headline & Description */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Marketing Headline</label>
            <input
              type="text"
              placeholder="e.g. The definitive workstation for creators and engineers"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Full Description & Key Features</label>
            <textarea
              required
              rows={5}
              placeholder="Write or review your product's detailed specifications and value proposition..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 font-sans"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Search Keywords / Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <Button
          type="submit"
          isLoading={submitting}
          className="w-full h-12 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs shadow-md mt-4"
        >
          Publish Product to Marketplace &rarr;
        </Button>
      </form>
    </div>
  );
}
