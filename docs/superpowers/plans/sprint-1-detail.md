# 迭代一详细实施计划

**迭代周期**: Week 1-4（共4周）  
**迭代目标**: 核心闭环 - 实现"计划-打卡-积分"基础功能  
**交付标准**: 可运行的MVP版本，支持基础学习管理

---

## 一、迭代概览

### 1.1 迭代范围

```
✅ 包含功能：
├── 用户体系（注册/登录/家庭账号）
├── 学习计划增删改查
├── 快速打卡功能
├── 积分获取与余额展示
└── 今日看板基础版

❌ 不包含功能：
├── 计时器（正计时/倒计时）
├── 统计图表
├── 愿望清单
├── 成就系统
├── 习惯养成
└── AI功能
```

### 1.2 工时估算

| 模块 | 后端(人日) | 前端(人日) | 设计(人日) | 总计 |
|------|-----------|-----------|-----------|------|
| 环境搭建 | 2 | 2 | 0 | 4 |
| 用户体系 | 3 | 3 | 1 | 7 |
| 学习计划 | 4 | 5 | 2 | 11 |
| 打卡功能 | 2 | 3 | 1 | 6 |
| 积分系统 | 3 | 3 | 1 | 7 |
| 今日看板 | 1 | 4 | 2 | 7 |
| 测试修复 | 2 | 2 | 0 | 4 |
| **合计** | **17** | **22** | **7** | **46** |

---

## 二、Week 1：基础搭建（第1周）

### 2.1 本周目标

- 完成开发环境搭建
- 完成数据库设计
- 完成用户体系基础功能

### 2.2 每日任务分解

#### Day 1（周一）：项目初始化

**后端开发**
- [ ] 创建 Nest.js 项目
- [ ] 配置 TypeScript
- [ ] 配置 ESLint + Prettier
- [ ] 配置 Git 钩子（husky）
- [ ] 创建项目目录结构

**前端开发**
- [ ] 创建 UniApp 项目（Vue3）
- [ ] 配置 TypeScript 支持
- [ ] 配置 ESLint + Prettier
- [ ] 安装 UI 组件库（uView3）
- [ ] 配置路由和页面结构

**交付物检查点**
```bash
# 后端项目结构
daka-backend/
├── src/
│   ├── modules/
│   ├── common/
│   └── main.ts
├── test/
└── package.json

# 前端项目结构
daka-app/
├── src/
│   ├── pages/
│   ├── components/
│   ├── utils/
│   └── App.vue
└── pages.json
```

#### Day 2（周二）：Docker与数据库环境

**后端开发**
- [ ] 编写 Dockerfile
- [ ] 配置 docker-compose（开发环境）
- [ ] 集成 TypeORM
- [ ] 配置 PostgreSQL 连接
- [ ] 配置 Redis 连接

**数据库设计**
- [ ] 设计 users 表
- [ ] 设计 families 表
- [ ] 设计 family_members 表
- [ ] 编写实体类
- [ ] 编写迁移脚本

**交付物检查点**
```sql
-- users 表结构
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255),
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    role VARCHAR(20) CHECK (role IN ('parent', 'child')),
    star_balance INTEGER DEFAULT 0,
    continuous_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Day 3（周三）：认证基础

**后端开发**
- [ ] 集成 Passport.js
- [ ] 配置 JWT 策略
- [ ] 实现注册 API
- [ ] 实现登录 API
- [ ] 密码加密（bcrypt）

**前端开发**
- [ ] 封装 request 请求
- [ ] 配置请求拦截器（Token）
- [ ] 创建登录页面框架
- [ ] 创建注册页面框架

**交付物检查点**
```typescript
// API 接口定义
POST /auth/register
Body: { phone, password, nickname, role }
Response: { token, user }

POST /auth/login
Body: { phone, password }
Response: { token, user }
```

#### Day 4（周四）：家庭账号

**后端开发**
- [ ] 创建家庭 API
- [ ] 邀请成员 API
- [ ] 接受邀请 API
- [ ] 家庭成员列表 API
- [ ] 切换孩子 API

**前端开发**
- [ ] 完善登录页面UI
- [ ] 完善注册页面UI
- [ ] 角色选择页面
- [ ] 表单验证逻辑

**交付物检查点**
```typescript
// 家庭相关 API
POST /families
GET /families/:id/members
POST /families/invite
POST /families/join
PUT /families/switch-child
```

#### Day 5（周五）：Week 1 联调

**前后端联调**
- [ ] 注册流程端到端测试
- [ ] 登录流程端到端测试
- [ ] 家庭创建流程测试
- [ ] 修复发现的问题

**文档更新**
- [ ] 更新 API 文档
- [ ] 更新数据库文档

**周会**
- [ ] 周总结
- [ ] Week 2 计划确认

### 2.3 Week 1 风险点

| 风险 | 应对方案 |
|------|----------|
| UniApp 环境配置问题 | 提前准备备用方案，使用 HBuilderX |
| 数据库设计不合理 | 邀请团队评审，预留扩展字段 |
| JWT 安全性 | 使用 refresh token 机制 |

---

## 三、Week 2：学习计划模块（第2周）

### 3.1 本周目标

- 完成学习计划后端API
- 完成学习计划前端页面
- 实现周视图展示

### 3.2 每日任务分解

#### Day 6-7（周一、二）：后端API开发

**数据库表**
- [ ] study_plans 表
- [ ] plan_categories 枚举
- [ ] plan_records 表

**API 开发**
- [ ] POST /plans - 创建计划
- [ ] GET /plans - 计划列表（按日期范围）
- [ ] GET /plans/:id - 计划详情
- [ ] PUT /plans/:id - 更新计划
- [ ] DELETE /plans/:id - 删除计划

**业务逻辑**
- [ ] 13种分类枚举定义
- [ ] 周期计划生成逻辑
- [ ] 日期范围查询优化

**交付物检查点**
```typescript
// 计划实体
interface StudyPlan {
  id: string;
  childId: string;
  title: string;
  category: PlanCategory;
  periodType: 'once' | 'daily' | 'weekly';
  startDate: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  rewardStars: number;
  needReview: boolean;
  isTimed: boolean;
  estimatedMinutes?: number;
}
```

#### Day 8-9（周三、四）：前端页面开发

**页面开发**
- [ ] 学习计划页框架
- [ ] 周视图导航组件
- [ ] 计划卡片组件
- [ ] 空状态组件

**交互开发**
- [ ] 日期切换逻辑
- [ ] 计划列表渲染
- [ ] 下拉刷新
- [ ] 加载更多

**交付物检查点**
```vue
<!-- 周视图组件 -->
<WeekView 
  :currentDate="currentDate"
  :plans="plans"
  @change="onWeekChange"
  @select="onDaySelect"
/>
```

#### Day 10（周五）：添加计划功能

**弹窗开发**
- [ ] 添加计划弹窗框架
- [ ] 分类选择组件
- [ ] 日期时间选择器
- [ ] 表单验证

**业务逻辑**
- [ ] 表单提交
- [ ] 成功反馈
- [ ] 错误处理

**交付物检查点**
- 可创建单次计划
- 可创建周期计划
- 表单验证完整

#### Day 11-12（周末）：联调与优化

**联调测试**
- [ ] 创建计划端到端测试
- [ ] 编辑计划测试
- [ ] 删除计划测试
- [ ] 列表查询测试

**性能优化**
- [ ] 列表分页
- [ ] 图片懒加载
- [ ] 缓存策略

---

## 四、Week 3：打卡与积分（第3周）

### 4.1 本周目标

- 实现快速打卡功能
- 实现积分获取逻辑
- 完成积分余额展示

### 4.2 每日任务分解

#### Day 13-14（周一、二）：打卡功能

**后端开发**
- [ ] 打卡 API 设计
- [ ] 打卡记录存储
- [ ] 连续打卡天数计算
- [ ] 打卡状态判断

**业务逻辑**
- [ ] 每日只能打卡一次
- [ ] 重复打卡提示
- [ ] 打卡时间记录

**交付物检查点**
```typescript
// 打卡 API
POST /plans/:id/complete
Response: {
  recordId: string;
  earnedStars: number;
  continuousDays: number;
  isNewRecord: boolean;
}
```

#### Day 15-16（周三、四）：积分系统

**后端开发**
- [ ] 积分记录表
- [ ] 积分余额计算
- [ ] 积分获取逻辑
- [ ] 积分历史查询

**业务逻辑**
- [ ] 任务完成奖励
- [ ] 连续打卡额外奖励
- [ ] 积分变动记录

**交付物检查点**
```typescript
// 积分相关 API
GET /stars/balance
GET /stars/history
POST /stars/calculate  // 计算应得积分
```

#### Day 17（周五）：前端集成

**首页开发**
- [ ] 今日任务列表
- [ ] 打卡按钮状态
- [ ] 打卡成功反馈
- [ ] 星星获得动画

**积分展示**
- [ ] 星星余额组件
- [ ] 今日可获星星计算
- [ ] 积分变动提示

**交付物检查点**
- 可完成打卡
- 星星实时更新
- 有成功反馈

#### Day 18-19（周末）：测试优化

**功能测试**
- [ ] 打卡流程测试
- [ ] 积分计算测试
- [ ] 连续天数测试
- [ ] 边界情况测试

**Bug修复**
- [ ] 修复发现的问题
- [ ] 优化用户体验

---

## 五、Week 4：今日看板与收尾（第4周）

### 5.1 本周目标

- 完成今日看板页面
- 完成迭代测试
- 准备迭代评审

### 5.2 每日任务分解

#### Day 20-22（周一、二、三）：今日看板

**页面开发**
- [ ] 首页框架
- [ ] 连续打卡卡片
- [ ] 今日统计组件
- [ ] 快捷入口导航

**数据集成**
- [ ] 今日任务数据
- [ ] 连续打卡天数
- [ ] 星星余额
- [ ] 进度计算

**交付物检查点**
```
首页结构：
├── Header（头像、问候语）
├── 连续打卡卡片
├── 今日统计（学习时间、星星余额）
├── 今日进度条
├── 快捷入口
├── 今日任务列表
└── 底部导航
```

#### Day 23-24（周四、五）：集成测试

**端到端测试**
- [ ] 注册 → 创建计划 → 打卡 → 获得积分
- [ ] 编辑计划 → 重新打卡
- [ ] 删除计划 → 数据一致性
- [ ] 多账号切换

**性能测试**
- [ ] 页面加载速度
- [ ] API 响应时间
- [ ] 内存占用

**Bug修复**
- [ ] P0 级 Bug 必须修复
- [ ] P1 级 Bug 尽量修复

#### Day 25-26（周末）：迭代收尾

**文档整理**
- [ ] API 文档更新
- [ ] 使用说明初稿
- [ ] 已知问题列表

**迭代评审准备**
- [ ] 演示环境部署
- [ ] 演示数据准备
- [ ] 演示脚本编写

**Day 27-28：迭代评审**
- [ ] 功能演示
- [ ] 收集反馈
- [ ] 迭代二计划调整

---

## 六、技术实现细节

### 6.1 数据库表结构（Week 1-2）

```sql
-- 用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL CHECK (role IN ('parent', 'child')),
    star_balance INTEGER DEFAULT 0,
    total_study_seconds INTEGER DEFAULT 0,
    continuous_days INTEGER DEFAULT 0,
    last_checkin_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 家庭表
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(20) UNIQUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 家庭成员关联表
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('owner', 'member')),
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- 学习计划表
CREATE TABLE study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category INTEGER NOT NULL CHECK (category BETWEEN 1 AND 13),
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('once', 'daily', 'weekly', 'monthly')),
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME,
    end_time TIME,
    reward_stars INTEGER DEFAULT 0,
    need_review BOOLEAN DEFAULT false,
    is_timed BOOLEAN DEFAULT false,
    estimated_minutes INTEGER,
    description TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 打卡记录表
CREATE TABLE plan_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES study_plans(id) ON DELETE CASCADE,
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    record_date DATE NOT NULL,
    actual_seconds INTEGER,
    earned_stars INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(plan_id, record_date)
);

-- 积分记录表
CREATE TABLE star_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('earn', 'spend')),
    source VARCHAR(50) NOT NULL,
    source_id UUID,
    description VARCHAR(200),
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 6.2 关键业务逻辑

#### 连续打卡计算

```typescript
async calculateContinuousDays(childId: string): Promise<number> {
  const today = new Date();
  let continuousDays = 0;
  let checkDate = new Date(today);
  
  while (true) {
    const hasRecord = await this.planRecordsRepository.findOne({
      where: {
        childId,
        record_date: checkDate,
        status: 'approved'
      }
    });
    
    if (hasRecord) {
      continuousDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return continuousDays;
}
```

#### 积分发放

```typescript
async earnStars(
  childId: string, 
  amount: number, 
  source: string,
  sourceId?: string
): Promise<void> {
  const user = await this.usersRepository.findOne(childId);
  const newBalance = user.star_balance + amount;
  
  // 更新余额
  await this.usersRepository.update(childId, {
    star_balance: newBalance
  });
  
  // 记录明细
  await this.starRecordsRepository.save({
    user_id: childId,
    amount,
    type: 'earn',
    source,
    source_id: sourceId,
    balance_after: newBalance
  });
}
```

---

## 七、测试计划

### 7.1 测试用例（核心流程）

| 用例ID | 场景 | 步骤 | 预期结果 |
|--------|------|------|----------|
| TC001 | 用户注册 | 1. 输入手机号<br>2. 设置密码<br>3. 选择角色 | 注册成功，自动登录 |
| TC002 | 创建计划 | 1. 进入学习计划页<br>2. 点击添加<br>3. 填写信息 | 计划创建成功，列表显示 |
| TC003 | 完成打卡 | 1. 在首页点击打卡<br>2. 确认完成 | 打卡成功，星星增加 |
| TC004 | 连续打卡 | 连续7天打卡 | 连续天数显示7，获得额外奖励 |
| TC005 | 编辑计划 | 1. 点击编辑<br>2. 修改标题<br>3. 保存 | 计划更新成功 |

### 7.2 测试环境

- **开发环境**：本地 Docker
- **测试环境**：云服务器（建议阿里云/腾讯云）
- **测试设备**：iOS + Android 真机

---

## 八、交付检查清单

### 8.1 功能检查

- [ ] 用户可注册/登录
- [ ] 家长可创建家庭
- [ ] 家长可添加学习计划
- [ ] 孩子可查看今日任务
- [ ] 孩子可完成打卡
- [ ] 打卡后星星余额增加
- [ ] 连续打卡天数正确计算
- [ ] 首页显示今日进度

### 8.2 质量检查

- [ ] 无 P0/P1 级 Bug
- [ ] 页面加载时间 < 2秒
- [ ] API 响应时间 < 500ms
- [ ] 代码审查通过

### 8.3 文档检查

- [ ] API 文档完整
- [ ] 数据库文档更新
- [ ] 部署文档可用

---

*文档结束*
