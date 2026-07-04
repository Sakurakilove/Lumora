import Link from "next/link";
import { Github, Sparkles } from "lucide-react";
import { FONTS } from "@/lib/styles";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* 品牌 */}
          <div className="col-span-2 md:col-span-1">
            <div
              className="text-white text-2xl italic mb-3"
              style={FONTS.serif}
            >
              Lumora <span className="text-white/60 text-sm not-italic" style={FONTS.system}>Skills</span>
            </div>
            <p
              className="text-white/50 text-sm leading-relaxed"
              style={FONTS.system}
            >
              发现、分享、安装高质量 Skills。
              <br />
              为 OpenClaw 与 Claude Code 而生。
            </p>
          </div>

          {/* 探索 */}
          <div>
            <h4
              className="text-white text-sm mb-4 uppercase tracking-wider"
              style={FONTS.system}
            >
              探索
            </h4>
            <ul className="space-y-2" style={FONTS.system}>
              <li>
                <Link href="/explore" className="text-white/60 hover:text-white text-sm transition-colors">
                  全部 Skills
                </Link>
              </li>
              <li>
                <Link href="/explore?category=ai" className="text-white/60 hover:text-white text-sm transition-colors">
                  AI 应用
                </Link>
              </li>
              <li>
                <Link href="/explore?category=tool" className="text-white/60 hover:text-white text-sm transition-colors">
                  工具
                </Link>
              </li>
              <li>
                <Link href="/explore?category=design" className="text-white/60 hover:text-white text-sm transition-colors">
                  设计
                </Link>
              </li>
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h4
              className="text-white text-sm mb-4 uppercase tracking-wider"
              style={FONTS.system}
            >
              资源
            </h4>
            <ul className="space-y-2" style={FONTS.system}>
              <li>
                <a href="https://github.com/Sakurakilove/Lumora" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm transition-colors inline-flex items-center gap-1.5">
                  <Github size={13} /> GitHub 仓库
                </a>
              </li>
              <li>
                <a href="https://clawhub.ai" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm transition-colors">
                  ClawHub 注册表
                </a>
              </li>
              <li>
                <a href="https://openclaw.ai" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white text-sm transition-colors">
                  OpenClaw 文档
                </a>
              </li>
              <li>
                <Link href="/#about" className="text-white/60 hover:text-white text-sm transition-colors">
                  关于 Lumora
                </Link>
              </li>
            </ul>
          </div>

          {/* 订阅 */}
          <div>
            <h4
              className="text-white text-sm mb-4 uppercase tracking-wider"
              style={FONTS.system}
            >
              订阅更新
            </h4>
            <p
              className="text-white/50 text-xs leading-relaxed mb-3"
              style={FONTS.system}
            >
              新 Skill 上线第一时间收到通知
            </p>
            <div className="liquid-glass rounded-full flex items-center gap-1 p-1.5">
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 bg-transparent outline-none px-3 py-1.5 text-white text-sm placeholder:text-white/30 min-w-0"
                style={FONTS.system}
              />
              <button
                className="bg-white text-black text-xs px-3 py-1.5 rounded-full hover:bg-white/90 transition-colors shrink-0 inline-flex items-center gap-1"
                style={FONTS.system}
              >
                <Sparkles size={11} />
                订阅
              </button>
            </div>
          </div>
        </div>

        {/* 底栏 */}
        <div
          className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40"
          style={FONTS.system}
        >
          <div>© 2026 Lumora Skills · 由 朝歌 @Sakurakilove 维护</div>
          <div className="flex items-center gap-4">
            <a href="/#privacy" className="hover:text-white/70 transition-colors">隐私政策</a>
            <a href="/#terms" className="hover:text-white/70 transition-colors">服务条款</a>
            <a href="https://github.com/Sakurakilove/Lumora" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">反馈</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
