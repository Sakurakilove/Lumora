"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { FONTS } from "@/lib/styles";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 已登录则跳转
    fetch("/api/auth/me").then((r) => {
      if (r.ok) router.replace("/admin");
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "登录失败");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (e: any) {
      setError("网络错误：" + e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景视频氛围 */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          src="/videos/deep-woods.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-8 transition-colors"
            style={FONTS.system}
          >
            <ArrowLeft size={16} />
            返回首页
          </a>

          <div className="liquid-glass rounded-3xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                <Lock size={24} className="text-white" />
              </div>
              <h1 className="text-4xl text-white mb-2" style={FONTS.serif}>
                管理后台
              </h1>
              <p className="text-white/60 text-sm" style={FONTS.system}>
                Lumora Skills 控制台
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-xs text-white/60 mb-2"
                  style={FONTS.system}
                >
                  用户名
                </label>
                <div className="liquid-glass rounded-full flex items-center gap-2 px-4 py-3">
                  <User size={16} className="text-white/50 shrink-0" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="flex-1 bg-transparent outline-none text-white text-sm"
                    style={FONTS.system}
                    placeholder="admin"
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs text-white/60 mb-2"
                  style={FONTS.system}
                >
                  密码
                </label>
                <div className="liquid-glass rounded-full flex items-center gap-2 px-4 py-3">
                  <Lock size={16} className="text-white/50 shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 bg-transparent outline-none text-white text-sm"
                    style={FONTS.system}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/50 hover:text-white"
                    aria-label="切换密码可见性"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300 text-sm"
                  style={FONTS.system}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black text-base px-6 py-3.5 rounded-full hover:bg-white/90 transition-colors duration-200 inline-flex items-center justify-center gap-2 font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                style={FONTS.system}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock size={18} />
                    登录
                  </>
                )}
              </button>
            </form>

            <div
              className="mt-6 text-center text-xs text-white/40 leading-relaxed"
              style={FONTS.system}
            >
              默认账号：<span className="text-white/60">admin</span>　密码：<span className="text-white/60">lumora2026</span>
              <br />
              登录后请尽快在数据库中修改密码
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
