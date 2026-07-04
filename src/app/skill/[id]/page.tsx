"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Rocket,
  Sparkles,
  Github,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Box,
  Wrench,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { FONTS } from "@/lib/styles";
import { CATEGORIES } from "@/lib/skills";

type Skill = {
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
  deployCount: number;
  viewCount: number;
  createdAt: string;
};

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/skills/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setSkill(data.skill);
        setLoading(false);
      })
      .catch(() => {
        setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-black text-white flex items-center justify-center"
        style={FONTS.system}
      >
        <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !skill) {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <Navbar />
        <div className="text-center pt-40" style={FONTS.system}>
          <h1 className="text-3xl mb-4" style={FONTS.serif}>
            未找到该 Skill
          </h1>
          <Link
            href="/explore"
            className="text-white/70 hover:text-white inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> 返回探索页
          </Link>
        </div>
      </div>
    );
  }

  const categoryName =
    CATEGORIES.find((c) => c.id === skill.category)?.name || skill.category;

  // OpenClaw 引用命令（基于 GitHub 仓库地址）
  const repoPath = skill.githubUrl
    .replace("https://github.com/", "")
    .replace(/\.git$/, "");
  const clawCommand = `claw install ${repoPath}`;

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* 顶部背景视频氛围 */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] overflow-hidden pointer-events-none">
        <video
          src="/videos/still-water.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 sm:px-10 max-w-5xl mx-auto">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
          style={FONTS.system}
        >
          <ArrowLeft size={16} />
          返回探索
        </Link>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* 左侧：缩略图 + 标签 */}
          <div>
            <div className="liquid-glass rounded-2xl overflow-hidden aspect-[4/3] relative">
              {skill.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={skill.thumbnail}
                  alt={skill.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white/30 text-6xl"
                  style={FONTS.serif}
                >
                  {skill.name.charAt(0)}
                </div>
              )}
              {skill.featured && (
                <div
                  className="absolute top-4 left-4 liquid-glass rounded-full px-3 py-1 text-xs text-white inline-flex items-center gap-1"
                  style={FONTS.system}
                >
                  <Sparkles size={11} />
                  精选
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <span
                className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80"
                style={FONTS.system}
              >
                {categoryName}
              </span>
              <span
                className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80"
                style={FONTS.system}
              >
                {skill.framework}
              </span>
              {skill.tags.map((tag) => (
                <span
                  key={tag}
                  className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80"
                  style={FONTS.system}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 右侧：标题 + 描述 + 操作按钮 */}
          <div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-4"
              style={FONTS.serif}
            >
              {skill.name}
            </h1>
            <p
              className="text-white/70 text-lg mb-6 leading-relaxed"
              style={FONTS.system}
            >
              {skill.tagline}
            </p>

            {/* 统计 */}
            <div
              className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10"
              style={FONTS.system}
            >
              <div>
                <div className="text-2xl text-white" style={FONTS.serif}>
                  {skill.viewCount}
                </div>
                <div className="text-xs text-white/50 inline-flex items-center gap-1 mt-1">
                  <Eye size={11} /> 浏览
                </div>
              </div>
              <div>
                <div className="text-2xl text-white" style={FONTS.serif}>
                  {skill.deployCount}
                </div>
                <div className="text-xs text-white/50 inline-flex items-center gap-1 mt-1">
                  <Rocket size={11} /> 安装
                </div>
              </div>
              <div>
                <div className="text-2xl text-white" style={FONTS.serif}>
                  {skill.author}
                </div>
                <div className="text-xs text-white/50 mt-1">作者</div>
              </div>
            </div>

            {/* 操作按钮：仅保留源码与演示 */}
            <div className="flex flex-col gap-3">
              <a
                href={skill.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black text-base px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200 inline-flex items-center justify-center gap-2 font-medium"
                style={FONTS.system}
              >
                <Github size={18} />
                查看源代码
              </a>
              {skill.demoUrl && (
                <a
                  href={skill.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass rounded-full text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                  style={FONTS.system}
                >
                  <ExternalLink size={16} />
                  在线演示
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 详细描述 */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-3xl mb-6 text-white" style={FONTS.serif}>
            关于这个 Skill
          </h2>
          <p
            className="text-white/80 text-base leading-relaxed whitespace-pre-line"
            style={FONTS.system}
          >
            {skill.description}
          </p>
        </div>

        {/* 在 OpenClaw 中使用 */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-3xl mb-6 text-white" style={FONTS.serif}>
            在 OpenClaw 中使用
          </h2>
          <p
            className="text-white/70 text-sm leading-relaxed mb-6"
            style={FONTS.system}
          >
            复制下方命令，在 OpenClaw 终端中执行即可安装此 Skill 到你的环境。
          </p>

          {/* 命令复制框 */}
          <ClawCommandBox command={clawCommand} skillId={skill.id} />

          {/* 使用步骤 */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="liquid-glass rounded-2xl p-5">
              <Terminal size={20} className="text-white mb-3" />
              <h3 className="text-white text-base mb-1" style={FONTS.system}>
                一键安装
              </h3>
              <p
                className="text-white/60 text-sm leading-relaxed"
                style={FONTS.system}
              >
                通过 claw 命令直接从 GitHub 仓库拉取，无需手动下载
              </p>
            </div>
            <div className="liquid-glass rounded-2xl p-5">
              <Box size={20} className="text-white mb-3" />
              <h3 className="text-white text-base mb-1" style={FONTS.system}>
                即插即用
              </h3>
              <p
                className="text-white/60 text-sm leading-relaxed"
                style={FONTS.system}
              >
                安装后自动注册到 OpenClaw Skills 列表，立即可在对话中调用
              </p>
            </div>
            <div className="liquid-glass rounded-2xl p-5">
              <Wrench size={20} className="text-white mb-3" />
              <h3 className="text-white text-base mb-1" style={FONTS.system}>
                可定制
              </h3>
              <p
                className="text-white/60 text-sm leading-relaxed"
                style={FONTS.system}
              >
                源码完全开放，可基于自身需求二次开发与扩展
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ClawCommandBox({
  command,
  skillId,
}: {
  command: string;
  skillId: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      // 记录一次"安装"计数
      fetch(`/api/skills/${skillId}/deploy`, { method: "POST" }).catch(() => {});
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      className="liquid-glass rounded-2xl p-2 flex items-center gap-2"
      style={{ backgroundColor: "rgba(10,10,10,0.6)" }}
    >
      <div
        className="flex items-center gap-2 flex-1 px-4 py-3"
        style={FONTS.system}
      >
        <span className="text-white/40 select-none">$</span>
        <code className="text-white text-sm font-mono break-all">{command}</code>
      </div>
      <button
        onClick={handleCopy}
        className="bg-white text-black text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors inline-flex items-center gap-2 shrink-0 m-1"
        style={FONTS.system}
        aria-label="复制命令"
      >
        {copied ? (
          <>
            <Check size={14} />
            已复制
          </>
        ) : (
          <>
            <Copy size={14} />
            复制
          </>
        )}
      </button>
    </div>
  );
}
