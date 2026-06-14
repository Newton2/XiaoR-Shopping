# 小R购物助手 — 打包说明

## 一键打包（Mac 或 Windows 电脑上运行）

### 前置条件
安装 Node.js：https://nodejs.org （下载 LTS 版，一键安装）

### 步骤

```bash
# 1. 下载项目代码（从服务器复制 xiaor-shopping 文件夹到本地）

# 2. 进入目录
cd xiaor-shopping

# 3. 安装依赖（只需一次）
npm install

# 4. 打包（在哪个系统打包就输出那个系统的安装包）
npm run build-win   # → 输出 dist/小R购物助手 Setup.exe  (Windows用)
npm run build-mac   # → 输出 dist/小R购物助手.dmg         (Mac用)
```

### 输出文件
- `dist/小R购物助手 Setup 1.0.0.exe` — Windows 安装包，双击安装
- `dist/小R购物助手-1.0.0.dmg` — Mac 安装包，拖入应用程序

## 或者：GitHub Actions 自动打包

把代码推到 GitHub，自动同时打包 Win + Mac，不需要本地环境。
（需要设置 `.github/workflows/build.yml`，告诉我就帮你配置）
