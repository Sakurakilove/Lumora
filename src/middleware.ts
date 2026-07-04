import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "lumora_admin_token";
const SESSION_SECRET =
  process.env.SESSION_SECRET || "lumora-skills-default-secret-change-in-prod";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 仅保护 /admin 路径（但放行 /admin/login）
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (pathname === "/admin/login") {
      return NextResponse.next();
    }
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    try {
      const encoder = new TextEncoder();
      await jwtVerify(token, encoder.encode(SESSION_SECRET));
      return NextResponse.next();
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
