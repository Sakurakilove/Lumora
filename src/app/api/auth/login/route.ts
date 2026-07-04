import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureDbInitialized } from "@/lib/db-init";
import {
  signToken,
  setAdminCookie,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码必填" },
        { status: 400 }
      );
    }

    await ensureDbInitialized();
    const user = await db.adminUser.findUnique({ where: { username } });
    if (!user) {
      return NextResponse.json(
        { error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "用户名或密码错误" },
        { status: 401 }
      );
    }

    const token = await signToken({ username: user.username, id: user.id });
    await setAdminCookie(token);

    return NextResponse.json({
      ok: true,
      user: { username: user.username, id: user.id },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "登录失败：" + e.message },
      { status: 500 }
    );
  }
}
