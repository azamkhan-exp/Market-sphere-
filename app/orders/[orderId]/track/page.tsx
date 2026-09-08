import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { OrderTrackerClient } from "./OrderTrackerClient";

export const dynamic = "force-dynamic";

export default async function OrderTrackPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await db.order.findFirst({
    where: {
      OR: [{ id: orderId }, { orderNumber: orderId }],
    },
    include: {
      items: {
        include: {
          product: { include: { images: { take: 1 } } },
          seller: true,
        },
      },
      shipments: true,
    },
  });

  if (!order) notFound();

  return <OrderTrackerClient order={order as any} />;
}
