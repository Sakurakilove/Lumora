"use client";

import { useState, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";

const VIDEOS = [
  {
    url: "/videos/golden-hour.mp4",
    label: "金色时刻",
  },
  {
    url: "/videos/still-water.mp4",
    label: "静水",
  },
  {
    url: "/videos/deep-woods.mp4",
    label: "深林",
  },
  {
    url: "/videos/quiet-dawn.mp4",
    label: "静谧黎明",
  },
];

const NAV_LINKS = ["运作方式", "功能特色", "价格方案", "社区"];

const STATS = ["60+ 深度冥想", "12,000+ 创作者", "4.8 用户满意度", "意图优先设计"];

const PNG_OVERLAY_URL =
  "https://soft-zoom-63098134.figma.site/_assets/v11/0b4a435b2df2747593c43d7a1c9b4578f7d8d90c.png";

const DARK_COLOR = "#182C41";

const systemFont = { fontFamily: "system-ui, sans-serif" } as const;
const serifFont = {
  fontFamily: "'Instrument Serif', 'Noto Serif SC', serif",
} as const;

export default function Home() {
  const [activeVideo, setActiveVideo] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const isDarkMode = activeVideo === 2;

  const handleVideoSwitch = useCallback(
    (index: number) => {
      if (index === activeVideo || isTransitioning) return;
      const targetVideo = videoRefs.current[index];
      // 如果目标视频已经缓冲好（readyState >= 3），直接切换
      if (targetVideo && targetVideo.readyState >= 3) {
        setActiveVideo(index);
        setIsTransitioning(true);
        if (cooldownRef.current) clearTimeout(cooldownRef.current);
        cooldownRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, 1000);
        return;
      }
      // 否则先触发加载，等就绪后再切换
      setLoadingVideo(true);
      if (targetVideo) {
        targetVideo.load();
        const onReady = () => {
          targetVideo.removeEventListener("canplay", onReady);
          setActiveVideo(index);
          setIsTransitioning(true);
          setLoadingVideo(false);
          if (cooldownRef.current) clearTimeout(cooldownRef.current);
          cooldownRef.current = setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        };
        targetVideo.addEventListener("canplay", onReady);
        // 超时兜底：8 秒还没加载好，也切换过去（让用户看到加载状态）
        setTimeout(() => {
          targetVideo.removeEventListener("canplay", onReady);
          if (targetVideo.readyState < 3) {
            setActiveVideo(index);
            setIsTransitioning(true);
            setLoadingVideo(false);
            if (cooldownRef.current) clearTimeout(cooldownRef.current);
            cooldownRef.current = setTimeout(() => {
              setIsTransitioning(false);
            }, 1000);
          }
        }, 8000);
      }
    },
    [activeVideo, isTransitioning]
  );

  const heroTextColor = isDarkMode ? DARK_COLOR : "#ffffff";

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      {/* ===== Background Video Layer (z-0) ===== */}
      <div className="absolute inset-0 z-0">
        {VIDEOS.map((video, index) => (
          <video
            key={index}
            ref={(el) => {
              videoRefs.current[index] = el;
            }}
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

      {/* ===== Transparent PNG Overlay (z-1) ===== */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: `url(${PNG_OVERLAY_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          animation: "train-bob 3s ease-in-out infinite",
        }}
      />

      {/* ===== Content Layer (z-2) ===== */}
      <div className="relative z-[2] flex flex-col h-full">
        {/* ===== Navigation ===== */}
        <nav className="flex items-center justify-between px-6 sm:px-10 py-6">
          {/* Logo */}
          <div
            className="text-white text-xl sm:text-2xl italic"
            style={serifFont}
          >
            Lumora
          </div>

          {/* Desktop Nav Pill */}
          <div className="hidden md:flex items-center gap-1 liquid-glass rounded-full pl-2 pr-2 py-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-white/90 hover:text-white text-sm px-4 py-1.5 transition-colors duration-200"
                style={systemFont}
              >
                {link}
              </a>
            ))}
            <button
              className="bg-white text-black text-sm px-5 py-1.5 rounded-full hover:bg-white/90 transition-colors duration-200 ml-1"
              style={systemFont}
            >
              立即开始
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden liquid-glass rounded-full w-11 h-11 flex items-center justify-center relative"
            aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
          >
            <Menu
              className={`absolute text-white transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? "opacity-0 rotate-90 scale-75"
                  : "opacity-100 rotate-0 scale-100"
              }`}
              size={22}
            />
            <X
              className={`absolute text-white transition-all duration-300 ease-in-out ${
                mobileMenuOpen
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-75"
              }`}
              size={22}
            />
          </button>
        </nav>

        {/* ===== Mobile Menu Overlay ===== */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-7">
              {NAV_LINKS.map((link, index) => (
                <a
                  key={link}
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white text-3xl"
                  style={{
                    ...systemFont,
                    animation: `mobile-menu-link-in 500ms cubic-bezier(0.4,0,0.2,1) ${
                      100 + index * 50
                    }ms both`,
                  }}
                >
                  {link}
                </a>
              ))}
              <button
                className="bg-white text-black text-lg px-8 py-3 rounded-full mt-4 hover:bg-white/90 transition-colors duration-200"
                style={{
                  ...systemFont,
                  animation:
                    "mobile-menu-button-in 500ms cubic-bezier(0.4,0,0.2,1) 300ms both",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                立即开始
              </button>
            </div>
          </div>
        )}

        {/* ===== Hero Content ===== */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 -mt-4">
          {/* Badge */}
          <div
            className="liquid-glass rounded-full px-5 py-2 mb-7 transition-colors duration-700"
            style={{ ...systemFont, color: heroTextColor }}
          >
            <span className="text-sm">
              已有超过 10,000 位心灵找到属于他们的清明
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] max-w-4xl mb-6 transition-colors duration-700 text-center"
            style={{ ...serifFont, color: heroTextColor }}
          >
            在无尽喧嚣的
            <br />
            宇宙中寻得清明
          </h1>

          {/* Subtext */}
          <p
            className="max-w-xl leading-relaxed mb-8 text-base sm:text-lg transition-colors duration-700"
            style={{ ...systemFont, color: heroTextColor }}
          >
            超越提示音、无尽刷屏与无休止需求的混乱。
            <br className="hidden sm:block" />
            发现如何守护你的当下，带着意图去创造。
          </p>

          {/* Email Input */}
          <div
            className={`liquid-glass rounded-full flex items-center gap-1 p-1.5 mb-10 w-full max-w-[320px] sm:max-w-sm transition-colors duration-700`}
          >
            <input
              type="email"
              placeholder="您的邮箱地址"
              className={`flex-1 bg-transparent outline-none px-4 py-2 text-sm transition-colors duration-700 ${
                isDarkMode ? "placeholder-dark" : "placeholder-light"
              }`}
              style={{ ...systemFont, color: heroTextColor }}
            />
            <button
              className="bg-white text-black text-sm px-4 sm:px-5 py-2 rounded-full whitespace-nowrap hover:bg-white/90 transition-colors duration-200"
              style={systemFont}
            >
              抢先体验
            </button>
          </div>

          {/* Video Switcher */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap justify-center">
            {VIDEOS.map((video, index) => {
              const isActive = activeVideo === index;
              const isLoadingThis = loadingVideo && !isActive && isTransitioning;
              return (
                <button
                  key={index}
                  onClick={() => handleVideoSwitch(index)}
                  disabled={isTransitioning}
                  className={`px-2 py-1.5 text-sm border-b-2 transition-all duration-300 flex items-center gap-1.5 disabled:cursor-not-allowed ${
                    isActive
                      ? "opacity-100"
                      : "opacity-50 hover:opacity-80 border-transparent"
                  }`}
                  style={{
                    ...systemFont,
                    color: heroTextColor,
                    borderColor: isActive ? heroTextColor : "transparent",
                  }}
                >
                  {video.label}
                  {isLoadingThis && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: heroTextColor }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Bottom Stats ===== */}
        <div
          className="flex items-center justify-center gap-3 sm:gap-6 px-6 py-8 text-white/70 text-xs sm:text-sm flex-wrap"
          style={systemFont}
        >
          {STATS.map((stat, index) => (
            <div
              key={stat}
              className="flex items-center gap-3 sm:gap-6"
            >
              <span>{stat}</span>
              {index < STATS.length - 1 && (
                <span className="hidden sm:inline text-white/40">|</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
