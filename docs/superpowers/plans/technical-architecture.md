# 技术架构与数据库设计文档

**文档版本**: V1.0  
**更新日期**: 2026-04-24  
**适用项目**: 智能学习管理助手

---

## 一、技术架构概述

### 1.1 架构选型

```
┌─────────────────────────────────────────────────────────────┐
│                        客户端层                              │
├─────────────────┬─────────────────┬─────────────────────────┤
│   App端         │   PC管理后台    │   未来扩展              │
│   (UniApp)      │   (Vue3)        │   小程序/快应用         │
└────────┬────────┴────────┬────────┴────────┬────────────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │ HTTPS/WebSocket
┌──────────────────────────┼──────────────────────────────────┐
│                      网关层                                  │
│              Nginx (负载均衡/SSL/静态资源)                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                      应用层                                  │
│              Nest.js (Node.js + TypeScript)                  │
│  ┌─────────────┬─────────┼─────────┬─────────────┐          │
│  │ 用户模块    │ 计划模块 │ 积分模块 │ 统计模块    │          │
│  │ 认证授权    │ 打卡模块 │ 成就模块 │ 通知模块    │          │
│  └─────────────┴─────────┴─────────┴─────────────┘          │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                      数据层                                  │
│  ┌─────────────┐  ┌─────┴──────┐  ┌─────────────────────┐   │
│  │ PostgreSQL  │  │   Redis    │  │   阿里云OSS         │   │
│  │ (主数据库)  │  │  (缓存)    │  │   (文件存储)        │   │
│  └─────────────┘  └────────────┘  └─────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈详情

| 层级 | 技术选型 | 版本建议 | 说明 |
|------|----------|----------|------|
| **App端** | UniApp + Vue3 | Vue 3.3+ | 跨平台，一套代码多端运行 |
| **管理后台** | Vue3 + Element Plus | Element Plus 2.3+ | 企业级UI组件库 |
| **后端框架** | Nest.js | 10.x | 企业级Node.js框架 |
| **数据库** | PostgreSQL | 15.x | 关系型数据库 |
| **缓存** | Redis | 7.x | 会话、热点数据缓存 |
| **文件存储** | 阿里云OSS | - | 头像、课程表图片 |
| **消息队列** | Redis Pub/Sub | - | 轻量级消息推送 |
| **实时通信** | Socket.io | 4.x | WebSocket封装 |
| **部署** | Docker + Nginx | - | 容器化部署 |

---

## 二、后端架构设计

### 2.1 项目结构

```
daka-backend/
├── src/
│   ├── modules/                    # 业务模块
│   │   ├── auth/                   # 认证授权
│   │   ├── users/                  # 用户管理
│   │   ├── families/               # 家庭管理
│   │   ├── study-plans/            # 学习计划
│   │   ├── plan-records/           # 打卡记录
│   │   ├── stars/                  # 积分系统
│   │   ├── achievements/           # 成就系统
│   │   ├── wishes/                 # 愿望清单
│   │   ├── habits/                 # 习惯养成
│   │   ├── exam-scores/            # 成绩追踪
│   │   ├── statistics/             # 数据统计
│   │   ├── reviews/                # 家长审定
│   │   ├── ai/                     # AI服务
│   │   └── sync/                   # 多端同步
│   │
│   ├── common/                     # 公共模块
│   │   ├── decorators/             # 装饰器
│   │   ├── filters/                # 异常过滤器
│   │   ├── guards/                 # 守卫
│   │   ├── interceptors/           # 拦截器
│   │   ├── pipes/                  # 管道
│   │   └── utils/                  # 工具函数
│   │
│   ├── config/                     # 配置
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── entities/                   # 数据库实体
│   ├── dto/                        # 数据传输对象
│   └── main.ts                     # 入口文件
│
├── test/                           # 测试
├── docker/                         # Docker配置
└── package.json
```

### 2.2 核心模块依赖关系

```
auth (认证模块)
  └── users

users (用户模块)
  └── families

families (家庭模块)
  └── users

study-plans (学习计划模块)
  ├── users
  ├── families
  └── plan-records

plan-records (打卡模块)
  ├── study-plans
  ├── users
  └── stars

stars (积分模块)
  ├── users
  └── plan-records

achievements (成就模块)
  ├── users
  └── plan-records

wishes (愿望模块)
  ├── users
  └── stars

habits (习惯模块)
  ├── users
  └── stars

exam-scores (成绩模块)
  ├── users
  └── families

statistics (统计模块)
  ├── users
  ├── plan-records
  └── stars

reviews (审定模块)
  ├── users
  ├── plan-records
  └── stars
```

### 2.3 API 设计规范

#### RESTful API 规范

```typescript
// 标准响应格式
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

// 分页响应格式
interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
```

#### 路由命名规范

```
GET    /resources           # 列表查询
GET    /resources/:id       # 详情查询
POST   /resources           # 创建
PUT    /resources/:id       # 全量更新
PATCH  /resources/:id       # 部分更新
DELETE /resources/:id       # 删除

# 自定义操作
POST   /resources/:id/action
```

---

## 三、数据库设计

### 3.1 ER 图概览

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  families   │       │family_members│
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ id (PK)     │◄──────┤ id (PK)     │
│ phone       │       │ name        │       │ family_id   │
│ password    │       │ invite_code │       │ user_id     │
│ nickname    │       │ created_by  │       │ role        │
│ role        │       │ created_at  │       │ joined_at   │
│ star_balance│       └─────────────┘       └─────────────┘
│ ...         │
└──────┬──────┘
       │
       │ 1:N
       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│ study_plans │◄──────┤plan_records │       │   habits    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ child_id    │       │ plan_id     │       │ child_id    │
│ title       │       │ child_id    │       │ name        │
│ category    │       │ record_date │       │ type        │
│ period_type │       │ status      │       │ frequency   │
│ ...         │       │ earned_stars│       │ reward_stars│
└─────────────┘       └──────┬──────┘       └──────┬──────┘
                             │                     │
                             │                     │ 1:N
                             │                     ▼
                             │            ┌─────────────┐
                             │            │habit_records│
                             │            ├─────────────┤
                             │            │ id (PK)     │
                             │            │ habit_id    │
                             │            │ record_date │
                             │            │ earned_stars│
                             │            └─────────────┘
                             │
                             │ 1:N
                             ▼
                      ┌─────────────┐
                      │star_records │
                      ├─────────────┤
                      │ id (PK)     │
                      │ user_id     │
                      │ amount      │
                      │ type        │
                      │ source      │
                      │ balance_after│
                      └─────────────┘
```

### 3.2 详细表结构

#### 用户表 (users)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL CHECK (role IN ('parent', 'child')),
    
    -- 积分相关
    star_balance INTEGER DEFAULT 0,
    total_earned_stars INTEGER DEFAULT 0,
    total_spent_stars INTEGER DEFAULT 0,
    
    -- 学习统计
    total_study_seconds INTEGER DEFAULT 0,
    total_completed_plans INTEGER DEFAULT 0,
    
    -- 连续打卡
    continuous_days INTEGER DEFAULT 0,
    last_checkin_date DATE,
    max_continuous_days INTEGER DEFAULT 0,
    
    -- 时间戳
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);
```

#### 家庭表 (families)

```sql
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) UNIQUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_families_invite_code ON families(invite_code);
```

#### 家庭成员关联表 (family_members)

```sql
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

CREATE INDEX idx_family_members_family ON family_members(family_id);
CREATE INDEX idx_family_members_user ON family_members(user_id);
```

#### 学习计划表 (study_plans)

```sql
CREATE TABLE study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 基本信息
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category INTEGER NOT NULL CHECK (category BETWEEN 1 AND 13),
    
    -- 周期设置
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('once', 'daily', 'weekly', 'monthly')),
    start_date DATE NOT NULL,
    end_date DATE,
    
    -- 时间安排
    start_time TIME,
    end_time TIME,
    estimated_minutes INTEGER,
    
    -- 奖励设置
    reward_stars INTEGER DEFAULT 0,
    need_review BOOLEAN DEFAULT false,
    
    -- 计时设置
    is_timed BOOLEAN DEFAULT false,
    timer_type VARCHAR(20) CHECK (timer_type IN ('countup', 'countdown', 'pomodoro')),
    
    -- 艾宾浩斯复习
    is_ebbinghaus BOOLEAN DEFAULT false,
    ebbinghaus_stage INTEGER, -- 当前复习阶段 1-8
    
    -- 状态
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_plans_child ON study_plans(child_id);
CREATE INDEX idx_study_plans_date ON study_plans(start_date);
CREATE INDEX idx_study_plans_active ON study_plans(child_id, is_active);
```

#### 打卡记录表 (plan_records)

```sql
CREATE TABLE plan_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 打卡信息
    record_date DATE NOT NULL,
    actual_seconds INTEGER,
    
    -- 奖励
    earned_stars INTEGER DEFAULT 0,
    bonus_stars INTEGER DEFAULT 0, -- 额外奖励（如连续打卡）
    
    -- 状态
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    reject_reason VARCHAR(500),
    
    -- 时间戳
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(plan_id, record_date)
);

CREATE INDEX idx_plan_records_child ON plan_records(child_id);
CREATE INDEX idx_plan_records_date ON plan_records(record_date);
CREATE INDEX idx_plan_records_status ON plan_records(status);
```

#### 积分记录表 (star_records)

```sql
CREATE TABLE star_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 变动信息
    amount INTEGER NOT NULL, -- 正数收入，负数支出
    type VARCHAR(20) NOT NULL CHECK (type IN ('earn', 'spend')),
    
    -- 来源
    source VARCHAR(50) NOT NULL, -- plan_complete, habit_checkin, achievement, exchange, etc.
    source_id UUID, -- 关联记录ID
    description VARCHAR(200),
    
    -- 余额快照
    balance_after INTEGER NOT NULL,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_star_records_user ON star_records(user_id);
CREATE INDEX idx_star_records_created ON star_records(created_at);
```

#### 愿望清单表 (wishes)

```sql
CREATE TABLE wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    
    -- 兑换设置
    required_stars INTEGER NOT NULL,
    repeat_type VARCHAR(20) CHECK (repeat_type IN ('once', 'weekly', 'monthly', 'unlimited')),
    remaining_times INTEGER DEFAULT 1,
    exchanged_times INTEGER DEFAULT 0,
    
    -- 状态
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wishes_child ON wishes(child_id);
```

#### 兑换记录表 (exchange_records)

```sql
CREATE TABLE exchange_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wish_id UUID REFERENCES wishes(id) ON DELETE CASCADE,
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    consumed_stars INTEGER NOT NULL,
    exchanged_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exchange_records_child ON exchange_records(child_id);
```

#### 成就定义表 (achievement_defs)

```sql
CREATE TABLE achievement_defs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    icon VARCHAR(50),
    category VARCHAR(20),
    
    -- 等级配置 JSON
    levels JSONB NOT NULL, -- [{level, name, condition, reward, icon}, ...]
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- 初始化数据
INSERT INTO achievement_defs (code, name, description, icon, category, levels) VALUES
('study_master', '学习达人', '累计完成学习计划', '📚', 'study', '[
  {"level": 1, "name": "青铜", "condition": 10, "reward": 5},
  {"level": 2, "name": "白银", "condition": 50, "reward": 15},
  {"level": 3, "name": "黄金", "condition": 100, "reward": 30},
  {"level": 4, "name": "钻石", "condition": 200, "reward": 50}
]'),
('streak_champion', '连胜冠军', '连续打卡天数', '🔥', 'streak', '[
  {"level": 1, "name": "青铜", "condition": 3, "reward": 5},
  {"level": 2, "name": "白银", "condition": 7, "reward": 10},
  {"level": 3, "name": "黄金", "condition": 30, "reward": 30},
  {"level": 4, "name": "钻石", "condition": 100, "reward": 100}
]');
```

#### 用户成就表 (user_achievements)

```sql
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievement_defs(id),
    
    current_level INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0, -- 当前进度值
    
    unlocked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
```

#### 习惯表 (habits)

```sql
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    
    -- 类型
    type VARCHAR(20) NOT NULL CHECK (type IN ('positive', 'negative')),
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily_once', 'daily_multi')),
    target_times INTEGER DEFAULT 1,
    
    -- 积分
    reward_stars INTEGER DEFAULT 0,
    penalty_stars INTEGER DEFAULT 0,
    
    -- 提醒
    reminder_time TIME,
    reminder_days INTEGER[] DEFAULT '{0,1,2,3,4,5,6}', -- 0=周日
    
    -- 统计
    total_checkins INTEGER DEFAULT 0,
    max_streak INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habits_child ON habits(child_id);
```

#### 习惯打卡记录表 (habit_records)

```sql
CREATE TABLE habit_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    record_date DATE NOT NULL,
    checkin_count INTEGER DEFAULT 1,
    earned_stars INTEGER DEFAULT 0,
    note VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(habit_id, record_date)
);

CREATE INDEX idx_habit_records_habit ON habit_records(habit_id);
CREATE INDEX idx_habit_records_date ON habit_records(record_date);
```

#### 成绩表 (exam_scores)

```sql
CREATE TABLE exam_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    subject INTEGER NOT NULL CHECK (subject BETWEEN 1 AND 13),
    exam_name VARCHAR(200) NOT NULL,
    
    score DECIMAL(5,2) NOT NULL,
    total_score DECIMAL(5,2) NOT NULL,
    score_rate DECIMAL(5,2) GENERATED ALWAYS AS (score / total_score * 100) STORED,
    
    class_rank INTEGER,
    grade_rank INTEGER,
    
    exam_date DATE NOT NULL,
    comment TEXT,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exam_scores_child ON exam_scores(child_id);
CREATE INDEX idx_exam_scores_subject ON exam_scores(subject);
CREATE INDEX idx_exam_scores_date ON exam_scores(exam_date);
```

#### 每日统计汇总表 (statistics_daily)

```sql
CREATE TABLE statistics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stat_date DATE NOT NULL,
    
    -- 任务统计
    total_plans INTEGER DEFAULT 0,
    completed_plans INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- 时长统计
    total_study_seconds INTEGER DEFAULT 0,
    
    -- 积分统计
    earned_stars INTEGER DEFAULT 0,
    spent_stars INTEGER DEFAULT 0,
    
    -- 习惯统计
    habit_checkins INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(child_id, stat_date)
);

CREATE INDEX idx_statistics_daily_child ON statistics_daily(child_id);
CREATE INDEX idx_statistics_daily_date ON statistics_daily(stat_date);
```

---

## 四、缓存策略

### 4.1 Redis 数据结构

```
# 用户会话
session:{token} -> { userId, role, familyId }
TTL: 7天

# 用户星星余额（快速读取）
user:{userId}:stars -> 256
TTL: 永久，变更时更新

# 今日任务缓存
user:{userId}:today_plans -> [plan1, plan2, ...]
TTL: 1天

# 连续打卡天数
user:{userId}:streak -> 12
TTL: 永久，打卡时更新

# 排行榜（可选）
leaderboard:weekly -> sorted set { userId: score }
TTL: 7天
```

### 4.2 缓存更新策略

```typescript
// 写穿透模式
async updateStarBalance(userId: string, amount: number): Promise<void> {
  // 1. 更新数据库
  await this.usersRepository.increment('star_balance', amount, { where: { id: userId } });
  
  // 2. 删除缓存（或更新缓存）
  await this.redis.del(`user:${userId}:stars`);
  
  // 3. 记录积分变动
  await this.starRecordsRepository.create({ ... });
}

// 读穿透模式
async getStarBalance(userId: string): Promise<number> {
  // 1. 读缓存
  const cached = await this.redis.get(`user:${userId}:stars`);
  if (cached) return parseInt(cached);
  
  // 2. 读数据库
  const user = await this.usersRepository.findOne(userId);
  
  // 3. 写缓存
  await this.redis.setex(`user:${userId}:stars`, 86400, user.star_balance);
  
  return user.star_balance;
}
```

---

## 五、安全设计

### 5.1 认证授权

```typescript
// JWT 配置
interface JwtConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiresIn: '15m';
  refreshTokenExpiresIn: '7d';
}

// Token 内容
interface AccessTokenPayload {
  sub: string; // userId
  role: string;
  familyId?: string;
  iat: number;
  exp: number;
}
```

### 5.2 权限控制

```typescript
// 角色权限矩阵
const PERMISSIONS = {
  parent: [
    'plan:create', 'plan:update', 'plan:delete',
    'child:manage', 'review:approve',
    'exam:create', 'exam:update',
    'wish:create', 'wish:update'
  ],
  child: [
    'plan:view', 'plan:complete',
    'habit:checkin',
    'wish:exchange',
    'profile:view', 'profile:update'
  ]
};
```

### 5.3 数据安全

- 密码使用 bcrypt 加密（salt rounds: 10）
- 敏感字段（phone）加密存储
- API 使用 HTTPS
- SQL 注入防护（使用 ORM 参数化查询）
- XSS 防护（输入过滤、输出转义）

---

## 六、部署架构

### 6.1 Docker Compose 配置

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:pass@postgres:5432/daka
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    restart: always

  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=daka
    restart: always

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
  redis_data:
```

### 6.2 Nginx 配置

```nginx
upstream app {
    server app:3000;
}

server {
    listen 80;
    server_name api.daka-app.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.daka-app.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io/ {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

*文档结束*
