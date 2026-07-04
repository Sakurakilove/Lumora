import { NextRequest, NextResponse } from "next/server";
import { listSkills, createSkill } from "@/lib/skills";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const featured = url.searchParams.get("featured") === "true";
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : undefined;

  const skills = await listSkills({ category, search, featured, limit });
  return NextResponse.json({ skills });
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!body.name || !body.slug || !body.githubUrl) {
      return NextResponse.json(
        { error: "name, slug, githubUrl 必填" },
        { status: 400 }
      );
    }
    const skill = await createSkill({
      name: body.name,
      slug: body.slug,
      tagline: body.tagline || "",
      description: body.description || "",
      category: body.category || "frontend",
      tags: body.tags || [],
      author: body.author || "",
      githubUrl: body.githubUrl,
      demoUrl: body.demoUrl || "",
      thumbnail: body.thumbnail || "",
      framework: body.framework || "Next.js",
      deployPlatform: body.deployPlatform || "EdgeOne Pages",
      featured: !!body.featured,
      published: body.published !== false,
    });
    return NextResponse.json({ skill });
  } catch (e: any) {
    return NextResponse.json(
      { error: "创建失败：" + e.message },
      { status: 500 }
    );
  }
}
