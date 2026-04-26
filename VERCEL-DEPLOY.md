# Vercel + Supabase 部署指南

## 部署架构

```
用户浏览器
    ↓
Vercel (前端静态托管 + API Edge Functions)
    ↓
Supabase (PostgreSQL 数据库)
```

## 优势
- ✅ 完全免费
- ✅ 无需信用卡
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS

---

## 第一步：准备 Supabase

### 1.1 创建数据库表

在 Supabase Dashboard 中，点击 **SQL Editor**，执行以下 SQL：

```sql
-- 用户表
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'parent',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 家庭表
CREATE TABLE families (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  invite_code VARCHAR(20) UNIQUE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 家庭成员表
CREATE TABLE family_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_id UUID REFERENCES families(id),
  user_id UUID REFERENCES users(id),
  role VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW()
);

-- 学习计划表
CREATE TABLE study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(200) NOT NULL,
  category VARCHAR(50),
  subject VARCHAR(50),
  description TEXT,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  duration INTEGER,
  reward_stars INTEGER DEFAULT 0,
  repeat_pattern JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 打卡记录表
CREATE TABLE plan_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES study_plans(id),
  user_id UUID REFERENCES users(id),
  record_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  check_in_time TIMESTAMP,
  actual_duration INTEGER,
  earned_stars INTEGER DEFAULT 0,
  note TEXT,
  image_url TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 积分记录表
CREATE TABLE star_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  source VARCHAR(100),
  description TEXT,
  related_record_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_plan_records_user_date ON plan_records(user_id, record_date);
CREATE INDEX idx_star_records_user ON star_records(user_id);
CREATE INDEX idx_study_plans_user ON study_plans(user_id);
```

### 1.2 获取 Supabase 连接信息

1. 点击 **Settings** → **API**
2. 复制以下信息：
   - **URL**: `https://你的项目.supabase.co`
   - **anon public**: `eyJ...`（匿名密钥）

---

## 第二步：部署到 Vercel

### 2.1 准备代码

1. 修改 `daka-web/.env.production`：
```
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的匿名密钥
```

2. 修改 `daka-web/src/utils/request.ts`，使用 Supabase 客户端

### 2.2 部署

1. 访问 https://vercel.com
2. 点击 **Add New Project**
3. 导入你的 GitHub 仓库
4. 配置：
   - **Framework Preset**: Vite
   - **Root Directory**: `daka-web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 添加环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. 点击 **Deploy**

---

## 第三步：验证部署

1. 访问 Vercel 提供的域名
2. 测试注册/登录功能
3. 测试创建学习计划
4. 检查数据是否保存到 Supabase

---

## 更新代码

```bash
git add .
git commit -m "更新功能"
git push
```

Vercel 会自动重新部署！
