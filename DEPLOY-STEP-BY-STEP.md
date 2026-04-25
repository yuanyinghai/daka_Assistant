# 手把手部署指南 - 零基础也能完成

> 按照以下步骤，5 分钟即可完成免费部署

---

## 准备工作

### 你需要：
1. **GitHub 账号**（免费注册）
2. **邮箱**（用于注册各种服务）
3. **本项目代码**（已在你电脑上）

---

## 第一步：注册账号（2分钟）

### 1.1 注册 GitHub
1. 打开 https://github.com
2. 点击右上角 **Sign up**
3. 输入邮箱 → 创建密码 → 输入用户名
4. 验证邮箱（查收邮件，点击验证链接）

### 1.2 注册 Render（用于后端）
1. 打开 https://render.com
2. 点击 **Get Started for Free**
3. 选择 **Continue with GitHub**
4. 授权 Render 访问你的 GitHub

### 1.3 注册 Vercel（用于前端）
1. 打开 https://vercel.com
2. 点击 **Sign Up**
3. 选择 **Continue with GitHub**
4. 授权 Vercel 访问你的 GitHub

---

## 第二步：创建 GitHub 仓库（1分钟）

### 2.1 在 GitHub 创建仓库
1. 登录 https://github.com
2. 点击右上角 **+** → **New repository**
3. 填写信息：
   - **Repository name**: `daka-assistant`（或你喜欢的名字）
   - **Description**: 智能学习管理助手
   - 选择 **Public**（公开）
   - 勾选 **Add a README file**
4. 点击 **Create repository**

### 2.2 获取仓库地址
创建成功后，你会看到类似这样的地址：
```
https://github.com/你的用户名/daka-assistant.git
```
**复制这个地址，下一步需要用到！**

---

## 第三步：上传代码到 GitHub（1分钟）

### 3.1 打开 PowerShell
按 `Win + X`，选择 **Windows PowerShell** 或 **终端**

### 3.2 执行以下命令（复制粘贴）

```powershell
# 进入项目目录
cd "e:\AI学习\AI编程\my-project\daka_Assistant"

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit"

# 连接远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/daka-assistant.git

# 推送代码
git branch -M main
git push -u origin main
```

### 3.3 验证上传成功
刷新 GitHub 页面，应该能看到所有代码文件。

---

## 第四步：部署后端到 Render（1分钟）

### 4.1 创建 Blueprint 部署
1. 登录 https://dashboard.render.com
2. 点击 **New +** 按钮
3. 选择 **Blueprint**
4. 在列表中找到你的仓库 `daka-assistant`
5. 点击 **Connect**

### 4.2 配置 Blueprint
1. Render 会自动识别 `render.yaml` 文件
2. 给服务起个名字，如：`daka-backend`
3. 点击 **Apply**

### 4.3 等待部署完成
- 部署大约需要 3-5 分钟
- 看到 **"Your service is live"** 表示成功

### 4.4 获取后端地址
部署完成后，你会看到类似这样的地址：
```
https://daka-backend-xxx.onrender.com
```
**复制这个地址，下一步需要用到！**

---

## 第五步：部署前端到 Vercel（1分钟）

### 5.1 导入项目
1. 登录 https://vercel.com/dashboard
2. 点击 **Add New...** → **Project**
3. 在列表中找到你的仓库 `daka-assistant`
4. 点击 **Import**

### 5.2 配置项目
填写以下信息：

| 配置项 | 值 |
|--------|-----|
| **Framework Preset** | Vite |
| **Root Directory** | `daka-web` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### 5.3 添加环境变量
1. 展开 **Environment Variables**
2. 点击 **Add** 添加变量：
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://你的Render地址/api/v1`
   - 示例：`https://daka-backend-xxx.onrender.com/api/v1`
3. 点击 **Add**

### 5.4 部署
点击 **Deploy**，等待 1-2 分钟

### 5.5 获取前端地址
部署完成后，你会看到类似这样的地址：
```
https://daka-web-xxx.vercel.app
```
**复制这个地址！**

---

## 第六步：配置跨域（CORS）（1分钟）

### 6.1 更新 Render 环境变量
1. 回到 https://dashboard.render.com
2. 点击你的后端服务 `daka-backend`
3. 选择 **Environment** 标签
4. 点击 **Add Environment Variable**
5. 添加：
   - **Key**: `ALLOWED_ORIGINS`
   - **Value**: `https://你的Vercel域名`
   - 示例：`https://daka-web-xxx.vercel.app`
6. 点击 **Save Changes**
7. 服务会自动重启

---

## 第七步：验证部署（1分钟）

### 7.1 测试后端
浏览器访问：
```
https://你的Render地址/api/docs
```
应该能看到 Swagger API 文档页面

### 7.2 测试前端
浏览器访问：
```
https://你的Vercel域名
```
应该能看到登录页面

### 7.3 测试完整功能
1. 点击 **注册账号**
2. 填写信息注册
3. 登录系统
4. 尝试创建学习计划
5. 检查数据是否能保存

---

## 部署完成！🎉

### 你的应用地址：
- **前端（用户访问）**: `https://daka-web-xxx.vercel.app`
- **后端 API**: `https://daka-backend-xxx.onrender.com`
- **API 文档**: `https://daka-backend-xxx.onrender.com/api/docs`

### 分享给朋友：
直接把前端地址发给朋友，他们就能使用了！

---

## 常见问题解决

### 问题1：Render 部署失败
**解决**：
1. 点击服务 → **Logs** 查看错误日志
2. 常见原因：
   - 代码没有正确上传 → 重新执行第三步
   - 依赖安装失败 → 检查 `package.json`

### 问题2：前端无法连接后端（CORS 错误）
**解决**：
1. 确认第六步的 `ALLOWED_ORIGINS` 已正确设置
2. 确认值是完整的 Vercel 地址（包含 https://）
3. 重启 Render 服务

### 问题3：Vercel 部署失败
**解决**：
1. 检查 **Root Directory** 是否为 `daka-web`
2. 检查环境变量 `VITE_API_BASE_URL` 是否正确
3. 查看部署日志

### 问题4：Render 服务休眠（访问慢）
**解决**：
1. 注册 https://uptimerobot.com
2. 添加监控：
   - Type: HTTP(s)
   - URL: 你的 Render 地址/health
   - Interval: 5 minutes
3. 这样每 5 分钟会 ping 一次，保持服务活跃

---

## 更新代码后的部署

当你修改代码后，只需：

```powershell
cd "e:\AI学习\AI编程\my-project\daka_Assistant"
git add .
git commit -m "更新功能"
git push
```

Render 和 Vercel 会自动重新部署！

---

## 需要帮助？

如果在任何步骤遇到问题：
1. 截图错误信息
2. 描述你执行到哪一步
3. 我会帮你解决

**现在，请从第一步开始操作，有问题随时问我！**
