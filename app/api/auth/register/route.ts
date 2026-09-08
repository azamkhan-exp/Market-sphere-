import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { RegisterSchema } from "@/validators";
import { slugify } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = RegisterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password, role } = result.data;

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role,
        isEmailVerified: true, // auto-verify in local dev
      },
    });

    let sellerId: string | undefined;

    // If registered as SELLER, create pending seller profile
    if (role === "SELLER") {
      const storeName = `${name}'s Store`;
      const baseSlug = slugify(storeName);
      const uniqueSlug = `${baseSlug}-${Math.floor(100 + Math.random() * 900)}`;

      const seller = await db.seller.create({
        data: {
          userId: user.id,
          storeName,
          slug: uniqueSlug,
          description: `Welcome to ${storeName} on MarketSphere!`,
          status: "PENDING",
        },
      });
      sellerId = seller.id;
    }

    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "CUSTOMER" | "SELLER" | "ADMIN",
      sellerId,
    };

    await setSessionCookie(sessionPayload);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        sellerId,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
