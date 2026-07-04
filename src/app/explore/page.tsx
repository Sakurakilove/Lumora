"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Sparkles, Eye, Rocket, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FONTS } from "@/lib/styles";
import { CATEGORIES } from "@/lib/skills";

type Skill = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  tags: string[];
  author: string;
  thumbnail: string;
  framework: string;
  deployPlatform: string;
  featured: boolean;
  deployCount: number;
  viewCount: number;
};

export default function ExplorePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (search) params.set("search", search);
    const res = await fetch(`/api/skills?${params}`);
    const data = await res.json();
    setSkills(data.skills || []);
    setLoading(false);
  }, [category, search]);

  useEffect(() => {
    const t = setTimeout(fetchSkills, 250);
    return () => clearTimeout(t);
  }, [fetchSkills]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="relative h-[60vh] overflow-hidden pointer-events-none absolute top-0 left-0 right-0 z-0">
        <video
          src="/videos/golden-hour.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 sm:px-10 max-w-7xl mx-auto flex-1">
        <div className="text-center mb-16">
          <div
            className="liquid-glass rounded-full px-5 py-2 mb-6 inline-block"
            style={FONTS.system}
          >
            <span className="text-sm text-white/90 inline-flex items-center gap-2">
              <Sparkles size={14} />
              已收录 {skills.length} 个可一键部署的 Skills
            </span>
          </div>
          <h1
            className="text-5xl sm:text-6xl md:text-7xl leading-[1.1] mb-4"
            style={FONTS.serif}
          >
            探索 Skills 宇宙
          </h1>
          <p
            className="max-w-xl mx-auto text-white/70 text-base sm:text-lg leading-relaxed"
            style={FONTS.system}
          >
            每一个 Skill 都可通过一行命令安装到你的本地环境。
            <br className="hidden sm:block" />
            浏览、搜索、复制命令，几秒内开始使用。
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="liquid-glass rounded-full flex items-center gap-2 px-5 py-3">
            <Search size={18} className="text-white/60 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索 Skill 名称、标签、作者..."
              className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40 text-sm"
              style={FONTS.system}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <button
            onClick={() => setCategory("all")}
            className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
              category === "all"
                ? "bg-white text-black"
                : "liquid-glass text-white/80 hover:text-white"
            }`}
            style={FONTS.system}
          >
            全部
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                category === c.id
                  ? "bg-white text-black"
                  : "liquid-glass text-white/80 hover:text-white"
              }`}
              style={FONTS.system}
            >
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50" style={FONTS.system}>
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p>加载中...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-20 text-white/50" style={FONTS.system}>
            <p className="text-lg mb-2">未找到匹配的 Skill</p>
            <p className="text-sm">试试其他关键词或分类</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors duration-200"
            style={FONTS.system}
          >
            <ArrowLeft size={16} />
            返回首页
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const categoryName =
    CATEGORIES.find((c) => c.id === skill.category)?.name || skill.category;

  return (
    <Link
      href={`/skill/${skill.id}`}
      className="liquid-glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group block"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-white/5">
        {skill.thumbnail ? (
           
          <img
            src={skill.thumbnail}
            alt={skill.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white/30 text-4xl"
            style={FONTS.serif}
          >
            {skill.name.charAt(0)}
          </div>
        )}
        {skill.featured && (
          <div
            className="absolute top-3 left-3 liquid-glass rounded-full px-3 py-1 text-xs text-white inline-flex items-center gap-1"
            style={FONTS.system}
          >
            <Sparkles size={11} />
            精选
          </div>
        )}
        <div
          className="absolute top-3 right-3 liquid-glass rounded-full px-3 py-1 text-xs text-white/90"
          style={FONTS.system}
        >
          {categoryName}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-2xl mb-2 text-white" style={FONTS.serif}>
          {skill.name}
        </h3>
        <p
          className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed"
          style={FONTS.system}
        >
          {skill.tagline}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {skill.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70"
              style={FONTS.system}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-between text-xs text-white/50 pt-4 border-t border-white/10"
          style={FONTS.system}
        >
          <span className="inline-flex items-center gap-1">
            <Eye size={12} />
            {skill.viewCount} 浏览
          </span>
          <span className="inline-flex items-center gap-1">
            <Rocket size={12} />
            {skill.deployCount} 部署
          </span>
          <span>{skill.framework}</span>
        </div>
      </div>
    </Link>
  );
}
