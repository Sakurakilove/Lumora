import { NextResponse } from "next/server";
import { getStats } from "@/lib/skills";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const stats = await getStats();
  return NextResponse.json({ stats });
}
