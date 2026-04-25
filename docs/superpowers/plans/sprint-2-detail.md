# 迭代二详细实施计划

**迭代周期**: Week 5-8（共4周）  
**迭代目标**: 体验增强 - 完善激励体系与数据可视化  
**交付标准**: 完整的用户端体验，支持内测

---

## 一、迭代概览

### 1.1 迭代范围

```
✅ 包含功能：
├── 计时器功能（正计时）
├── 周视图与今日看板优化
├── 统计图表模块（完成率/时长/科目）
├── 愿望清单与兑换
├── 成就系统（勋章墙）
└── 体验优化与动画

❌ 不包含功能：
├── 习惯养成模块
├── 成绩追踪
├── 家长审定中心
├── AI智能添加
└── 多端同步
```

### 1.2 工时估算

| 模块 | 后端(人日) | 前端(人日) | 设计(人日) | 总计 |
|------|-----------|-----------|-----------|------|
| 计时器 | 2 | 4 | 1 | 7 |
| 视图优化 | 1 | 3 | 1 | 5 |
| 统计图表 | 4 | 5 | 1 | 10 |
| 愿望清单 | 3 | 4 | 2 | 9 |
| 成就系统 | 3 | 4 | 2 | 9 |
| 动画优化 | 0 | 4 | 2 | 6 |
| 内测准备 | 1 | 2 | 1 | 4 |
| **合计** | **14** | **26** | **10** | **50** |

---

## 二、Week 5：计时器与视图优化（第5周）

### 2.1 本周目标

- 实现正计时功能
- 优化周视图交互
- 完善今日看板

### 2.2 每日任务分解

#### Day 29-31（周一、二、三）：计时器功能

**后端开发**
- [ ] 计时记录表设计
- [ ] 计时开始/暂停/结束 API
- [ ] 计时数据存储
- [ ] 与打卡记录关联

**API 设计**
```typescript
// 计时相关 API
POST /timer/start
Body: { planId: string }
Response: { sessionId: string, startTime: Date }

POST /timer/:sessionId/pause
Response: { elapsedSeconds: number }

POST /timer/:sessionId/resume
Response: { success: boolean }

POST /timer/:sessionId/stop
Body: { complete: boolean }
Response: { 
  elapsedSeconds: number, 
  earnedStars: number,
  recordId?: string 
}
```

**前端开发**
- [ ] 计时器页面设计
- [ ] 计时器组件（开始/暂停/停止）
- [ ] 计时状态管理（Pinia）
- [ ] 后台计时保持（App保活）

**计时器UI**
```
┌─────────────────────────────────────────┐
│  数学作业                    [✕]        │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│           00:23:45                      │
│                                         │
│         预计还需 21:15                  │
│                                         │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │           [  暂停  ]            │    │
│  └─────────────────────────────────┘    │
│                                         │
│         [  完成打卡  ]                  │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- 计时器可正常开始/暂停/停止
- 计时数据正确存储
- 计时结束可完成打卡

#### Day 32-33（周四、五）：视图优化

**周视图优化**
- [ ] 计划状态显示（待完成/已完成）
- [ ] 时间段展示
- [ ] 分类图标显示
- [ ] 快速打卡入口

**今日看板优化**
- [ ] 连续打卡火焰动画
- [ ] 星星余额卡片
- [ ] 今日进度可视化
- [ ] 空状态设计

**交互优化**
- [ ] 下拉刷新
- [ ] 上拉加载
- [ ] 列表项滑动操作

**交付物检查点**
- 周视图信息完整
- 今日看板视觉优化
- 交互流畅

#### Day 34-35（周末）：测试优化

**功能测试**
- [ ] 计时器准确性测试
- [ ] 后台运行测试
- [ ] 异常情况处理（来电/切换应用）

**Bug修复**
- [ ] 修复发现的问题

---

## 三、Week 6：统计图表（第6周）

### 3.1 本周目标

- 完成数据统计后端
- 完成图表前端展示
- 实现多维度分析

### 3.2 每日任务分解

#### Day 36-38（周一、二、三）：后端数据统计

**数据库表**
- [ ] statistics_daily 表（每日统计汇总）
- [ ] 统计计算任务（定时或实时）

**API 开发**
```typescript
// 统计相关 API
GET /statistics/summary?startDate=&endDate=
Response: {
  totalTasks: number,
  completedTasks: number,
  completionRate: number,
  totalStudySeconds: number,
  averageDailySeconds: number
}

GET /statistics/trends?days=7
Response: {
  dates: string[],
  completionRates: number[],
  taskCounts: number[]
}

GET /statistics/subjects?startDate=&endDate=
Response: {
  subjects: Array<{
    category: number,
    name: string,
    totalSeconds: number,
    percentage: number
  }>
}

GET /statistics/calendar?month=
Response: {
  days: Array<{
    date: string,
    completionRate: number,
    taskCount: number
  }>
}
```

**统计计算逻辑**
- [ ] 完成率计算
- [ ] 学习时长统计
- [ ] 科目分布统计
- [ ] 活跃时段分析

**交付物检查点**
- 统计数据准确
- API 响应快速

#### Day 39-40（周四、五）：前端图表

**图表库选型**
- [ ] 调研 uni-app 图表方案
- [ ] 选择：ucharts 或 echarts-for-weixin
- [ ] 集成图表组件

**图表开发**
- [ ] 完成率趋势图（折线图）
- [ ] 每日任务柱状图
- [ ] 科目分布饼图
- [ ] 学习日历热力图

**图表样式**
```css
/* 图表配色 */
--chart-primary: #4ECDC4;
--chart-secondary: #FFD93D;
--chart-tertiary: #FF6B6B;
--chart-quaternary: #6C5CE7;
```

**交付物检查点**
- 图表正确渲染
- 数据绑定正常
- 交互（tooltip）正常

#### Day 41-42（周末）：统计页完善

**页面整合**
- [ ] 时间维度切换（7天/30天）
- [ ] 核心数据卡片
- [ ] 图表布局优化
- [ ] 空状态处理

**性能优化**
- [ ] 图表懒加载
- [ ] 数据缓存
- [ ] 减少重绘

---

## 四、Week 7：愿望清单与成就（第7周）

### 4.1 本周目标

- 实现愿望清单功能
- 实现成就系统
- 完成积分与成就页

### 4.2 每日任务分解

#### Day 43-45（周一、二、三）：愿望清单

**后端开发**

**数据库表**
```sql
-- 愿望清单表
CREATE TABLE wishes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    icon VARCHAR(50),
    required_stars INTEGER NOT NULL,
    repeat_type VARCHAR(20) CHECK (repeat_type IN ('once', 'weekly', 'monthly', 'unlimited')),
    remaining_times INTEGER DEFAULT 1,
    exchanged_times INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 兑换记录表
CREATE TABLE exchange_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wish_id UUID REFERENCES wishes(id) ON DELETE CASCADE,
    child_id UUID REFERENCES users(id) ON DELETE CASCADE,
    consumed_stars INTEGER NOT NULL,
    exchanged_at TIMESTAMP DEFAULT NOW()
);
```

**API 开发**
```typescript
// 愿望相关 API
GET /wishes
POST /wishes
PUT /wishes/:id
DELETE /wishes/:id
POST /wishes/:id/exchange
GET /wishes/exchange-records
```

**前端开发**
- [ ] 愿望列表页
- [ ] 添加愿望弹窗
- [ ] 兑换确认弹窗
- [ ] 兑换成功动画

**愿望卡片设计**
```
┌─────────────────────────────────────────┐
│                                         │
│  🎮 游戏时间30分钟                       │
│                                         │
│  每周可兑换2次                           │
│  剩余 2/2 次                             │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│           20⭐   [立即兑换]              │
│                                         │
└─────────────────────────────────────────┘
```

**交付物检查点**
- 可创建愿望
- 可兑换愿望
- 星星扣除正确
- 兑换记录完整

#### Day 46-47（周四、五）：成就系统

**后端开发**

**数据库表**
```sql
-- 成就定义表
CREATE TABLE achievement_defs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    icon VARCHAR(50),
    category VARCHAR(20),
    levels JSONB -- [{level: 1, name: '青铜', condition: 10, reward: 5}, ...]
);

-- 用户成就表
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievement_defs(id),
    current_level INTEGER DEFAULT 0,
    progress INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);
```

**成就解锁逻辑**
```typescript
// 成就检查示例
async checkStudyMasterAchievement(childId: string): Promise<void> {
  const completedPlans = await this.planRecordsRepository.count({
    where: { childId, status: 'approved' }
  });
  
  const achievement = await this.achievementDefsRepository.findOne({
    where: { code: 'study_master' }
  });
  
  // 检查各等级条件
  for (const level of achievement.levels) {
    if (completedPlans >= level.condition) {
      await this.unlockAchievementLevel(childId, achievement.id, level.level);
    }
  }
}
```

**前端开发**
- [ ] 成就勋章墙
- [ ] 成就卡片组件
- [ ] 成就详情弹窗
- [ ] 解锁动画效果

**成就卡片设计**
```
已解锁：
┌────┐
│ 🏆 │
│    │
│ LV3│
└────┘
金色渐变背景

未解锁：
┌────┐
│ 🔒 │
│    │
│ ???│
└────┘
灰色背景
```

**交付物检查点**
- 成就正确解锁
- 勋章墙展示正常
- 解锁有动画反馈

#### Day 48-49（周末）：积分与成就页

**页面开发**
- [ ] Tab 切换组件
- [ ] 星星余额卡片（渐变+动画）
- [ ] 积分历史列表
- [ ] 今日可获星星进度

**动画效果**
- [ ] 星星获得飞入动画
- [ ] 成就解锁庆祝动画
- [ ] 兑换成功彩带效果

---

## 五、Week 8：优化与内测准备（第8周）

### 5.1 本周目标

- 完成体验优化
- 准备内测版本
- 收集早期反馈

### 5.2 每日任务分解

#### Day 50-52（周一、二、三）：体验优化

**交互动画**
- [ ] 页面转场动画
- [ ] 按钮点击反馈
- [ ] 列表加载动画
- [ ] 下拉刷新动画

**动画实现清单**
```css
/* 页面入场 */
.page-enter { animation: slideUp 0.3s ease-out; }

/* 按钮点击 */
.btn:active { transform: scale(0.96); }

/* 列表入场 */
.list-item { animation: fadeInUp 0.4s ease-out; }

/* 星星获得 */
.star-earned { animation: starFly 0.6s bounce; }

/* 成就解锁 */
.achievement-unlock { animation: achievementPop 0.8s spring; }
```

**错误处理**
- [ ] 网络错误提示
- [ ] 操作失败提示
- [ ] 空状态优化
- [ ] 加载状态统一

**性能优化**
- [ ] 图片懒加载
- [ ] 列表虚拟滚动（如需要）
- [ ] API 请求合并
- [ ] 缓存策略优化

#### Day 53-54（周四、五）：内测准备

**测试账号**
- [ ] 创建测试家庭账号
- [ ] 准备测试数据（计划、打卡记录）

**测试环境**
- [ ] 部署测试服务器
- [ ] 配置测试数据库
- [ ] 配置测试域名

**使用说明**
- [ ] 编写内测指南
- [ ] 常见问题解答
- [ ] 反馈收集渠道（微信群/表单）

**内测邀请**
- [ ] 确定内测用户（3-5组家庭）
- [ ] 发送邀请和安装包
- [ ] 收集初步反馈

#### Day 55-56（周末）：迭代评审

**迭代总结**
- [ ] 功能清单核对
- [ ] Bug 统计与分析
- [ ] 性能数据收集

**迭代评审会**
- [ ] 完整功能演示
- [ ] 内测反馈分享
- [ ] 迭代三计划调整

**文档更新**
- [ ] 更新 API 文档
- [ ] 更新使用手册
- [ ] 更新项目文档

---

## 六、技术实现细节

### 6.1 成就系统详细设计

#### 成就定义

```typescript
// 成就定义配置
const ACHIEVEMENT_DEFINITIONS = [
  {
    code: 'study_master',
    name: '学习达人',
    description: '累计完成学习计划',
    icon: '📚',
    category: 'study',
    levels: [
      { level: 1, name: '青铜', condition: 10, reward: 5 },
      { level: 2, name: '白银', condition: 50, reward: 15 },
      { level: 3, name: '黄金', condition: 100, reward: 30 },
      { level: 4, name: '钻石', condition: 200, reward: 50 }
    ]
  },
  {
    code: 'streak_champion',
    name: '连胜冠军',
    description: '连续打卡天数',
    icon: '🔥',
    category: 'streak',
    levels: [
      { level: 1, name: '青铜', condition: 3, reward: 5 },
      { level: 2, name: '白银', condition: 7, reward: 10 },
      { level: 3, name: '黄金', condition: 30, reward: 30 },
      { level: 4, name: '钻石', condition: 100, reward: 100 }
    ]
  },
  {
    code: 'reading_star',
    name: '阅读之星',
    description: '累计阅读时长',
    icon: '📖',
    category: 'habit',
    levels: [
      { level: 1, name: '青铜', condition: 300, reward: 5 },  // 分钟
      { level: 2, name: '白银', condition: 1800, reward: 15 },
      { level: 3, name: '黄金', condition: 3600, reward: 30 },
      { level: 4, name: '钻石', condition: 7200, reward: 50 }
    ]
  },
  {
    code: 'early_bird',
    name: '早起鸟',
    description: '早起打卡次数',
    icon: '🌅',
    category: 'habit',
    levels: [
      { level: 1, name: '青铜', condition: 5, reward: 5 },
      { level: 2, name: '白银', condition: 15, reward: 10 },
      { level: 3, name: '黄金', condition: 30, reward: 20 },
      { level: 4, name: '钻石', condition: 60, reward: 40 }
    ]
  }
];
```

#### 成就检查触发点

```typescript
// 在以下操作后检查成就
const ACHIEVEMENT_TRIGGERS = {
  PLAN_COMPLETED: ['study_master'],
  DAILY_CHECKIN: ['streak_champion'],
  TIMER_FINISHED: ['study_master'],
  READING_RECORDED: ['reading_star'],
  EARLY_WAKEUP: ['early_bird']
};
```

### 6.2 图表组件配置

#### 完成率趋势图

```javascript
// ucharts 配置示例
const trendChartOpts = {
  type: 'line',
  color: ['#4ECDC4'],
  padding: [15, 15, 0, 15],
  dataLabel: false,
  dataPointShape: true,
  xAxis: {
    disableGrid: true,
    labelCount: 7
  },
  yAxis: {
    min: 0,
    max: 100,
    format: '{value}%'
  },
  extra: {
    line: {
      type: 'curve',
      width: 3
    }
  }
};
```

#### 科目分布饼图

```javascript
const pieChartOpts = {
  type: 'pie',
  color: ['#4ECDC4', '#FFD93D', '#FF6B6B', '#6C5CE7', '#00B894'],
  padding: [5, 5, 5, 5],
  dataLabel: true,
  extra: {
    pie: {
      activeOpacity: 0.5,
      offsetAngle: 0,
      ringWidth: 30,
      labelWidth: 15
    }
  }
};
```

---

## 七、内测计划

### 7.1 内测目标

- 验证核心功能稳定性
- 收集用户体验反馈
- 发现边界情况问题
- 优化产品细节

### 7.2 内测用户

| 家庭 | 孩子年龄 | 使用场景 | 关注点 |
|------|----------|----------|--------|
| 家庭A | 8岁 | 小学低年级 | 易用性、趣味性 |
| 家庭B | 12岁 | 小学高年级 | 功能完整性 |
| 家庭C | 10岁 | 多科目学习 | 计划管理 |
| 家庭D | 6岁 | 习惯养成 | 简单操作 |
| 家庭E | 14岁 | 初中学习 | 时间管理 |

### 7.3 内测任务

**每日任务**
- 创建当日学习计划
- 完成打卡
- 查看统计数据

**探索任务**
- 创建周期计划
- 使用计时器
- 兑换愿望
- 查看成就

### 7.4 反馈收集

| 维度 | 问题示例 |
|------|----------|
| 功能 | 功能是否满足需求？ |
| 易用 | 孩子能否独立使用？ |
| 性能 | 是否卡顿、闪退？ |
| 视觉 | 界面是否美观？ |
| 激励 | 星星/成就是否有动力？ |

---

## 八、交付检查清单

### 8.1 功能检查

- [ ] 计时器功能正常
- [ ] 统计图表正确显示
- [ ] 愿望清单可兑换
- [ ] 成就系统可解锁
- [ ] 动画效果流畅

### 8.2 质量检查

- [ ] 无严重 Bug
- [ ] 页面加载 < 2秒
- [ ] 图表渲染流畅
- [ ] 动画不卡顿

### 8.3 内测准备

- [ ] 测试环境就绪
- [ ] 测试账号创建
- [ ] 使用说明编写
- [ ] 反馈渠道建立

---

*文档结束*
