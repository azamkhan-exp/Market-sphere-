import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { db } from "./db";

const JWT_SECRET = process.env.AUTH_SECRET || "marketsphere_super_secret_jwt_key_2026";
const COOKIE_NAME = "marketsphere_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
  sellerId?: string;
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function signJwt(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = signJwt(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getSessionFromRequest(req: NextRequest): Promise<SessionPayload | null> {
  const cookieToken = req.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const payload = verifyJwt(cookieToken);
    if (payload) return payload;
  }

  const authHeader = req.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const bearerToken = authHeader.substring(7);
    return verifyJwt(bearerToken);
  }

  return null;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  return db.user.findUnique({
    where: { id: session.userId },
    include: {
      sellerProfile: true,
      addresses: true,
    },
  });
}
