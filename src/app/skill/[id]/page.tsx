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
  FileText,
  Tag,
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

type InstallTab = "cli" | "prompt";

export default function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [installTab, setInstallTab] = useState<InstallTab>("cli");
  const [copied, setCopied] = useState<InstallTab | null>(null);

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

  // OpenClaw 安装命令：@<author-lower>/<slug>
  const authorHandle = "@" + skill.author.toLowerCase().replace(/\s+/g, "");
  const installCommand = `openclaw skills install ${authorHandle}/${skill.slug}`;
  const promptText = `使用 ${skill.name} skill 来帮我完成任务。通过 openclaw 调用 ${authorHandle}/${skill.slug}。`;

  const handleCopy = async (tab: InstallTab, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(tab);
      // 记录一次安装计数
      fetch(`/api/skills/${skill.id}/deploy`, { method: "POST" }).catch(() => {});
      setTimeout(() => setCopied(null), 2000);
    } catch {}
  };

  // 格式化日期
  const createdDate = new Date(skill.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
        {/* 面包屑 */}
        <div className="flex items-center gap-2 text-xs text-white/40 mb-6" style={FONTS.system}>
          <Link href="/explore" className="hover:text-white/70 transition-colors">
            Skills
          </Link>
          <span>/</span>
          <span className="text-white/60">{authorHandle.slice(1)}</span>
          <span>/</span>
          <span className="text-white">{skill.slug}</span>
        </div>

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

            {/* 标签云 */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span
                className="liquid-glass rounded-full px-3 py-1 text-xs text-white/80 inline-flex items-center gap-1"
                style={FONTS.system}
              >
                <Tag size={11} />
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
                  #{tag}
                </span>
              ))}
            </div>

            {/* 元信息 */}
            <div
              className="mt-6 liquid-glass rounded-2xl p-5 space-y-3 text-sm"
              style={FONTS.system}
            >
              <div className="flex items-center justify-between">
                <span className="text-white/50 inline-flex items-center gap-2">
                  <FileText size={14} />
                  作者
                </span>
                <span className="text-white">{skill.author}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 inline-flex items-center gap-2">
                  <Tag size={14} />
                  使用场景
                </span>
                <span className="text-white">{skill.deployPlatform}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 inline-flex items-center gap-2">
                  <Sparkles size={14} />
                  发布时间
                </span>
                <span className="text-white">{createdDate}</span>
              </div>
            </div>
          </div>

          {/* 右侧：标题 + 描述 + Install 区 */}
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
            </div>

            {/* Install 区（仿 ClawHub） */}
            <div className="mb-6">
              <div
                className="text-xs text-white/50 mb-3 uppercase tracking-wider"
                style={FONTS.system}
              >
                Install
              </div>

              {/* Tab 切换 */}
              <div className="flex gap-1 mb-3">
                <button
                  onClick={() => setInstallTab("cli")}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                    installTab === "cli"
                      ? "bg-white text-black"
                      : "liquid-glass text-white/70 hover:text-white"
                  }`}
                  style={FONTS.system}
                >
                  <Terminal size={12} className="inline mr-1.5" />
                  CLI
                </button>
                <button
                  onClick={() => setInstallTab("prompt")}
                  className={`px-4 py-1.5 rounded-full text-xs transition-all ${
                    installTab === "prompt"
                      ? "bg-white text-black"
                      : "liquid-glass text-white/70 hover:text-white"
                  }`}
                  style={FONTS.system}
                >
                  <Terminal size={12} className="inline mr-1.5" />
                  Prompt
                </button>
              </div>

              {/* 命令复制框 */}
              <div
                className="liquid-glass rounded-2xl p-2 flex items-center gap-2"
                style={{ backgroundColor: "rgba(10,10,10,0.6)" }}
              >
                <div
                  className="flex items-center gap-2 flex-1 px-4 py-3 min-w-0"
                  style={FONTS.system}
                >
                  <span className="text-white/40 select-none shrink-0">$</span>
                  <code className="text-white text-sm font-mono break-all">
                    {installTab === "cli" ? installCommand : promptText}
                  </code>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      installTab,
                      installTab === "cli" ? installCommand : promptText
                    )
                  }
                  className="bg-white text-black text-sm px-4 py-2.5 rounded-xl hover:bg-white/90 transition-colors inline-flex items-center gap-2 shrink-0 m-1"
                  style={FONTS.system}
                  aria-label="复制"
                >
                  {copied === installTab ? (
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

              <p
                className="text-xs text-white/40 mt-2 leading-relaxed"
                style={FONTS.system}
              >
                {installTab === "cli"
                  ? "在终端执行此命令，skill 会自动安装到你的 OpenClaw 环境"
                  : "将此提示词粘贴到 OpenClaw 对话中，AI 会自动调用此 skill"}
              </p>
            </div>

            {/* 源码与演示按钮 */}
            <div className="flex gap-3">
              <a
                href={skill.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 liquid-glass rounded-full text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                style={FONTS.system}
              >
                <Github size={16} />
                源代码
              </a>
              {skill.demoUrl && (
                <a
                  href={skill.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 liquid-glass rounded-full text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
                  style={FONTS.system}
                >
                  <ExternalLink size={16} />
                  在线演示
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 详细描述（SKILL.md 风格） */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-3xl mb-6 text-white inline-flex items-center gap-3" style={FONTS.serif}>
            <FileText size={24} />
            SKILL.md
          </h2>
          <div
            className="liquid-glass rounded-2xl p-6 sm:p-8"
            style={FONTS.system}
          >
            <p className="text-white/80 text-base leading-relaxed whitespace-pre-line">
              {skill.description}
            </p>
          </div>
        </div>

        {/* 使用步骤 */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-3xl mb-6 text-white" style={FONTS.serif}>
            如何使用
          </h2>
          <div className="space-y-4" style={FONTS.system}>
            <div className="liquid-glass rounded-2xl p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-white text-base mb-1 inline-flex items-center gap-2">
                  <Terminal size={15} />
                  安装 skill
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  复制上方 CLI 命令，在终端中执行。skill 会自动下载并注册到 OpenClaw 环境。
                </p>
              </div>
            </div>
            <div className="liquid-glass rounded-2xl p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-white text-base mb-1 inline-flex items-center gap-2">
                  <Box size={15} />
                  在对话中调用
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  安装完成后，在 OpenClaw 对话中直接描述你的需求，AI 会自动识别并调用此 skill。
                </p>
              </div>
            </div>
            <div className="liquid-glass rounded-2xl p-5 flex gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-sm shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-white text-base mb-1 inline-flex items-center gap-2">
                  <Wrench size={15} />
                  按需定制
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  源码完全开放，可克隆仓库后基于自身需求二次开发，再推送到自己的命名空间发布。
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
