import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SellerPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/seller");
  }

  if (session.role === "SELLER" || session.role === "ADMIN") {
    redirect("/seller/dashboard");
  }

  // Check if customer has a seller profile
  const seller = await db.seller.findUnique({
    where: { userId: session.userId },
  });

  if (seller) {
    redirect("/seller/dashboard");
  }

  // Otherwise prompt to register store
  redirect("/seller/register");
}
