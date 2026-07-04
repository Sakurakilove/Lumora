import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { hashPassword, verifyPassword } from "./password";

export { hashPassword, verifyPassword };

const COOKIE_NAME = "lumora_admin_token";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "lumora-skills-default-secret-change-in-prod";

const encoder = new TextEncoder();

export async function signToken(payload: {
  username: string;
  id: string;
}): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(encoder.encode(SESSION_SECRET));
}

export async function verifyToken(token: string): Promise<{
  username: string;
  id: string;
} | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(SESSION_SECRET));
    return {
      username: payload.username as string,
      id: payload.id as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{
  username: string;
  id: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
