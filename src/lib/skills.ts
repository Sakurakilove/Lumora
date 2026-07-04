import { db } from "./db";
import { ensureDbInitialized } from "./db-init";

export type Skill = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  githubUrl: string;
  demoUrl: string;
  thumbnail: string;
  framework: string;
  deployPlatform: string;
  featured: boolean;
  published: boolean;
  deployCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export const CATEGORIES = [
  { id: "frontend", name: "前端", desc: "纯前端展示与交互" },
  { id: "fullstack", name: "全栈", desc: "前后端一体化应用" },
  { id: "ai", name: "AI 应用", desc: "集成大模型与 Agent" },
  { id: "tool", name: "工具", desc: "提升开发与生产力" },
  { id: "design", name: "设计", desc: "视觉与交互灵感" },
] as const;

export const DEPLOY_PLATFORMS = ["EdgeOne Pages", "Vercel", "Netlify", "Cloudflare Pages"];

function serialize(s: any): Skill {
  return {
    ...s,
    tags: s.tags ? s.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
  };
}

export async function listSkills(opts?: {
  category?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Skill[]> {
  await ensureDbInitialized();
  const where: any = { published: true };
  if (opts?.category && opts.category !== "all") {
    where.category = opts.category;
  }
  if (opts?.featured) {
    where.featured = true;
  }
  if (opts?.search) {
    where.OR = [
      { name: { contains: opts.search } },
      { tagline: { contains: opts.search } },
      { description: { contains: opts.search } },
      { tags: { contains: opts.search } },
    ];
  }
  const skills = await db.skill.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: opts?.limit,
  });
  return skills.map(serialize);
}

export async function listAllSkillsForAdmin(): Promise<Skill[]> {
  await ensureDbInitialized();
  const skills = await db.skill.findMany({
    orderBy: [{ createdAt: "desc" }],
  });
  return skills.map(serialize);
}

export async function getSkillBySlug(slug: string): Promise<Skill | null> {
  await ensureDbInitialized();
  const s = await db.skill.findUnique({ where: { slug } });
  if (!s) return null;
  return serialize(s);
}

export async function getSkillById(id: string): Promise<Skill | null> {
  await ensureDbInitialized();
  const s = await db.skill.findUnique({ where: { id } });
  if (!s) return null;
  return serialize(s);
}

export async function incrementView(id: string) {
  await ensureDbInitialized();
  await db.skill.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}

export async function incrementDeploy(id: string) {
  await ensureDbInitialized();
  await db.skill.update({
    where: { id },
    data: { deployCount: { increment: 1 } },
  });
}

export async function createSkill(data: Omit<Skill, "id" | "createdAt" | "updatedAt" | "viewCount" | "deployCount">) {
  await ensureDbInitialized();
  const created = await db.skill.create({
    data: {
      name: data.name,
      slug: data.slug,
      tagline: data.tagline,
      description: data.description,
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags,
      author: data.author,
      githubUrl: data.githubUrl,
      demoUrl: data.demoUrl,
      thumbnail: data.thumbnail,
      framework: data.framework,
      deployPlatform: data.deployPlatform || "EdgeOne Pages",
      featured: data.featured,
      published: data.published,
    },
  });
  return serialize(created);
}

export async function updateSkill(id: string, data: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>) {
  await ensureDbInitialized();
  const updateData: any = { ...data };
  if (Array.isArray(data.tags)) {
    updateData.tags = data.tags.join(",");
  }
  const updated = await db.skill.update({
    where: { id },
    data: updateData,
  });
  return serialize(updated);
}

export async function deleteSkill(id: string) {
  await ensureDbInitialized();
  await db.skill.delete({ where: { id } });
}

export async function getStats() {
  await ensureDbInitialized();
  const [total, published, featured, totalViews, totalDeploys] = await Promise.all([
    db.skill.count(),
    db.skill.count({ where: { published: true } }),
    db.skill.count({ where: { featured: true } }),
    db.skill.aggregate({ _sum: { viewCount: true } }),
    db.skill.aggregate({ _sum: { deployCount: true } }),
  ]);
  return {
    total,
    published,
    draft: total - published,
    featured,
    totalViews: totalViews._sum.viewCount || 0,
    totalDeploys: totalDeploys._sum.deployCount || 0,
  };
}
