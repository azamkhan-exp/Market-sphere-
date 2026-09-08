import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "SELLER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized vendor access" }, { status: 401 });
    }

    const { question } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question string is required" }, { status: 400 });
    }

    // Resolve seller ID strictly tied to this authenticated session
    let sellerId = session.sellerId;
    if (!sellerId) {
      const seller = await db.seller.findUnique({ where: { userId: session.userId } });
      sellerId = seller?.id || (session.role === "ADMIN" ? (await db.seller.findFirst())?.id : undefined);
    }

    if (!sellerId) {
      return NextResponse.json({ error: "No associated seller profile found" }, { status: 404 });
    }

    // Fetch seller-authorized data
    const [seller, products, orderItems, reviews] = await Promise.all([
      db.seller.findUnique({ where: { id: sellerId } }),
      db.product.findMany({
        where: { sellerId },
        include: { category: true },
        orderBy: { totalSales: "desc" },
      }),
      db.orderItem.findMany({
        where: { sellerId },
        include: { order: true },
      }),
      db.review.findMany({
        where: { product: { sellerId } },
        include: { product: { select: { title: true } } },
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
    ]);

    const totalRevenue = orderItems.reduce((acc, i) => acc + i.subtotal, 0);
    const lowStockItems = products.filter((p) => p.stockQuantity <= p.lowStockThreshold);
    const topPerformers = products.slice(0, 5);
    const poorRated = products.filter((p) => p.avgRating < 4.2 && p.reviewCount > 0);

    const contextSummary = {
      storeName: seller?.storeName,
      totalCatalogProducts: products.length,
      totalRevenue: totalRevenue.toFixed(2),
      totalOrders: new Set(orderItems.map((i) => i.orderId)).size,
      lowStockProducts: lowStockItems.map((p) => ({
        title: p.title,
        sku: p.sku,
        stock: p.stockQuantity,
        threshold: p.lowStockThreshold,
      })),
      topSellers: topPerformers.map((p) => ({
        title: p.title,
        unitsSold: p.totalSales,
        stockRemaining: p.stockQuantity,
      })),
      lowRatedProducts: poorRated.map((p) => ({
        title: p.title,
        rating: p.avgRating,
        reviewCount: p.reviewCount,
      })),
    };

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt = `You are the MarketSphere AI Seller Business Assistant for store "${seller?.storeName}".
Answer the vendor's question concisely using ONLY the provided verified store data. Do not hallucinate numbers or mention other stores.
Store Data Context:
${JSON.stringify(contextSummary, null, 2)}`;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemPrompt }],
              },
              contents: [
                {
                  parts: [{ text: question }],
                },
              ],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ success: true, answer: text });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to grounded local response engine:", err);
      }
    }

    // Local Grounded Fallback Engine
    const qLower = question.toLowerCase();
    let answer = "";

    if (qLower.includes("low stock") || qLower.includes("restock") || qLower.includes("inventory")) {
      if (lowStockItems.length === 0) {
        answer = `All catalog inventory is currently healthy. None of your ${products.length} active products are currently below their low-stock thresholds.`;
      } else {
        answer = `You currently have ${lowStockItems.length} product(s) in low-stock status:\n` +
          lowStockItems.map((p) => `• **${p.title}** (${p.sku}) — **${p.stockQuantity} units left** (Alert threshold: ${p.lowStockThreshold})`).join("\n") +
          `\n\n**Action Recommendation:** Prioritize restocking these SKUs to prevent lost sales and maintain your search ranking.`;
      }
    } else if (qLower.includes("best") || qLower.includes("top") || qLower.includes("selling")) {
      answer = `Here are your top-selling products by volume:\n` +
        topPerformers.map((p, idx) => `${idx + 1}. **${p.title}** — ${p.totalSales} units sold ($${(p.totalSales * (p.salePrice ?? p.basePrice)).toFixed(2)} generated)`).join("\n") +
        `\n\nThese products account for the majority of your $${totalRevenue.toFixed(2)} total store revenue.`;
    } else if (qLower.includes("rating") || qLower.includes("poor") || qLower.includes("negative") || qLower.includes("review")) {
      if (poorRated.length === 0) {
        answer = `Great news! None of your products have poor ratings. Your store maintains an average rating of ${seller?.rating || 4.9}★ across ${seller?.reviewCount || 0} customer reviews.`;
      } else {
        answer = `Here are products that have lower customer satisfaction:\n` +
          poorRated.map((p) => `• **${p.title}** — ${p.avgRating}★ (${p.reviewCount} reviews)`).join("\n") +
          `\n\nInspect customer feedback in your reviews table to address build quality or packaging issues.`;
      }
    } else if (qLower.includes("revenue") || qLower.includes("sales") || qLower.includes("orders")) {
      answer = `**Store Performance Summary for ${seller?.storeName}:**\n` +
        `• **Gross Store Revenue:** $${totalRevenue.toFixed(2)}\n` +
        `• **Total Orders Fulfilled:** ${new Set(orderItems.map((i) => i.orderId)).size}\n` +
        `• **Active Catalog SKUs:** ${products.length}\n` +
        `• **Platform Commission Rate:** ${seller?.commissionRate || 10}%`;
    } else {
      answer = `Based on your live store data for **${seller?.storeName}**, you have **${products.length} products**, **$${totalRevenue.toFixed(2)} total sales**, and **${lowStockItems.length} items needing restock**.\n\nYou can ask about low-stock alerts, top-selling SKUs, customer ratings, or restocking recommendations.`;
    }

    return NextResponse.json({ success: true, answer });
  } catch (error: any) {
    console.error("AI Seller Assistant error:", error);
    return NextResponse.json({ error: error.message || "Failed to process question" }, { status: 500 });
  }
}
