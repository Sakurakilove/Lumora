// 全站共享样式常量，确保 Lumora 视觉风格一致
export const FONTS = {
  serif: { fontFamily: "'Instrument Serif', 'Noto Serif SC', serif" } as const,
  system: { fontFamily: "system-ui, sans-serif" } as const,
};

export const COLORS = {
  bg: "#000000",
  fgLight: "#ffffff",
  fgDark: "#182C41",
  fgMuted: "rgba(255,255,255,0.7)",
  fgDarkMuted: "rgba(24,44,65,0.7)",
  glassBg: "rgba(255, 255, 255, 0.01)",
  glassBorder: "rgba(255, 255, 255, 0.45)",
};

// 液态玻璃 pill 按钮（白色实心）
export const primaryButtonClass =
  "bg-white text-black text-sm px-5 py-2 rounded-full hover:bg-white/90 transition-colors duration-200 inline-flex items-center justify-center gap-2";

// 液态玻璃 pill 按钮（透明）
export const glassButtonClass =
  "liquid-glass rounded-full text-white text-sm px-5 py-2 hover:bg-white/10 transition-colors duration-200 inline-flex items-center justify-center gap-2";

// 视频背景的暗色叠加层，确保内容可读
export const videoOverlayClass =
  "absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 pointer-events-none";
