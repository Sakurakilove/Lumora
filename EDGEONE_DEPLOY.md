# Lumora 部署到 EdgeOne Pages 指南

> 基于腾讯云 EdgeOne Pages 官方文档整理
> 参考：https://pages.edgeone.ai/zh/document/framework-nextjs

## 前置条件

- ✅ 腾讯云账号（建议已实名认证，免费额度无需付费）
- ✅ 项目代码已推送到 GitHub 仓库
- ✅ 视频文件已打包进 `public/videos/`（共约 79MB，会随仓库一起部署）

## EdgeOne Pages 对 Next.js 的支持情况

根据官方文档（2025 年最新版），EdgeOne Pages **完整支持 Next.js 全栈**：

| Next.js 功能 | 支持状态 |
|-------------|---------|
| App Router | ✅ |
| Pages Router | ✅ |
| 服务器端渲染 (SSR) | ✅ |
| 静态站点生成 (SSG) | ✅ |
| 增量静态再生成 (ISR) | ✅ |
| React 服务器组件 (RSC) | ✅ |
| 流式响应 | ✅ |
| 路由处理程序 | ✅ |

**本项目适用：** 我们用的是 App Router + 客户端组件（`"use client"`），是纯前端页面，没有任何 SSR 数据获取，EdgeOne Pages 完全支持。

## 部署步骤

### 第一步：在 EdgeOne Pages 创建项目

1. 访问 EdgeOne Pages：https://pages.edgeone.ai/
2. 登录（用腾讯云账号）
3. 点击「创建项目」→ 选择「从 Git 仓库导入」
4. 授权 GitHub，选择你的 `Lumora` 仓库

### 第二步：构建设置（关键）

按官方 Next.js 框架指南配置：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| **框架预设** | Next.js | EdgeOne 会自动识别，未识别时手动选 |
| **构建命令** | `npm run build` | 默认值，不要改 |
| **输出目录** | `.next` | 默认值，不要改成 `out` |
| **安装命令** | `npm install` | 默认值 |
| **Node.js 版本** | 18.x 或 20.x | 推荐选 20.x |

**⚠️ 重要：** 不要勾选「静态导出」选项。我们的 `next.config.ts` 用的是 `output: "standalone"`，EdgeOne 会自动处理。

### 第三步：环境变量（本项目无需配置）

本项目没有用到任何环境变量，留空即可。

### 第四步：加速区域选择

- **目标用户主要在国内** → 选「中国境内」（需要域名备案，但 `*.edgeone.app` 默认子域名可直接访问）
- **目标用户全球分布** → 选「全球」

### 第五步：点击部署

首次部署约 2-4 分钟（含 npm install + npm build）。

部署成功后会得到一个 `xxx.edgeone.app` 的免费域名，直接访问即可。

## CDN 加速效果（关键收益）

部署后所有资源都通过 EdgeOne CDN 分发：

| 资源 | 大小 | 缓存策略 | 国内访问效果 |
|------|------|---------|------------|
| HTML | ~5KB | 不缓存 | 边缘节点直出 |
| 视频（4个） | 79MB | 1年长期缓存 | 首次加载后秒开 |
| 字体 | ~14MB | 1年长期缓存 | 首次加载后秒开 |

**`public/_headers` 文件已配置好缓存策略**，部署后自动生效。

## 免费额度（个人项目足够用）

| 项 | 免费额度 | 本项目预计用量 |
|----|---------|---------------|
| 流量 | 10GB/月 | ~130 次完整视频加载 |
| 构建次数 | 1000 次/月 | 每次推送 1 次 |
| 边缘节点 | 国内 2000+，海外 1000+ | 全覆盖 |

## 国内访问验证清单

部署完成后，请在国内网络环境（手机流量 / 家宽）打开预览链接验证：

- [ ] 页面能在 2 秒内打开
- [ ] 首个视频（金色时刻）能自动播放，无明显卡顿
- [ ] 字体显示为衬线体（不是默认黑体）
- [ ] 切换到「深林」视频时，文字颜色变深（暗色模式生效）
- [ ] 移动端汉堡菜单能打开/关闭
- [ ] 邮箱输入框能输入文字

## 已内置的国内访问优化

代码层面已做以下优化：

1. **视频按需加载**：首个视频 `preload="auto"`，其他 `preload="metadata"`，避免一次性下载 79MB
2. **智能切换**：切换视频时先检测是否已缓冲，已缓冲则立即切换，未缓冲则加载好再切（避免黑屏）
3. **加载指示**：切换加载中显示小圆点动画
4. **超时兜底**：8 秒未加载完也会切换，避免卡死
5. **CDN 缓存**：`_headers` 配置视频 1 年缓存，二次访问秒开
6. **字体国内镜像**：使用 `fonts.loli.net` 镜像替代被墙的 Google Fonts

## 绑定自定义域名（可选）

部署成功后，在项目设置 → 域名管理中：

1. 添加你的域名（如 `lumora.yourdomain.com`）
2. 按提示到域名 DNS 添加 CNAME 记录
3. 等待解析生效（5-10 分钟）
4. EdgeOne 会自动签发 SSL 证书

**注意：** 自定义域名走中国境内 CDN 节点需要域名备案，否则只能用海外节点。`*.edgeone.app` 默认子域名无需备案。

## 常见问题

### Q1：构建失败怎么办？
**A：** 在 EdgeOne Pages 控制台查看构建日志。最常见原因是 Node 版本太低（要求 18+）或依赖安装失败。可以在项目设置里把 Node 版本调到 20.x。

### Q2：部署后视频还是加载慢？
**A：** 首次访问所有视频都要从源站拉取到 CDN 节点（冷启动），第二次开始就秒开。可以部署后自己先把 4 个视频都点一遍「预热」CDN 缓存。

### Q3：免费额度用完了怎么办？
**A：** EdgeOne Pages 超额后会暂停服务（不会自动扣费）。可以等下月重置，或升级到付费版（按量计费，约 0.2 元/GB）。

### Q4：能否不用 Git 仓库，直接上传？
**A：** 可以。EdgeOne 提供 CLI 工具：`npm install -g edgeone`，然后 `edgeone pages deploy` 直接上传文件夹。但 Git 仓库方式更便于持续迭代。

### Q5：项目用了 Prisma / WebSocket 等后端功能，能部署吗？
**A：** 本项目没有用，但 EdgeOne Pages 支持。Prisma 需要 EdgeOne 的 Node Functions 环境，WebSocket 需要用边缘函数模拟。具体看官方文档。

## 参考文档

- [EdgeOne Pages Next.js 框架指南](https://pages.edgeone.ai/zh/document/framework-nextjs)
- [5 分钟内部署 Next.js 全栈项目](https://pages.edgeone.ai/zh/resources/deploy-nextjs-project-to-pages)
- [Next.js 全栈部署最佳实践](https://pages.edgeone.ai/zh/resources/next-full-stack-deploy-guide)
- [EdgeOne Pages 官网](https://pages.edgeone.ai/)
