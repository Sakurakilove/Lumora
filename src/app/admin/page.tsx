"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Plus,
  Edit3,
  Trash2,
  LogOut,
  Eye,
  Rocket,
  Sparkles,
  FileText,
  TrendingUp,
  ExternalLink,
  X,
  Save,
  Star,
} from "lucide-react";
import { FONTS } from "@/lib/styles";
import { CATEGORIES, DEPLOY_PLATFORMS } from "@/lib/skills";

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
  published: boolean;
  deployCount: number;
  viewCount: number;
  createdAt: string;
};

type Stats = {
  total: number;
  published: number;
  draft: number;
  featured: number;
  totalViews: number;
  totalDeploys: number;
};

const EMPTY_FORM = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  category: "frontend",
  tags: "",
  author: "",
  githubUrl: "",
  demoUrl: "",
  thumbnail: "",
  framework: "Next.js 16",
  deployPlatform: "EdgeOne Pages",
  featured: false,
  published: true,
};

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const checkAuthAndLoad = useCallback(async () => {
    const authRes = await fetch("/api/auth/me");
    if (!authRes.ok) {
      router.replace("/admin/login");
      return;
    }
    setAuthChecked(true);
    setLoading(true);
    const [statsRes, skillsRes] = await Promise.all([
      fetch("/api/stats"),
      fetch("/api/skills?limit=999"),
    ]);
    if (statsRes.ok) {
      const data = await statsRes.json();
      setStats(data.stats);
    }
    if (skillsRes.ok) {
      const data = await skillsRes.json();
      setSkills(data.skills || []);
    }
    setLoading(false);
  }, [router]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [statsRes, skillsRes] = await Promise.all([
      fetch("/api/stats"),
      fetch("/api/skills?limit=999"),
    ]);
    if (statsRes.ok) {
      const data = await statsRes.json();
      setStats(data.stats);
    }
    if (skillsRes.ok) {
      const data = await skillsRes.json();
      setSkills(data.skills || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void checkAuthAndLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError("");
    setShowEditor(true);
  };

  const openEdit = (skill: Skill) => {
    setForm({
      name: skill.name,
      slug: skill.slug,
      tagline: skill.tagline,
      description: skill.description,
      category: skill.category,
      tags: skill.tags.join(", "),
      author: skill.author,
      githubUrl: skill.githubUrl,
      demoUrl: skill.demoUrl,
      thumbnail: skill.thumbnail,
      framework: skill.framework,
      deployPlatform: skill.deployPlatform,
      featured: skill.featured,
      published: skill.published,
    });
    setEditingId(skill.id);
    setFormError("");
    setShowEditor(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!form.name || !form.slug || !form.githubUrl) {
      setFormError("name, slug, githubUrl 必填");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean),
    };
    try {
      const url = editingId
        ? `/api/skills/${editingId}`
        : "/api/skills";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "保存失败");
        setSaving(false);
        return;
      }
      setShowEditor(false);
      await loadAll();
    } catch (e: any) {
      setFormError("网络错误：" + e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确认删除「${name}」？此操作不可恢复。`)) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      await loadAll();
    } else {
      alert("删除失败");
    }
  };

  const toggleFeatured = async (skill: Skill) => {
    await fetch(`/api/skills/${skill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !skill.featured }),
    });
    await loadAll();
  };

  const togglePublished = async (skill: Skill) => {
    await fetch(`/api/skills/${skill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !skill.published }),
    });
    await loadAll();
  };

  if (!authChecked) {
    return (
      <div
        className="min-h-screen bg-black text-white flex items-center justify-center"
        style={FONTS.system}
      >
        <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 顶栏 */}
      <header className="border-b border-white/10 sticky top-0 z-20 backdrop-blur-xl bg-black/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={20} className="text-white" />
            <span className="text-xl italic" style={FONTS.serif}>
              Lumora <span className="text-white/60 text-sm not-italic" style={FONTS.system}>管理后台</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-white/70 hover:text-white text-sm inline-flex items-center gap-1.5"
              style={FONTS.system}
            >
              <ExternalLink size={14} />
              查看站点
            </Link>
            <button
              onClick={handleLogout}
              className="liquid-glass rounded-full text-white text-sm px-4 py-2 hover:bg-white/10 transition-colors inline-flex items-center gap-1.5"
              style={FONTS.system}
            >
              <LogOut size={14} />
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          <StatCard icon={<FileText size={18} />} label="总 Skills" value={stats?.total ?? 0} />
          <StatCard icon={<Eye size={18} />} label="已发布" value={stats?.published ?? 0} />
          <StatCard icon={<FileText size={18} />} label="草稿" value={stats?.draft ?? 0} />
          <StatCard icon={<Sparkles size={18} />} label="精选" value={stats?.featured ?? 0} />
          <StatCard icon={<TrendingUp size={18} />} label="总浏览" value={stats?.totalViews ?? 0} />
          <StatCard icon={<Rocket size={18} />} label="总部署" value={stats?.totalDeploys ?? 0} />
        </div>

        {/* Skills 列表 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl" style={FONTS.serif}>Skills 管理</h2>
          <button
            onClick={openNew}
            className="bg-white text-black text-sm px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors inline-flex items-center gap-2 font-medium"
            style={FONTS.system}
          >
            <Plus size={16} />
            新增 Skill
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/50" style={FONTS.system}>
            <div className="inline-block w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p>加载中...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="liquid-glass rounded-3xl p-12 text-center" style={FONTS.system}>
            <p className="text-white/60 mb-4">还没有 Skills，点击右上角新增第一个</p>
          </div>
        ) : (
          <div className="liquid-glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full" style={FONTS.system}>
                <thead>
                  <tr className="border-b border-white/10 text-white/60 text-xs">
                    <th className="text-left px-5 py-3 font-normal">名称</th>
                    <th className="text-left px-5 py-3 font-normal hidden sm:table-cell">分类</th>
                    <th className="text-left px-5 py-3 font-normal hidden md:table-cell">作者</th>
                    <th className="text-right px-5 py-3 font-normal">浏览</th>
                    <th className="text-right px-5 py-3 font-normal">部署</th>
                    <th className="text-center px-5 py-3 font-normal">状态</th>
                    <th className="text-right px-5 py-3 font-normal">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill) => (
                    <tr
                      key={skill.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden shrink-0">
                            {skill.thumbnail && (
                               
                              <img src={skill.thumbnail} alt="" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <div className="text-white text-sm flex items-center gap-2">
                              {skill.name}
                              {skill.featured && <Star size={12} className="text-yellow-400 fill-yellow-400" />}
                            </div>
                            <div className="text-white/40 text-xs truncate max-w-[200px]">{skill.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className="text-white/70 text-xs">
                          {CATEGORIES.find((c) => c.id === skill.category)?.name || skill.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-white/70 text-xs">{skill.author}</span>
                      </td>
                      <td className="px-5 py-4 text-right text-white/70 text-xs">{skill.viewCount}</td>
                      <td className="px-5 py-4 text-right text-white/70 text-xs">{skill.deployCount}</td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => togglePublished(skill)}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            skill.published
                              ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                              : "bg-white/10 text-white/60 hover:bg-white/20"
                          }`}
                        >
                          {skill.published ? "已发布" : "草稿"}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => toggleFeatured(skill)}
                            className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${
                              skill.featured ? "text-yellow-400" : "text-white/40"
                            }`}
                            title={skill.featured ? "取消精选" : "设为精选"}
                          >
                            <Star size={14} className={skill.featured ? "fill-yellow-400" : ""} />
                          </button>
                          <Link
                            href={`/skill/${skill.id}`}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 transition-colors"
                            title="预览"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => openEdit(skill)}
                            className="p-1.5 rounded-full hover:bg-white/10 text-white/60 transition-colors"
                            title="编辑"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id, skill.name)}
                            className="p-1.5 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                            title="删除"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* 编辑器 modal */}
      {showEditor && (
        <SkillEditor
          form={form}
          setForm={setForm}
          editingId={editingId}
          saving={saving}
          formError={formError}
          onClose={() => setShowEditor(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="liquid-glass rounded-2xl p-4">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        {icon}
        <span className="text-xs" style={FONTS.system}>{label}</span>
      </div>
      <div className="text-3xl text-white" style={FONTS.serif}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function SkillEditor({
  form,
  setForm,
  editingId,
  saving,
  formError,
  onClose,
  onSave,
}: {
  form: any;
  setForm: (f: any) => void;
  editingId: string | null;
  saving: boolean;
  formError: string;
  onClose: () => void;
  onSave: () => void;
}) {
  const update = (key: string, value: any) => setForm({ ...form, [key]: value });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="liquid-glass rounded-3xl max-w-2xl w-full p-8 my-8 relative"
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: "rgba(20,20,20,0.95)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white p-2"
          aria-label="关闭"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl text-white mb-6" style={FONTS.serif}>
          {editingId ? "编辑 Skill" : "新增 Skill"}
        </h2>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2" style={FONTS.system}>
          <Field label="名称 *" value={form.name} onChange={(v) => update("name", v)} placeholder="例如：Lumora 正念专注" />
          <Field label="Slug（URL 标识）*" value={form.slug} onChange={(v) => update("slug", v)} placeholder="lumora" />
          <Field label="一句话简介" value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="在无尽喧嚣中寻得清明" />
          <Field
            label="详细描述"
            value={form.description}
            onChange={(v) => update("description", v)}
            placeholder="支持多行，详细描述这个 Skill 的功能和特性..."
            multiline
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-2">分类</label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full liquid-glass rounded-full px-4 py-3 text-white text-sm outline-none"
                style={FONTS.system}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-black text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-2">部署平台</label>
              <select
                value={form.deployPlatform}
                onChange={(e) => update("deployPlatform", e.target.value)}
                className="w-full liquid-glass rounded-full px-4 py-3 text-white text-sm outline-none"
                style={FONTS.system}
              >
                {DEPLOY_PLATFORMS.map((p) => (
                  <option key={p} value={p} className="bg-black text-white">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Field label="标签（逗号分隔）" value={form.tags} onChange={(v) => update("tags", v)} placeholder="Next.js, Tailwind, AI" />
          <Field label="作者" value={form.author} onChange={(v) => update("author", v)} placeholder="Lumora Team" />
          <Field label="GitHub 仓库地址 *" value={form.githubUrl} onChange={(v) => update("githubUrl", v)} placeholder="https://github.com/..." />
          <Field label="在线演示地址" value={form.demoUrl} onChange={(v) => update("demoUrl", v)} placeholder="https://..." />
          <Field label="缩略图 URL" value={form.thumbnail} onChange={(v) => update("thumbnail", v)} placeholder="https://..." />
          <Field label="技术框架" value={form.framework} onChange={(v) => update("framework", v)} placeholder="Next.js 16" />

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => update("featured", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white text-sm">精选</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => update("published", e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-white text-sm">已发布</span>
            </label>
          </div>

          {formError && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-300 text-sm">
              {formError}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 liquid-glass rounded-full text-white text-sm px-5 py-3 hover:bg-white/10 transition-colors"
            style={FONTS.system}
          >
            取消
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-white text-black text-sm px-5 py-3 rounded-full hover:bg-white/90 transition-colors inline-flex items-center justify-center gap-2 font-medium disabled:opacity-60"
            style={FONTS.system}
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Save size={16} />
                保存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs text-white/60 mb-2" style={FONTS.system}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full liquid-glass rounded-2xl px-4 py-3 text-white text-sm outline-none resize-none placeholder:text-white/30"
          style={FONTS.system}
        />
      ) : (
        <div className="liquid-glass rounded-full px-4 py-3">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/30"
            style={FONTS.system}
          />
        </div>
      )}
    </div>
  );
}
