import { NextRequest, NextResponse } from "next/server";
import {
  getSkillById,
  updateSkill,
  deleteSkill,
  incrementView,
} from "@/lib/skills";
import { getAdminSession } from "@/lib/auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await getSkillById(id);
  if (!skill) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  // 仅已发布或管理员可访问
  const session = await getAdminSession();
  if (!skill.published && !session) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  // 异步记录浏览
  incrementView(id).catch(() => {});
  return NextResponse.json({ skill });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await updateSkill(id, body);
    return NextResponse.json({ skill: updated });
  } catch (e: any) {
    return NextResponse.json(
      { error: "更新失败：" + e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteSkill(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: "删除失败：" + e.message },
      { status: 500 }
    );
  }
}
