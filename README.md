# Artab

让有史以来最好的艺术作品出现在你的新标签页

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm run dev

# 构建项目
pnpm run build
```

## 本地调试

1. 运行 `pnpm run build` 构建项目
2. 打开 Chrome 扩展管理页面 (`chrome://extensions/`)
3. 开启开发者模式
4. 点击"加载已解压的扩展程序"
5. 选择项目的 `dist` 目录

## 项目结构

```bash
.
├── packages/                # 共享包
│   └── storage/            # 存储模块
├── pages/                  # 扩展页面
│   ├── options/           # 选项页面
│   └── new-tab/           # 新标签页
└── chrome-extension/       # 扩展background
```
