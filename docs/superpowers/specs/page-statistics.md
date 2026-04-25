# 图表统计页设计文档

**页面名称**: 图表统计  
**页面类型**: 数据展示页面  
**适用角色**: 孩子端 + 家长端  
**更新日期**: 2026-04-24

---

## 一、页面概述

### 1.1 设计目标

通过可视化的数据展示，帮助家长和孩子：
- **量化成长**：将学习成果转化为直观的数据
- **发现规律**：了解学习活跃时段和习惯
- **激励持续**：通过趋势对比激发学习动力

### 1.2 设计原则

- **孩子友好**：使用图标、颜色、动画让数据更易懂
- **家长专业**：提供详细的数据分析和对比
- **多维度**：时间维度（日/周/月）+ 内容维度（科目/任务类型）

---

## 二、页面结构

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  学习统计                               │
├─────────────────────────────────────────┤
│  时间维度切换                           │
│  [最近7天] [最近30天] [本学期]          │
├─────────────────────────────────────────┤
│  核心数据卡片                           │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ 总任务 │ │ 已完成 │ │ 完成率 │      │
│  │  45    │ │  38    │ │  84%   │      │
│  └────────┘ └────────┘ └────────┘      │
├─────────────────────────────────────────┤
│  总时长统计                             │
│  累计学习 128小时  日均 4.2小时         │
├─────────────────────────────────────────┤
│  完成率趋势图                           │
│  ┌─────────────────────────────────┐    │
│  │    📈 折线图/柱状图              │    │
│  │                                 │    │
│  │  100% ┤    ╱╲                   │    │
│  │   80% ┤   ╱  ╲    ╱╲            │    │
│  │   60% ┤  ╱    ╲  ╱  ╲           │    │
│  │   40% ┤ ╱      ╲╱    ╲          │    │
│  │       └────────────────────     │    │
│  │        一 二 三 四 五 六 日      │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  每日任务分布                           │
│  ┌─────────────────────────────────┐    │
│  │    ████ 柱状图                  │    │
│  │    ████                         │    │
│  │    ████  ████                   │    │
│  │    ████  ████  ████             │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  科目分布                               │
│  ┌─────────────────────────────────┐    │
│  │      🥧 饼图/环形图             │    │
│  │                                 │    │
│  │      数学 35%                   │    │
│  │      英语 28%                   │    │
│  │      语文 20%                   │    │
│  │      其他 17%                   │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  最活跃时段                             │
│  下午 14:00-16:00 是最高效的学习时间    │
├─────────────────────────────────────────┤
│  学习日历                               │
│  日 一 二 三 四 五 六                   │
│     1  2  3  4  5  6                    │
│  7  8  9  10 11 12 13                   │
│  ...                                    │
│  (颜色深浅表示完成度)                   │
└─────────────────────────────────────────┘
```

---

## 三、模块详细设计

### 3.1 时间维度切换

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ 最近7天 │ │ 最近30天│ │ 本学期  │   │
│  │  ●    │ │         │ │         │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.time-tabs {
  display: flex;
  gap: 12px;
  padding: 4px;
  background: #F1F3F4;
  border-radius: 12px;
}

.time-tab {
  flex: 1;
  padding: 12px 16px;
  text-align: center;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #636E72;
  transition: all 0.2s;
}

.time-tab--active {
  background: white;
  color: #2D3436;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-weight: 600;
}
```

---

### 3.2 核心数据卡片

#### 视觉设计
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│             │ │             │ │             │
│    📋       │ │    ✅       │ │    📊       │
│             │ │             │ │             │
│   总任务    │ │   已完成    │ │   完成率    │
│             │ │             │ │             │
│     45      │ │     38      │ │    84%      │
│             │ │             │ │             │
│  +5 较上周  │ │  +3 较上周  │ │  +6% 较上周 │
│             │ │             │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
```

#### 样式规范
```css
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px 12px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.stat-card__icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px;
}

.stat-card:nth-child(1) .stat-card__icon {
  background: #E3F2FD;
  color: #2196F3;
}

.stat-card:nth-child(2) .stat-card__icon {
  background: #E8F5E9;
  color: #4CAF50;
}

.stat-card:nth-child(3) .stat-card__icon {
  background: #FFF3E0;
  color: #FF9800;
}

.stat-card__label {
  font-size: 13px;
  color: #636E72;
  margin-bottom: 8px;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #2D3436;
  font-family: 'Quicksand', sans-serif;
  margin-bottom: 4px;
}

.stat-card__change {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 10px;
  display: inline-block;
}

.stat-card__change--up {
  background: #E8F5E9;
  color: #4CAF50;
}

.stat-card__change--down {
  background: #FFEBEE;
  color: #F44336;
}
```

---

### 3.3 总时长统计

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ⏱️ 累计学习时长                         │
│                                         │
│        128.5 小时                       │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  日均 4.2小时    最久 6.5小时（周三）    │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.duration-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  color: white;
  margin-bottom: 20px;
}

.duration-section__label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.duration-section__value {
  font-size: 42px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
  margin-bottom: 16px;
}

.duration-section__divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px 0;
}

.duration-section__stats {
  display: flex;
  justify-content: space-between;
}

.duration-section__stat {
  text-align: center;
}

.duration-section__stat-value {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.duration-section__stat-label {
  font-size: 12px;
  opacity: 0.8;
}
```

---

### 3.4 完成率趋势图

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  完成率趋势                    [7天▼]   │
├─────────────────────────────────────────┤
│                                         │
│   100% ┤ ─────────────────────          │
│        │         ╱╲                     │
│    80% ┤    ●   ╱  ╲    ●               │
│        │       ╱    ╲  ╱  ╲             │
│    60% ┤  ●   ╱      ╲╱    ●            │
│        │     ╱              ╲           │
│    40% ┤    ╱                ●          │
│        │   ╱                            │
│    20% ┤  ╱                             │
│        └────────────────────────────    │
│          一  二  三  四  五  六  日      │
│                                         │
│  平均完成率：75%    最高：100%（周五）   │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.chart-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.chart-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.chart-card__title {
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
}

.chart-card__dropdown {
  padding: 8px 12px;
  background: #F1F3F4;
  border-radius: 8px;
  font-size: 13px;
  color: #636E72;
}

.chart-container {
  height: 200px;
  position: relative;
}

/* 折线图样式 */
.line-chart {
  width: 100%;
  height: 100%;
}

.line-chart__line {
  fill: none;
  stroke: url(#gradient-line);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.line-chart__area {
  fill: url(#gradient-area);
  opacity: 0.3;
}

.line-chart__point {
  fill: white;
  stroke: #4ECDC4;
  stroke-width: 3;
  r: 6;
}

.line-chart__point--active {
  r: 8;
  fill: #4ECDC4;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #F1F3F4;
}

.chart-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #636E72;
}

.chart-legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
```

---

### 3.5 每日任务分布柱状图

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  每日任务完成情况                       │
├─────────────────────────────────────────┤
│                                         │
│   10 ┤                                 │
│    8 ┤      ████                       │
│    6 ┤      ████  ████                 │
│    4 ┤ ████ ████  ████  ████           │
│    2 ┤ ████ ████  ████  ████  ████     │
│    0 └────────────────────────────     │
│        一  二  三  四  五  六  日       │
│                                         │
│  总计：45个任务   日均：6.4个           │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 180px;
  padding: 0 10px;
}

.bar-chart__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-chart__bar {
  width: 24px;
  background: linear-gradient(180deg, #4ECDC4 0%, #44A08D 100%);
  border-radius: 6px 6px 0 0;
  transition: height 0.6s ease;
  position: relative;
}

.bar-chart__bar--completed {
  background: linear-gradient(180deg, #00B894 0%, #00A383 100%);
}

.bar-chart__bar--partial {
  background: linear-gradient(180deg, #FDCB6E 0%, #F4C430 100%);
}

.bar-chart__value {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  font-weight: 600;
  color: #2D3436;
}

.bar-chart__label {
  margin-top: 8px;
  font-size: 12px;
  color: #636E72;
}
```

---

### 3.6 科目分布饼图

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  科目时间分布                           │
├─────────────────────────────────────────┤
│                                         │
│         ╭──────────╮                    │
│        ╱   数学    ╲                   │
│       │    35%     │                   │
│       │  ┌────┐    │                   │
│       │  │ 📐 │    │                   │
│        ╲ └────┘   ╱                    │
│         ╰──────────╯                    │
│                                         │
│  ┌────┐ 数学      35%   ████████       │
│  ┌────┐ 英语      28%   ██████░░       │
│  ┌────┐ 语文      20%   ████░░░░       │
│  ┌────┐ 其他      17%   ███░░░░░       │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.pie-chart-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
}

.pie-chart {
  width: 180px;
  height: 180px;
  margin: 0 auto 24px;
  position: relative;
}

.pie-chart__center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.pie-chart__center-value {
  font-size: 24px;
  font-weight: 700;
  color: #2D3436;
}

.pie-chart__center-label {
  font-size: 12px;
  color: #636E72;
}

.subject-legend {
  display: grid;
  gap: 12px;
}

.subject-legend__item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subject-legend__icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.subject-legend__info {
  flex: 1;
}

.subject-legend__name {
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 2px;
}

.subject-legend__bar {
  height: 6px;
  background: #F1F3F4;
  border-radius: 3px;
  overflow: hidden;
}

.subject-legend__bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s ease;
}

.subject-legend__percent {
  font-size: 14px;
  font-weight: 600;
  color: #636E72;
  min-width: 40px;
  text-align: right;
}
```

---

### 3.7 最活跃时段

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  学习活跃时段分析                       │
├─────────────────────────────────────────┤
│                                         │
│  🌅 早晨 06:00-12:00    12%  ██░░░░░░   │
│  ☀️ 下午 12:00-18:00    45%  ████████   │
│  🌙 晚上 18:00-24:00    35%  ██████░░   │
│  🌙 深夜 00:00-06:00     8%  █░░░░░░░   │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  💡 下午 14:00-16:00 是最高效的学习时间  │
│     建议将重要任务安排在这个时段         │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.time-analysis {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
}

.time-analysis__title {
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 20px;
}

.time-slot {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.time-slot__icon {
  font-size: 24px;
  margin-right: 12px;
  width: 32px;
}

.time-slot__label {
  width: 100px;
  font-size: 14px;
  color: #2D3436;
}

.time-slot__bar {
  flex: 1;
  height: 12px;
  background: #F1F3F4;
  border-radius: 6px;
  overflow: hidden;
  margin: 0 12px;
}

.time-slot__bar-fill {
  height: 100%;
  border-radius: 6px;
  background: linear-gradient(90deg, #4ECDC4 0%, #44A08D 100%);
  transition: width 0.8s ease;
}

.time-slot__percent {
  width: 40px;
  font-size: 14px;
  font-weight: 600;
  color: #636E72;
  text-align: right;
}

.time-analysis__insight {
  background: #E8F8F5;
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
}

.time-analysis__insight-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.time-analysis__insight-text {
  font-size: 14px;
  color: #2D3436;
  line-height: 1.6;
}
```

---

### 3.8 学习日历

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  学习日历                    [2026年4月]│
├─────────────────────────────────────────┤
│                                         │
│  日    一    二    三    四    五    六 │
│                                         │
│           1     2     3     4     5     │
│        ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐   │
│        │   │ │███│ │███│ │░░░│ │███│   │
│        └───┘ └───┘ └───┘ └───┘ └───┘   │
│   6     7     8     9    10    11    12 │
│ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│ │███│ │███│ │░░░│ │███│ │███│ │░░░│    │
│ └───┘ └───┘ └───┘ └───┘ └───┘ └───┘    │
│  ...                                    │
│                                         │
│  图例：███ 高完成  ░░░ 低完成  □ 无计划  │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.calendar-section {
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-title {
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 16px;
}

.calendar-nav__month {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-weekday {
  text-align: center;
  font-size: 12px;
  color: #636E72;
  padding: 8px 0;
}

.calendar-day {
  aspect-ratio: 1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  position: relative;
  transition: transform 0.2s;
}

.calendar-day:hover {
  transform: scale(1.05);
}

.calendar-day--empty {
  background: transparent;
}

.calendar-day--none {
  background: #F8F9FA;
  color: #B2BEC3;
}

.calendar-day--low {
  background: #FFF3E0;
  color: #E65100;
}

.calendar-day--medium {
  background: #E3F2FD;
  color: #1565C0;
}

.calendar-day--high {
  background: #E8F5E9;
  color: #2E7D32;
}

.calendar-day--today {
  border: 2px solid #4ECDC4;
}

.calendar-day__tasks {
  position: absolute;
  bottom: 4px;
  font-size: 10px;
  color: inherit;
  opacity: 0.7;
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #F1F3F4;
}

.calendar-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #636E72;
}

.calendar-legend__color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}
```

---

## 四、空状态设计

### 4.1 无数据状态

```
┌─────────────────────────────────────────┐
│                                         │
│              📊                         │
│                                         │
│         还没有统计数据                  │
│                                         │
│    完成第一个学习计划后                 │
│    这里将展示你的学习分析               │
│                                         │
│         [去添加计划]                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 五、动画效果

### 5.1 数字增长动画

```css
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card__value {
  animation: countUp 0.6s ease-out;
}
```

### 5.2 图表绘制动画

```css
@keyframes drawLine {
  from {
    stroke-dashoffset: 1000;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.line-chart__line {
  stroke-dasharray: 1000;
  animation: drawLine 1.5s ease-out;
}
```

### 5.3 柱状图增长动画

```css
@keyframes growUp {
  from {
    transform: scaleY(0);
  }
  to {
    transform: scaleY(1);
  }
}

.bar-chart__bar {
  transform-origin: bottom;
  animation: growUp 0.8s ease-out;
}
```

---

*文档结束*
