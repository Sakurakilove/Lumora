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
  X,
  Shield,
  Zap,
  Code2,
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
  const [showDeployModal, setShowDeployModal] = useState(false);

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
      <div className="min-h-screen bg-black text-white flex items-center justify-center" style={FONTS.system}>
        <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !skill) {
    return (
      <div className="min-h-screen bg-black text-white relative">
        <Navbar />
        <div className="text-center pt-40" style={FONTS.system}>
          <h1 className="text-3xl mb-4" style={FONTS.serif}>未找到该 Skill</h1>
          <Link href="/explore" className="text-white/70 hover:text-white inline-flex items-center gap-2">
            <ArrowLeft size={16} /> 返回探索页
          </Link>
        </div>
      </div>
    );
  }

  const categoryName =
    CATEGORIES.find((c) => c.id === skill.category)?.name || skill.category;

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
            <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.1] mb-4" style={FONTS.serif}>
              {skill.name}
            </h1>
            <p className="text-white/70 text-lg mb-6 leading-relaxed" style={FONTS.system}>
              {skill.tagline}
            </p>

            {/* 统计 */}
            <div
              className="flex items-center gap-6 mb-8 pb-8 border-b border-white/10"
              style={FONTS.system}
            >
              <div>
                <div className="text-2xl text-white" style={FONTS.serif}>{skill.viewCount}</div>
                <div className="text-xs text-white/50 inline-flex items-center gap-1 mt-1">
                  <Eye size={11} /> 浏览
                </div>
              </div>
              <div>
                <div className="text-2xl text-white" style={FONTS.serif}>{skill.deployCount}</div>
                <div className="text-xs text-white/50 inline-flex items-center gap-1 mt-1">
                  <Rocket size={11} /> 部署
                </div>
              </div>
              <div>
                <div className="text-2xl text-white" style={FONTS.serif}>{skill.author}</div>
                <div className="text-xs text-white/50 mt-1">作者</div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowDeployModal(true)}
                className="bg-white text-black text-base px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200 inline-flex items-center justify-center gap-2 font-medium"
                style={FONTS.system}
              >
                <Rocket size={18} />
                一键部署到 {skill.deployPlatform}
              </button>
              <div className="flex gap-3">
                <a
                  href={skill.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass rounded-full text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 flex-1"
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
                    className="liquid-glass rounded-full text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2 flex-1"
                    style={FONTS.system}
                  >
                    <ExternalLink size={16} />
                    在线演示
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 详细描述 */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-3xl mb-6 text-white" style={FONTS.serif}>关于这个 Skill</h2>
          <p
            className="text-white/80 text-base leading-relaxed whitespace-pre-line"
            style={FONTS.system}
          >
            {skill.description}
          </p>
        </div>

        {/* 部署特性 */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-3xl mb-6 text-white" style={FONTS.serif}>部署特性</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="liquid-glass rounded-2xl p-5">
              <Zap size={20} className="text-white mb-3" />
              <h3 className="text-white text-base mb-1" style={FONTS.system}>秒级启动</h3>
              <p className="text-white/60 text-sm leading-relaxed" style={FONTS.system}>
                通过 EdgeOne CDN 全球边缘节点分发，国内秒开
              </p>
            </div>
            <div className="liquid-glass rounded-2xl p-5">
              <Shield size={20} className="text-white mb-3" />
              <h3 className="text-white text-base mb-1" style={FONTS.system}>免费托管</h3>
              <p className="text-white/60 text-sm leading-relaxed" style={FONTS.system}>
                EdgeOne Pages 免费额度足够个人项目使用
              </p>
            </div>
            <div className="liquid-glass rounded-2xl p-5">
              <Code2 size={20} className="text-white mb-3" />
              <h3 className="text-white text-base mb-1" style={FONTS.system}>自动构建</h3>
              <p className="text-white/60 text-sm leading-relaxed" style={FONTS.system}>
                推送代码自动触发构建，无需手动操作
              </p>
            </div>
          </div>
        </div>
      </main>

      {showDeployModal && (
        <DeployModal
          skill={skill}
          onClose={() => setShowDeployModal(false)}
        />
      )}
    </div>
  );
}

function DeployModal({
  skill,
  onClose,
}: {
  skill: Skill;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(skill.githubUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleDeploy = async () => {
    // 记录部署次数
    fetch(`/api/skills/${skill.id}/deploy`, { method: "POST" }).catch(() => {});
    setDeployed(true);
    // 打开 EdgeOne Pages 部署页面
    window.open("https://pages.edgeone.ai/", "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="liquid-glass rounded-3xl max-w-lg w-full p-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "rgba(20,20,20,0.9)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
          aria-label="关闭"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
            <Rocket size={28} className="text-white" />
          </div>
          <h2 className="text-3xl text-white mb-2" style={FONTS.serif}>
            部署 {skill.name}
          </h2>
          <p className="text-white/60 text-sm" style={FONTS.system}>
            部署到 {skill.deployPlatform}，免费且只需几秒
          </p>
        </div>

        {/* 步骤 */}
        <div className="space-y-4 mb-6" style={FONTS.system}>
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="text-white text-sm mb-1">复制 GitHub 仓库地址</p>
              <div className="flex items-center gap-2 liquid-glass rounded-full px-3 py-2">
                <Code2 size={14} className="text-white/50 shrink-0" />
                <span className="text-white/80 text-xs flex-1 truncate">
                  {skill.githubUrl}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-white/70 hover:text-white"
                  aria-label="复制"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="text-white text-sm mb-1">点击下方按钮前往 EdgeOne Pages</p>
              <p className="text-white/50 text-xs leading-relaxed">
                登录腾讯云账号，选择「从 Git 仓库导入」，粘贴上面的仓库地址
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs text-white shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="text-white text-sm mb-1">配置构建参数并部署</p>
              <p className="text-white/50 text-xs leading-relaxed">
                构建命令：<code className="text-white/80">npm run build</code>，输出目录：<code className="text-white/80">.next</code>
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          className="w-full bg-white text-black text-base px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200 inline-flex items-center justify-center gap-2 font-medium"
          style={FONTS.system}
        >
          {deployed ? (
            <>
              <Check size={18} />
              已记录，前往 EdgeOne Pages
            </>
          ) : (
            <>
              <Rocket size={18} />
              立即前往 EdgeOne Pages
            </>
          )}
        </button>

        {deployed && (
          <p className="text-center text-white/50 text-xs mt-3" style={FONTS.system}>
            已在新标签页打开 EdgeOne Pages，按步骤完成部署
          </p>
        )}
      </div>
    </div>
  );
}
