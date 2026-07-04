import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  // 创建默认管理员账号
  const existing = await db.adminUser.findUnique({ where: { username: "admin" } });
  if (!existing) {
    const hashed = await hashPassword("lumora2026");
    await db.adminUser.create({
      data: { username: "admin", password: hashed },
    });
    console.log("✅ 创建默认管理员: admin / lumora2026");
  } else {
    console.log("ℹ️ 管理员账号已存在，跳过");
  }

  // 创建示例 Skills
  const skills = [
    {
      name: "Lumora 正念专注",
      slug: "lumora",
      tagline: "在无尽喧嚣的宇宙中寻得清明",
      description:
        "Lumora 是一款电影感正念专注应用，提供 4 段沉浸式自然视频背景（金色时刻、静水、深林、静谧黎明），支持智能切换、液态玻璃 UI、深林暗色模式。基于 Next.js 16 + Tailwind CSS + Lucide React 构建。",
      category: "frontend",
      tags: "Next.js,Tailwind,液态玻璃,视频背景,正念",
      author: "Lumora Team",
      githubUrl: "https://github.com/Sakurakilove/Lumora",
      demoUrl: "https://lumora.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1500627964684-141351970a7f?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "EdgeOne Pages",
      featured: true,
      published: true,
    },
    {
      name: "Aurora AI 对话助手",
      slug: "aurora-ai-chat",
      tagline: "支持流式响应的多模型 AI 对话应用",
      description:
        "Aurora 是一个全栈 AI 对话助手，支持 OpenAI、Claude、DeepSeek 等多家模型切换，流式响应、上下文记忆、Markdown 渲染、代码高亮、文件上传、对话导出。基于 Next.js App Router + Prisma + Z-AI SDK 构建。",
      category: "ai",
      tags: "Next.js,AI,流式响应,OpenAI,Claude,DeepSeek",
      author: "Aurora Labs",
      githubUrl: "https://github.com/example/aurora-ai-chat",
      demoUrl: "https://aurora.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "EdgeOne Pages",
      featured: true,
      published: true,
    },
    {
      name: "Nebula 协作白板",
      slug: "nebula-whiteboard",
      tagline: "实时多人协作的无限画布白板",
      description:
        "Nebula 是一个基于 WebSocket 的实时协作白板，支持多人同时绘制、便签、文本、形状、图片，光标位置实时同步，支持房间分享和权限管理。基于 Next.js + Socket.io + Yjs 构建。",
      category: "fullstack",
      tags: "Next.js,WebSocket,Socket.io,协作,白板,Yjs",
      author: "Nebula Studio",
      githubUrl: "https://github.com/example/nebula-whiteboard",
      demoUrl: "https://nebula.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "EdgeOne Pages",
      featured: true,
      published: true,
    },
    {
      name: "Prism 数据仪表盘",
      slug: "prism-dashboard",
      tagline: "可拖拽布局的数据可视化仪表盘",
      description:
        "Prism 是一个数据可视化仪表盘模板，内置 12 种图表组件（柱状/折线/饼图/热力图/桑基图等），支持拖拽布局、主题切换、数据源接入（API/CSV/数据库）、定时刷新、导出 PDF 报告。基于 Next.js + Recharts + shadcn/ui 构建。",
      category: "fullstack",
      tags: "Next.js,Recharts,可视化,仪表盘,shadcn",
      author: "Prism Data",
      githubUrl: "https://github.com/example/prism-dashboard",
      demoUrl: "https://prism.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "Vercel",
      featured: false,
      published: true,
    },
    {
      name: "Quill Markdown 笔记",
      slug: "quill-notes",
      tagline: "支持双栏预览与本地存储的 Markdown 笔记",
      description:
        "Quill 是一款极简 Markdown 笔记应用，支持双栏实时预览、文件夹组织、全文搜索、标签、版本历史、导出 PDF/HTML。所有笔记本地加密存储，无需登录。基于 Next.js + IndexedDB 构建。",
      category: "tool",
      tags: "Next.js,Markdown,笔记,IndexedDB,本地存储",
      author: "Quill Workshop",
      githubUrl: "https://github.com/example/quill-notes",
      demoUrl: "https://quill.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "EdgeOne Pages",
      featured: false,
      published: true,
    },
    {
      name: "Tempo 任务管理",
      slug: "tempo-tasks",
      tagline: "看板视图 + 时间线 + 自动化的任务系统",
      description:
        "Tempo 是一款 Trello 风格的看板任务管理工具，支持拖拽卡片、自定义字段、子任务、依赖关系、自动化规则、Git 集成、团队协作。基于 Next.js + Prisma + Zustand 构建。",
      category: "fullstack",
      tags: "Next.js,Prisma,Zustand,看板,任务管理",
      author: "Tempo Inc",
      githubUrl: "https://github.com/example/tempo-tasks",
      demoUrl: "https://tempo.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "Vercel",
      featured: false,
      published: true,
    },
    {
      name: "Halo 渐变生成器",
      slug: "halo-gradient",
      tagline: "可视化设计 CSS 渐变与玻璃拟态效果",
      description:
        "Halo 是一款设计师工具，可视化生成线性/径向/锥形渐变、玻璃拟态、噪点纹理、毛玻璃滤镜，支持一键导出 CSS / Tailwind / Figma 样式代码，内置 200+ 预设模板。基于 Next.js + React 构建。",
      category: "design",
      tags: "Next.js,设计,渐变,CSS,玻璃拟态",
      author: "Halo Design",
      githubUrl: "https://github.com/example/halo-gradient",
      demoUrl: "https://halo.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "Cloudflare Pages",
      featured: false,
      published: true,
    },
    {
      name: "Echo 音频可视化",
      slug: "echo-audio-viz",
      tagline: "Web Audio API 实时频谱可视化套件",
      description:
        "Echo 提供多种音频可视化效果（频谱/波形/粒子/3D 球体），支持麦克风输入、音频文件上传、流式音频，可调节灵敏度、颜色、平滑度。基于 Next.js + Web Audio API + Three.js 构建。",
      category: "frontend",
      tags: "Next.js,Web Audio,Three.js,可视化,音频",
      author: "Echo Lab",
      githubUrl: "https://github.com/example/echo-audio-viz",
      demoUrl: "https://echo.example.com",
      thumbnail:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
      framework: "Next.js 16",
      deployPlatform: "EdgeOne Pages",
      featured: false,
      published: true,
    },
  ];

  for (const skill of skills) {
    const existingSkill = await db.skill.findUnique({ where: { slug: skill.slug } });
    if (!existingSkill) {
      await db.skill.create({ data: skill });
      console.log(`✅ 创建 Skill: ${skill.name}`);
    } else {
      console.log(`ℹ️ Skill 已存在: ${skill.name}`);
    }
  }

  console.log("\n🎉 种子数据初始化完成");
  console.log("=".repeat(50));
  console.log("管理员账号: admin");
  console.log("管理员密码: lumora2026");
  console.log("=".repeat(50));
}

main()
  .catch((e) => {
    console.error("❌ 种子数据初始化失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
