import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?redirect=/admin");
  }

  if (session.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  redirect("/admin/unauthorized");
}
