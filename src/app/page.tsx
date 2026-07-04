"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Menu, X, Sparkles, Search, Rocket, Box, Shield, Zap, ArrowRight, Code2, Github, Terminal } from "lucide-react";
import Link from "next/link";
import { FONTS } from "@/lib/styles";
import { CATEGORIES } from "@/lib/skills";
import Footer from "@/components/Footer";

const VIDEOS = [
  { url: "/videos/golden-hour.mp4", label: "金色时刻" },
  { url: "/videos/still-water.mp4", label: "静水" },
  { url: "/videos/deep-woods.mp4", label: "深林" },
  { url: "/videos/quiet-dawn.mp4", label: "静谧黎明" },
];

const NAV_LINKS = [
  { href: "/explore", label: "探索 Skills" },
  { href: "/#features", label: "特性" },
  { href: "/#how", label: "如何使用" },
  { href: "/#community", label: "社区" },
];

const STATS = [
  { value: "9+", label: "已收录 Skills" },
  { value: "5", label: "分类领域" },
  { value: "100%", label: "开源免费" },
  { value: "1 步", label: "命令安装" },
];

const FEATURES = [
  {
    icon: <Search size={22} />,
    title: "智能搜索",
    desc: "按名称、标签、作者、分类快速定位你需要的 Skill，秒级响应。",
  },
  {
    icon: <Rocket size={22} />,
    title: "一键安装",
    desc: "复制 git clone 命令到终端，几秒钟内把 Skill 装进你的 OpenClaw 环境。",
  },
  {
    icon: <Box size={22} />,
    title: "即插即用",
    desc: "所有 Skills 遵循统一规范，安装后自动注册到对话，立即可调用。",
  },
  {
    icon: <Shield size={22} />,
    title: "源码开放",
    desc: "每个 Skill 都有完整 GitHub 仓库，可审查、可定制、可二次开发。",
  },
  {
    icon: <Zap size={22} />,
    title: "本地运行",
    desc: "Skills 在你本机执行，数据不离开你的设备，隐私安全有保障。",
  },
  {
    icon: <Code2 size={22} />,
    title: "TypeScript 优先",
    desc: "所有 Skills 均为纯 TypeScript ESM，运行在 Node 18+，零配置即可启动。",
  },
];

const HOW_STEPS = [
  {
    num: "1",
    title: "浏览发现",
    desc: "在「探索 Skills」页面浏览全部 Skills，按分类或关键词筛选你想要的。",
  },
  {
    num: "2",
    title: "查看详情",
    desc: "点击 Skill 卡片进入详情页，阅读 SKILL.md 文档、查看仓库与演示。",
  },
  {
    num: "3",
    title: "复制命令",
    desc: "在 Install 区点击复制按钮，把 git clone + npm install 命令复制到剪贴板。",
  },
  {
    num: "4",
    title: "终端执行",
    desc: "在你的项目根目录粘贴执行，Skill 会自动安装到 skills/ 目录并注册。",
  },
];

type Skill = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: string;
  tags: string[];
  thumbnail: string;
  framework: string;
  featured: boolean;
  viewCount: number;
  deployCount: number;
};

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const isDarkMode = activeVideo === 2;

  // 加载精选 skills
  useEffect(() => {
    fetch("/api/skills?featured=true&limit=3")
      .then((r) => r.json())
      .then((data) => setFeaturedSkills(data.skills || []))
      .catch(() => {});
  }, []);

  const handleVideoSwitch = useCallback(
    (index: number) => {
      if (index === activeVideo || isTransitioning) return;
      const targetVideo = videoRefs.current[index];
      if (targetVideo && targetVideo.readyState >= 3) {
        setActiveVideo(index);
        setIsTransitioning(true);
        if (cooldownRef.current) clearTimeout(cooldownRef.current);
        cooldownRef.current = setTimeout(() => setIsTransitioning(false), 1000);
        return;
      }
      if (targetVideo) {
        targetVideo.load();
        const onReady = () => {
          targetVideo.removeEventListener("canplay", onReady);
          setActiveVideo(index);
          setIsTransitioning(true);
          if (cooldownRef.current) clearTimeout(cooldownRef.current);
          cooldownRef.current = setTimeout(() => setIsTransitioning(false), 1000);
        };
        targetVideo.addEventListener("canplay", onReady);
        setTimeout(() => {
          targetVideo.removeEventListener("canplay", onReady);
          if (targetVideo.readyState < 3) {
            setActiveVideo(index);
            setIsTransitioning(true);
            if (cooldownRef.current) clearTimeout(cooldownRef.current);
            cooldownRef.current = setTimeout(() => setIsTransitioning(false), 1000);
          }
        }, 8000);
      }
    },
    [activeVideo, isTransitioning]
  );

  const heroTextColor = isDarkMode ? "#182C41" : "#ffffff";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ============ Hero Section ============ */}
      <section className="relative w-full h-screen overflow-hidden bg-black">
        {/* 背景视频层 */}
        <div className="absolute inset-0 z-0">
          {VIDEOS.map((video, index) => (
            <video
              key={index}
              ref={(el) => { videoRefs.current[index] = el; }}
              src={video.url}
              autoPlay
              muted
              loop
              playsInline
              preload={index === 0 ? "auto" : "metadata"}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                activeVideo === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* PNG 叠加层 */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage:
              "url(https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            animation: "train-bob 3s ease-in-out infinite",
          }}
        />

        {/* 内容层 */}
        <div className="relative z-[2] flex flex-col h-full">
          {/* 导航 */}
          <nav className="flex items-center justify-between px-6 sm:px-10 py-6">
            <div className="text-white text-xl sm:text-2xl italic" style={FONTS.serif}>
              Lumora <span className="text-white/60 text-base not-italic" style={FONTS.system}>Skills</span>
            </div>
            <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full pl-2 pr-2 py-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/90 hover:text-white text-sm px-4 py-1.5 transition-colors duration-200"
                  style={FONTS.system}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden liquid-glass rounded-full w-11 h-11 flex items-center justify-center relative"
              aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              <Menu className={`absolute text-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100"}`} size={22} />
              <X className={`absolute text-white transition-all duration-300 ease-in-out ${mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`} size={22} />
            </button>
          </nav>

          {/* 移动端菜单 */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-7">
                {NAV_LINKS.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white text-3xl"
                    style={{
                      ...FONTS.system,
                      animation: `mobile-menu-link-in 500ms cubic-bezier(0.4,0,0.2,1) ${100 + index * 50}ms both`,
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Hero 内容 */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-4">
            <div
              className="liquid-glass rounded-full px-5 py-2 mb-7 transition-colors duration-700"
              style={{ ...FONTS.system, color: heroTextColor }}
            >
              <span className="text-sm inline-flex items-center gap-2">
                <Sparkles size={14} />
                为 OpenClaw / Claude Code 准备的 Skills 目录
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl mb-6 transition-colors duration-700 text-center"
              style={{ ...FONTS.serif, color: heroTextColor }}
            >
              发现、安装、分享
              <br />
              高质量 Skills
            </h1>

            <p
              className="max-w-xl leading-relaxed mb-8 text-base sm:text-lg transition-colors duration-700"
              style={{ ...FONTS.system, color: heroTextColor }}
            >
              一个为 OpenClaw 与 Claude Code 而生的 Skills 注册目录。
              <br className="hidden sm:block" />
              一行命令安装，即插即用，全部开源免费。
            </p>

            <div className={`liquid-glass rounded-full flex items-center gap-1 p-1.5 mb-10 w-full max-w-[320px] sm:max-w-sm transition-colors duration-700`}>
              <Link
                href="/explore"
                className="flex-1 bg-white text-black text-sm px-4 sm:px-5 py-2 rounded-full whitespace-nowrap hover:bg-white/90 transition-colors duration-200 text-center inline-flex items-center justify-center gap-2"
                style={FONTS.system}
              >
                <Search size={14} />
                开始探索 Skills
              </Link>
            </div>

            {/* 视频切换器 */}
            <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
              {VIDEOS.map((video, index) => {
                const isActive = activeVideo === index;
                return (
                  <button
                    key={index}
                    onClick={() => handleVideoSwitch(index)}
                    disabled={isTransitioning}
                    className={`px-2 py-1.5 text-sm border-b-2 transition-all duration-300 flex items-center gap-1.5 disabled:cursor-not-allowed ${
                      isActive ? "opacity-100" : "opacity-50 hover:opacity-80 border-transparent"
                    }`}
                    style={{
                      ...FONTS.system,
                      color: heroTextColor,
                      borderColor: isActive ? heroTextColor : "transparent",
                    }}
                  >
                    {video.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 底部统计 */}
          <div
            className="flex items-center justify-center gap-3 sm:gap-6 px-6 py-8 text-white/70 text-xs sm:text-sm flex-wrap"
            style={FONTS.system}
          >
            {STATS.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-3 sm:gap-6">
                <span className="inline-flex items-baseline gap-1.5">
                  <span className="text-white text-base" style={FONTS.serif}>{stat.value}</span>
                  {stat.label}
                </span>
                {index < STATS.length - 1 && <span className="hidden sm:inline text-white/40">|</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Features Section ============ */}
      <section id="features" className="relative py-24 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="liquid-glass rounded-full px-4 py-1.5 inline-block mb-6" style={FONTS.system}>
              <span className="text-xs text-white/80 uppercase tracking-wider">特性</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4" style={FONTS.serif}>
              为什么选择 Lumora Skills
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-base sm:text-lg leading-relaxed" style={FONTS.system}>
              从发现到安装，从使用到定制，每一个环节都为开发者体验而设计。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="liquid-glass rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl text-white mb-2" style={FONTS.serif}>{f.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed" style={FONTS.system}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Featured Skills Section ============ */}
      <section className="relative py-24 px-6 sm:px-10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="liquid-glass rounded-full px-4 py-1.5 inline-block mb-4" style={FONTS.system}>
                <span className="text-xs text-white/80 uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Sparkles size={11} /> 精选
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl" style={FONTS.serif}>
                编辑推荐
              </h2>
            </div>
            <Link
              href="/explore"
              className="liquid-glass rounded-full text-white text-sm px-5 py-2.5 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
              style={FONTS.system}
            >
              查看全部
              <ArrowRight size={14} />
            </Link>
          </div>

          {featuredSkills.length === 0 ? (
            <div className="liquid-glass rounded-2xl p-12 text-center text-white/50" style={FONTS.system}>
              <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3" />
              <p>加载精选 Skills...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSkills.map((skill) => (
                <Link
                  key={skill.id}
                  href={`/skill/${skill.id}`}
                  className="liquid-glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300 group block"
                >
                  <div className="aspect-[16/10] relative overflow-hidden bg-white/5">
                    {skill.thumbnail ? (
                      <img src={skill.thumbnail} alt={skill.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30 text-4xl" style={FONTS.serif}>
                        {skill.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute top-3 left-3 liquid-glass rounded-full px-3 py-1 text-xs text-white inline-flex items-center gap-1" style={FONTS.system}>
                      <Sparkles size={11} /> 精选
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-2xl mb-2 text-white" style={FONTS.serif}>{skill.name}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-2 leading-relaxed" style={FONTS.system}>{skill.tagline}</p>
                    <div className="flex items-center justify-between text-xs text-white/50 pt-4 border-t border-white/10" style={FONTS.system}>
                      <span>{skill.framework}</span>
                      <span>{skill.deployCount} 安装</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ How to Use Section ============ */}
      <section id="how" className="relative py-24 px-6 sm:px-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="liquid-glass rounded-full px-4 py-1.5 inline-block mb-6" style={FONTS.system}>
              <span className="text-xs text-white/80 uppercase tracking-wider">使用流程</span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl mb-4" style={FONTS.serif}>
              四步开始使用
            </h2>
            <p className="text-white/60 max-w-xl mx-auto text-base sm:text-lg leading-relaxed" style={FONTS.system}>
              从浏览到运行，全流程不超过一分钟。
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="liquid-glass rounded-2xl p-6 relative">
                <div className="text-5xl text-white/15 absolute top-4 right-5" style={FONTS.serif}>
                  {step.num}
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white text-sm mb-4" style={FONTS.system}>
                  {step.num}
                </div>
                <h3 className="text-xl text-white mb-2" style={FONTS.serif}>{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed" style={FONTS.system}>{step.desc}</p>
              </div>
            ))}
          </div>

          {/* 命令演示 */}
          <div className="mt-12 liquid-glass rounded-2xl p-6" style={{ backgroundColor: "rgba(10,10,10,0.6)" }}>
            <div className="flex items-center gap-2 mb-4 text-white/50 text-xs" style={FONTS.system}>
              <Terminal size={13} />
              <span>示例：安装 local-search skill</span>
            </div>
            <div className="space-y-2 font-mono text-sm" style={FONTS.system}>
              <div className="flex items-center gap-3">
                <span className="text-white/40 select-none">$</span>
                <code className="text-white">git clone https://github.com/Sakurakilove/local-search.git skills/local-search</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/40 select-none">$</span>
                <code className="text-white">cd skills/local-search && npm install</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-green-400 select-none">✓</span>
                <code className="text-white/60"># 已注册到 OpenClaw Skills 列表</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Community / CTA Section ============ */}
      <section id="community" className="relative py-24 px-6 sm:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="liquid-glass rounded-3xl p-10 sm:p-16 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "url(/videos/poster-golden.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Github size={24} className="text-white" />
              </div>
              <h2 className="text-4xl sm:text-5xl mb-4" style={FONTS.serif}>
                加入 Skills 社区
              </h2>
              <p className="text-white/70 max-w-lg mx-auto text-base sm:text-lg leading-relaxed mb-8" style={FONTS.system}>
                所有 Skills 完全开源。欢迎 Star 仓库、提交 Issue、贡献你自己的 Skill，
                让更多人受益。
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://github.com/Sakurakilove/Lumora"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black text-sm px-6 py-3 rounded-full hover:bg-white/90 transition-colors inline-flex items-center gap-2 font-medium"
                  style={FONTS.system}
                >
                  <Github size={16} />
                  Star on GitHub
                </a>
                <Link
                  href="/explore"
                  className="liquid-glass rounded-full text-white text-sm px-6 py-3 hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                  style={FONTS.system}
                >
                  浏览全部 Skills
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
