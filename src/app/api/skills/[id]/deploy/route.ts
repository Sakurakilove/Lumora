import { NextRequest, NextResponse } from "next/server";
import { incrementDeploy, getSkillById } from "@/lib/skills";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const skill = await getSkillById(id);
  if (!skill) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }
  await incrementDeploy(id);
  return NextResponse.json({ ok: true, deployCount: skill.deployCount + 1 });
}
