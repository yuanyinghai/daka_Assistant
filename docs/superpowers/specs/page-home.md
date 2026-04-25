# 首页（今日看板）设计文档

**页面名称**: 首页 / 今日看板  
**页面类型**: 核心页面  
**适用角色**: 孩子端（主要）+ 家长端  
**更新日期**: 2026-04-24

---

## 一、页面概述

### 1.1 设计目标

首页是孩子每天打开应用的第一屏，需要：
- **一目了然**：今日任务、进度、奖励清晰可见
- **激励驱动**：通过连续打卡、星星余额激发动力
- **快速行动**：一键开始任务，减少操作步骤

### 1.2 用户场景

| 场景 | 用户行为 | 设计支持 |
|------|----------|----------|
| 早晨查看 | 看看今天有什么任务 | 顶部今日概览 |
| 完成任务 | 打卡获得星星 | 任务卡片操作区 |
| 查看进度 | 了解完成情况 | 进度条、统计数据 |
| 兑换奖励 | 用星星换愿望 | 快捷入口 |

---

## 二、页面结构

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  [头像] 你好，小明！          [通知🔔]   │
├─────────────────────────────────────────┤
│  连续打卡卡片                           │
│  🔥 12天连续打卡  + 累计完成156个计划    │
├─────────────────────────────────────────┤
│  今日统计网格                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 学习时间 │ │ 户外时间 │ │ 星星余额 │ │
│  │  2.5小时 │ │  1小时   │ │   86⭐   │ │
│  └──────────┘ └──────────┘ └──────────┘ │
├─────────────────────────────────────────┤
│  今日进度                               │
│  已完成 5/8 任务  [==========>    ] 62% │
├─────────────────────────────────────────┤
│  快捷入口                               │
│  [📊统计] [🏆成就] [📈成绩] [🎁愿望]    │
├─────────────────────────────────────────┤
│  今日任务列表                           │
│  ─────────────────────────────────────  │
│  ⏱️ 数学作业    16:00-17:00  [开始]     │
│  ✅ 英语朗读    已完成 16:30  +3⭐      │
│  ⏳ 钢琴练习    待审核        ⏳        │
│  ─────────────────────────────────────  │
├─────────────────────────────────────────┤
│  习惯打卡                               │
│  [早睡] [阅读] [运动] [喝水]            │
├─────────────────────────────────────────┤
│  Bottom Nav                             │
│  [🏠首页] [📚计划] [📊统计] [👤我的]    │
└─────────────────────────────────────────┘
```

---

## 三、模块详细设计

### 3.1 Header 区域

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐                                 │
│  │ 👦 │  你好，小明！    🌅 上午好      │
│  └────┘                                 │
│                                         │
└─────────────────────────────────────────┘
```

#### 元素规范
| 元素 | 规格 | 说明 |
|------|------|------|
| 头像 | 40x40px，圆形 | 点击跳转个人中心 |
| 问候语 | 18px，600字重 | 根据时间变化：早上/下午/晚上好 |
| 用户名 | 同问候语 | 孩子昵称 |
| 通知图标 | 24px | 红点提示未读消息 |

#### 交互
- 头像点击：跳转「我的」页面
- 通知点击：展开消息列表
- 下拉刷新：刷新今日数据

---

### 3.2 连续打卡卡片

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  🔥 12天连续打卡                        │
│                                         │
│  累计完成 156 个计划                    │
│                                         │
│  [🔥][🔥][🔥][🔥][🔥][🔥][🔥] 本周打卡  │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.streak-card {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  border-radius: 16px;
  padding: 20px;
  color: white;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.3);
}

.streak-card__number {
  font-size: 36px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
}

.streak-card__flame {
  animation: flame 1.5s ease-in-out infinite;
}
```

#### 交互
- 卡片点击：查看连续打卡详情
- 火焰图标：悬停/点击有放大动画
- 本周打卡：显示最近7天打卡状态

---

### 3.3 今日统计网格

#### 视觉设计
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   ⏱️        │ │   🌳        │ │   ⭐        │
│             │ │             │ │             │
│   学习时间   │ │   户外时间   │ │   星星余额   │
│             │ │             │ │             │
│   2.5小时   │ │    1小时    │ │     86      │
│   +0.5小时  │ │   目标达成   │ │   本周+12   │
└─────────────┘ └─────────────┘ └─────────────┘
```

#### 样式规范
```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}

.stat-card--time .stat-card__icon {
  background: #E8F5E9;
  color: #4CAF50;
}

.stat-card--outdoor .stat-card__icon {
  background: #E3F2FD;
  color: #2196F3;
}

.stat-card--star .stat-card__icon {
  background: #FFF8E1;
  color: #FFC107;
}
```

#### 数据展示
| 卡片 | 主数据 | 副数据 | 图标 |
|------|--------|--------|------|
| 学习时间 | 今日累计时长 | 较昨日变化 | ⏱️ |
| 户外时间 | 今日累计时长 | 目标完成度 | 🌳 |
| 星星余额 | 当前总数 | 本周新增 | ⭐ |

---

### 3.4 今日进度

#### 视觉设计
```
今日进度
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
已完成 5/8 任务
[████████████████████░░░░░░░░░░░░░░░░] 62%

预计还可获得：15⭐
```

#### 样式规范
```css
.progress-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
}

.progress-bar {
  height: 12px;
  background: #F1F3F4;
  border-radius: 6px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar__fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4 0%, #44A08D 100%);
  border-radius: 6px;
  transition: width 0.6s ease;
}

.progress-bar__fill--star {
  background: linear-gradient(90deg, #FFD93D 0%, #F4C430 100%);
}
```

#### 交互
- 进度条：完成任务时动画填充
- 点击区域：展开任务完成详情

---

### 3.5 快捷入口

#### 视觉设计
```
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  📊    │ │  🏆    │ │  📈    │ │  🎁    │
│        │ │        │ │        │ │        │
│  统计  │ │  成就  │ │  成绩  │ │  愿望  │
└────────┘ └────────┘ └────────┘ └────────┘
```

#### 样式规范
```css
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.quick-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s;
}

.quick-action:active {
  transform: scale(0.95);
}

.quick-action__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 8px;
}

.quick-action__label {
  font-size: 12px;
  color: #636E72;
}
```

#### 入口配置
| 图标 | 名称 | 跳转页面 | 角标 |
|------|------|----------|------|
| 📊 | 统计 | 图表统计页 | - |
| 🏆 | 成就 | 成就勋章页 | 新解锁数量 |
| 📈 | 成绩 | 成绩追踪页 | - |
| 🎁 | 愿望 | 愿望清单页 | 可兑换数量 |

---

### 3.6 今日任务列表

#### 视觉设计
```
今日任务                    [查看全部 >]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────┐
│ 📐 数学作业                    +5⭐  │
│    16:00 - 17:00    预计45分钟       │
│                              [开始]  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ✅ 英语朗读                    +3⭐  │
│    已完成 16:30    用时25分钟        │
│                              [已完]  │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ ⏳ 钢琴练习                    +4⭐  │
│    待家长审核                        │
│                              [审核]  │
└──────────────────────────────────────┘
```

#### 任务卡片状态

**状态 A：待开始**
```css
.task-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #4ECDC4;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.task-card__action {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}
```

**状态 B：已完成**
```css
.task-card--completed {
  background: #E8F8F5;
  border-left-color: #00B894;
  opacity: 0.9;
}

.task-card--completed .task-card__action {
  background: #00B894;
}
```

**状态 C：待审核**
```css
.task-card--pending {
  background: #FFF9E6;
  border-left-color: #FDCB6E;
}

.task-card__pending-badge {
  background: #FDCB6E;
  color: #856404;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
```

#### 任务卡片结构
| 元素 | 说明 |
|------|------|
| 分类图标 | 13种分类对应不同图标/颜色 |
| 任务名称 | 16px，主文字色 |
| 时间段 | 12px，次要文字色 |
| 预计时长 | 12px，次要文字色 |
| 奖励星星 | 黄色标签，右侧 |
| 操作按钮 | 根据状态变化 |

#### 分类图标映射
| 分类 | 图标 | 颜色 |
|------|------|------|
| 语文 | 📖 | #E74C3C |
| 数学 | 📐 | #3498DB |
| 英语 | 🔤 | #9B59B6 |
| 科学 | 🔬 | #1ABC9C |
| 艺术 | 🎨 | #E91E63 |
| 音乐 | 🎵 | #FF5722 |
| 体育 | ⚽ | #4CAF50 |
| 阅读 | 📚 | #795548 |
| 编程 | 💻 | #607D8B |
| 写作 | ✏️ | #FF9800 |
| 背诵 | 🧠 | #3F51B5 |
| 练习 | ✍️ | #009688 |
| 其他 | 📋 | #757575 |

---

### 3.7 习惯打卡

#### 视觉设计
```
习惯打卡                    [管理 >]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   🌙     │ │   📖     │ │   🏃     │ │   💧     │
│          │ │          │ │          │ │          │
│   早睡   │ │   阅读   │ │   运动   │ │   喝水   │
│   +2⭐   │ │   +1⭐   │ │   +3⭐   │ │   +1⭐   │
│          │ │          │ │          │ │          │
│  [打卡]  │ │  [已打]  │ │  [打卡]  │ │  [已打]  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

#### 样式规范
```css
.habit-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.habit-card {
  background: white;
  border-radius: 12px;
  padding: 12px 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.habit-card__icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.habit-card__name {
  font-size: 12px;
  color: #2D3436;
  margin-bottom: 2px;
}

.habit-card__reward {
  font-size: 11px;
  color: #F4C430;
  margin-bottom: 8px;
}

.habit-card__btn {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.habit-card__btn--todo {
  background: #4ECDC4;
  color: white;
}

.habit-card__btn--done {
  background: #E8F8F5;
  color: #00B894;
}
```

---

### 3.8 底部导航

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│   🏠        📚        📊        👤      │
│   首页      计划      统计      我的     │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid #F1F3F4;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
}

.nav-item__icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: color 0.2s;
}

.nav-item__label {
  font-size: 11px;
  transition: color 0.2s;
}

.nav-item--active .nav-item__icon,
.nav-item--active .nav-item__label {
  color: #4ECDC4;
}

.nav-item:not(.nav-item--active) {
  color: #B2BEC3;
}
```

---

## 四、交互流程

### 4.1 任务打卡流程

```
用户点击[开始计时]
        ↓
进入计时页面
        ↓
计时结束 / 用户点击完成
        ↓
判断是否需要家长审核
        ↓
是 → 显示"待审核"状态 → 通知家长
否 → 星星直接到账 → 显示获得动画
        ↓
更新首页数据
```

### 4.2 习惯打卡流程

```
用户点击[打卡]
        ↓
播放打卡动画（图标放大+星星飞入）
        ↓
按钮状态变为[已打卡]
        ↓
星星余额实时更新
        ↓
连续打卡天数+1（如果是当日首次）
```

### 4.3 下拉刷新

```
用户下拉页面
        ↓
显示刷新动画（旋转星星）
        ↓
重新获取今日数据
        ↓
数据更新，卡片重新入场动画
```

---

## 五、空状态设计

### 5.1 无任务状态

```
┌─────────────────────────────────────────┐
│                                         │
│              🌟                         │
│                                         │
│         今天还没有计划哦                │
│                                         │
│    快去添加今天的学习计划吧！           │
│                                         │
│         [+ 添加计划]                    │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 网络错误状态

```
┌─────────────────────────────────────────┐
│                                         │
│              📡                         │
│                                         │
│         网络开小差了                    │
│                                         │
│    请检查网络连接后重试                 │
│                                         │
│         [重新加载]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 六、响应式适配

### 6.1 小屏手机（<375px）

- 统计网格改为 3列紧凑布局
- 快捷入口改为 4列图标更小
- 任务卡片减少内边距

### 6.2 大屏手机（>414px）

- 增加卡片内边距
- 习惯打卡可显示更多项
- 更大的点击区域

### 6.3 平板（>768px）

- 左右分栏布局
- 左侧：今日概览 + 快捷入口
- 右侧：任务列表 + 习惯打卡

---

## 七、动画规格

### 7.1 页面入场

```css
/* 卡片依次入场 */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: slideUp 0.5s ease-out forwards;
}

/* 延迟序列 */
.card-enter:nth-child(1) { animation-delay: 0ms; }
.card-enter:nth-child(2) { animation-delay: 100ms; }
.card-enter:nth-child(3) { animation-delay: 200ms; }
```

### 7.2 星星获得

```css
@keyframes starFly {
  0% {
    transform: scale(0) translateY(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) translateY(-20px);
    opacity: 1;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
```

### 7.3 进度条填充

```css
@keyframes progressGrow {
  from { width: 0%; }
  to { width: var(--progress); }
}

.progress-bar__fill {
  animation: progressGrow 0.8s ease-out;
}
```

---

*文档结束*
