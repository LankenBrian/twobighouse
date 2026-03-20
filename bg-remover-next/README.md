# AI 背景移除工具 - Next.js 版本

一个简单易用的 AI 背景移除 Web 应用，使用 Next.js + Tailwind CSS 构建前端，Flask + rembg 提供后端服务。

## 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **后端**: Flask + rembg (ISNet 模型)
- **AI 模型**: isnet-general-use

## 功能特性

- ✅ 图片上传（点击或拖拽）
- ✅ AI 自动移除背景
- ✅ 实时预览（原图 vs 处理后）
- ✅ 图片下载（PNG 格式）

## 项目结构

```
bg-remover-next/
├── src/
│   └── app/
│       ├── globals.css    # 全局样式
│       ├── layout.tsx     # 布局组件
│       └── page.tsx       # 主页面
├── public/                # 静态资源
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 3. 构建生产版本

```bash
npm run build
npm start
```

## 后端服务

前端默认连接到生产环境的后端服务：`http://43.156.150.165:5000`

如果你想使用本地后端服务，需要：

1. 启动 Flask 后端服务（参考 `../bg-remover-app`）
2. 修改 `src/app/page.tsx` 中的 API 地址为 `http://localhost:5000`

## 后端 API

### 移除背景

**接口**: `POST /remove-background`

**请求**: FormData
- `file`: 图片文件

**响应**: PNG 图片

## 开发说明

- 前端使用 Next.js App Router
- 样式使用 Tailwind CSS
- 图片上传支持点击和拖拽两种方式
- 使用 Fetch API 与后端通信

## License

MIT
