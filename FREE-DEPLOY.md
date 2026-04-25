# 免费部署指南 - Vercel + Render

> 完全免费的部署方案，适合产品验证和小规模使用

## 部署架构

```
用户浏览器
    ↓
Vercel (前端 PWA) - 免费
    ↓ API 请求
Render (后端 API) - 免费
    ↓
PostgreSQL + Redis (Render 提供) - 免费
```

## 免费额度说明

| 服务 | 免费额度 | 说明 |
|------|---------|------|
| Vercel | 无限流量 | 个人项目完全免费 |
| Render Web Service | 750 小时/月 | 足够 24/7 运行 |
| Render PostgreSQL | 1GB 存储 | 足够初期使用 |
| Render Redis | 25MB | 足够缓存使用 |

---

## 第一步：部署后端到 Render

### 1. 注册 Render 账号
- 访问 https://render.com
- 使用 GitHub 账号登录

### 2. 创建 Blueprint 部署

1. 点击 **New +** → **Blueprint**
2. 连接你的 GitHub 仓库
3. 选择 `daka-backend/render.yaml`
4. 点击 **Apply**

Render 会自动：
- 创建 PostgreSQL 数据库
- 创建 Redis 缓存
- 部署后端服务

### 3. 获取后端地址

部署完成后，你会得到一个类似这样的地址：
```
https://daka-backend-xxxx.onrender.com
```

**复制这个地址，下一步需要用到！**

---

## 第二步：部署前端到 Vercel

### 1. 注册 Vercel 账号
- 访问 https://vercel.com
- 使用 GitHub 账号登录

### 2. 导入项目

1. 点击 **Add New...** → **Project**
2. 导入你的 GitHub 仓库
3. 配置如下：

| 配置项 | 值 |
|--------|-----|
| Framework Preset | Vite |
| Root Directory | `daka-web` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

4. 添加环境变量：
   - 点击 **Environment Variables**
   - 添加：`VITE_API_BASE_URL=https://你的Render地址/api/v1`
   - 示例：`VITE_API_BASE_URL=https://daka-backend-xxxx.onrender.com/api/v1`

5. 点击 **Deploy**

### 3. 更新 Vercel 配置（重要）

部署完成后，需要更新 `vercel.json` 中的后端地址：

1. 打开 `daka-web/vercel.json`
2. 修改 `destination`：
```json
{
  "source": "/api/(.*)",
  "destination": "https://你的Render地址/api/v1/$1"
}
```

3. 提交代码，Vercel 会自动重新部署

---

## 第三步：更新后端 CORS

### 1. 获取 Vercel 域名

部署完成后，你会得到一个类似这样的地址：
```
https://daka-web-xxxx.vercel.app
```

### 2. 更新 Render 环境变量

1. 进入 Render Dashboard
2. 点击你的后端服务
3. 选择 **Environment** 标签
4. 添加环境变量：
   - `ALLOWED_ORIGINS=https://你的Vercel域名`
   - 示例：`ALLOWED_ORIGINS=https://daka-web-xxxx.vercel.app`

5. 服务会自动重启

---

## 第四步：验证部署

### 测试后端
访问：`https://你的Render地址/api/docs`
- 应该能看到 Swagger API 文档

### 测试前端
访问：`https://你的Vercel域名`
- 应该能看到登录页面
- 注册账号，测试功能

---

## 自定义域名（可选）

### Vercel 自定义域名
1. 进入项目设置 → Domains
2. 添加你的域名
3. 按提示配置 DNS

### Render 自定义域名
1. 进入服务设置 → Custom Domains
2. 添加你的域名
3. 配置 SSL 证书

---

## 常见问题

### 1. Render 服务休眠

**问题**：免费版 15 分钟无访问会休眠，下次访问需要 30 秒启动

**解决**：使用 UptimeRobot 定时 ping
1. 注册 https://uptimerobot.com
2. 添加 Monitor：
   - Type: HTTP(s)
   - URL: 你的 Render 地址/health
   - Interval: 5 minutes

### 2. CORS 错误

**问题**：前端无法连接后端

**解决**：
1. 检查 `ALLOWED_ORIGINS` 环境变量
2. 确保包含 `https://` 前缀
3. 重启 Render 服务

### 3. 数据库连接失败

**问题**：后端无法连接数据库

**解决**：
1. 检查 Render Dashboard 中数据库状态
2. 查看后端服务日志
3. 确认环境变量是否正确

---

## 更新部署

### 更新后端
```bash
git add .
git commit -m "更新功能"
git push
```
Render 会自动重新部署

### 更新前端
```bash
git add .
git commit -m "更新UI"
git push
```
Vercel 会自动重新部署

---

## 备份数据

### 导出数据库
```bash
# 在 Render Dashboard 中
# 1. 进入 PostgreSQL 服务
# 2. 点击 "Connect"
# 3. 使用 psql 命令导出
pg_dump $DATABASE_URL > backup.sql
```

### 自动备份（推荐）
使用 Render 的备份功能或设置定时任务

---

## 升级到付费版

当免费额度不够用时：

| 服务 | 付费版价格 | 推荐时机 |
|------|-----------|---------|
| Render | $7/月 | 需要更多性能 |
| Vercel Pro | $20/月 | 团队协作用 |
| 阿里云/腾讯云 | ¥50/月 | 国内访问速度要求 |

---

## 快速检查清单

部署前确认：
- [ ] GitHub 仓库已推送
- [ ] `render.yaml` 配置正确
- [ ] `vercel.json` 配置正确
- [ ] 后端 CORS 配置包含前端域名

部署后确认：
- [ ] 后端 Swagger 文档可访问
- [ ] 前端页面可访问
- [ ] 注册/登录功能正常
- [ ] 数据能正常保存

---

## 需要帮助？

1. 查看 Render 日志：Dashboard → Service → Logs
2. 查看 Vercel 日志：Dashboard → Project → Functions
3. 检查浏览器开发者工具 Network 标签
