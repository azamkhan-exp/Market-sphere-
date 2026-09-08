import { NextRequest, NextResponse } from "next/server";
import { CartService } from "@/services/cartService";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const quantity = parseInt(body.quantity);

    if (isNaN(quantity)) {
      return NextResponse.json({ error: "Valid quantity is required" }, { status: 400 });
    }

    const updatedCart = await CartService.updateQuantity(id, quantity);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update item" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const updatedCart = await CartService.removeItem(id);
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to remove item" }, { status: 400 });
  }
}
