# 习惯养成页设计文档

**页面名称**: 习惯养成  
**页面类型**: 功能页面  
**适用角色**: 孩子端 + 家长端  
**更新日期**: 2026-04-24

---

## 一、页面概述

### 1.1 设计目标

习惯养成页帮助孩子建立良好习惯、纠正不良习惯：
- **正向激励**：奖励好习惯，强化积极行为
- **负向约束**：记录坏习惯，培养自我约束
- **可视化进度**：通过日历和统计看到坚持成果

### 1.2 设计原则

- **双轨并行**：好习惯和坏习惯分开管理
- **即时反馈**：打卡后立即显示奖励/扣分
- **长期追踪**：月度、年度视角看习惯养成

---

## 二、页面结构

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  习惯养成                    [➕添加]   │
├─────────────────────────────────────────┤
│  习惯统计卡片                           │
│  ┌─────────────┐ ┌─────────────┐       │
│  │   好习惯    │ │   坏习惯    │       │
│  │   8个       │ │   3个       │       │
│  │  本周+15⭐  │ │  本周-3⭐   │       │
│  └─────────────┘ └─────────────┘       │
├─────────────────────────────────────────┤
│  连续打卡日历                           │
│  4月 习惯打卡热力图                      │
│  日  一  二  三  四  五  六              │
│     1   2   3   4   5   6               │
│  7   8   9  10  11  12  13              │
│  ...                                    │
├─────────────────────────────────────────┤
│  Tab 切换                               │
│  [✅ 好习惯打卡] [⚠️ 坏习惯记录]        │
├─────────────────────────────────────────┤
│  好习惯列表                             │
│  ┌─────────────────────────────────┐    │
│  │ 🌙 早睡（22:00前）        +2⭐  │    │
│  │    本周 5/7  [已打卡]            │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 📖 阅读30分钟             +1⭐  │    │
│  │    今日 0/1  [打卡]              │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  坏习惯记录（Tab内容）                  │
│  ┌─────────────────────────────────┐    │
│  │ 🎮 玩游戏超时            -2⭐   │    │
│  │    本周发生 2 次  [记录]         │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 三、模块详细设计

### 3.1 习惯统计卡片

#### 视觉设计
```
┌─────────────────────┐ ┌─────────────────────┐
│                     │ │                     │
│         ✅          │ │         ⚠️          │
│                     │ │                     │
│      好习惯         │ │      坏习惯         │
│                     │ │                     │
│        8个          │ │        3个          │
│                     │ │                     │
│  ━━━━━━━━━━━━━━━━━  │ │  ━━━━━━━━━━━━━━━━━  │
│  本周 +15⭐         │ │  本周 -3⭐          │
│                     │ │                     │
└─────────────────────┘ └─────────────────────┘
```

#### 样式规范
```css
.habit-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.habit-stat-card {
  border-radius: 20px;
  padding: 24px 16px;
  text-align: center;
}

.habit-stat-card--positive {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
}

.habit-stat-card--negative {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
}

.habit-stat-card__icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.habit-stat-card__label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.habit-stat-card__count {
  font-size: 36px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
  margin-bottom: 16px;
}

.habit-stat-card__divider {
  height: 1px;
  background: rgba(255,255,255,0.3);
  margin: 16px 0;
}

.habit-stat-card__reward {
  font-size: 16px;
  font-weight: 600;
}
```

---

### 3.2 连续打卡日历

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  连续打卡日历                  [4月 ▼]  │
├─────────────────────────────────────────┤
│                                         │
│  日    一    二    三    四    五    六 │
│                                         │
│       [1]   [2]   [3]   [4]   [5]   [6] │
│  [7]  [8]   [9]  [10]  [11]  [12]  [13] │
│  ...                                    │
│                                         │
│  本月好习惯打卡 45 次                    │
│  连续打卡 12 天 🔥                       │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.habit-calendar {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
}

.habit-calendar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.habit-calendar__title {
  font-size: 18px;
  font-weight: 700;
  color: #2D3436;
}

.habit-calendar__month {
  padding: 8px 16px;
  background: #F1F3F4;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
}

.habit-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.habit-calendar__weekday {
  text-align: center;
  font-size: 12px;
  color: #636E72;
  padding: 8px 0;
}

.habit-calendar__day {
  aspect-ratio: 1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  transition: transform 0.2s;
}

.habit-calendar__day:hover {
  transform: scale(1.1);
}

.habit-calendar__day--empty {
  background: transparent;
}

.habit-calendar__day--none {
  background: #F8F9FA;
  color: #B2BEC3;
}

.habit-calendar__day--partial {
  background: #E8F8F5;
  color: #00B894;
}

.habit-calendar__day--full {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
}

.habit-calendar__day--today {
  border: 2px solid #FFD93D;
}

.habit-calendar__summary {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #F1F3F4;
}

.habit-calendar__stat {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #636E72;
  margin-bottom: 8px;
}

.habit-calendar__stat-value {
  font-weight: 700;
  color: #2D3436;
}
```

---

### 3.3 Tab 切换

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────────────────┐ ┌────────────────┐  │
│  │      ✅        │ │      ⚠️        │  │
│  │    好习惯打卡   │ │    坏习惯记录   │  │
│  │    ────────    │ │                │  │
│  └────────────────┘ └────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.habit-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.habit-tab {
  flex: 1;
  padding: 16px;
  background: white;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.2s;
}

.habit-tab--active {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
}

.habit-tab__icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.habit-tab__label {
  font-size: 14px;
  font-weight: 600;
}

.habit-tab--active .habit-tab__label {
  color: white;
}

.habit-tab:not(.habit-tab--active) .habit-tab__label {
  color: #636E72;
}
```

---

### 3.4 好习惯卡片

#### 视觉设计

**待打卡状态**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐ 早睡（22:00前）          +2⭐  │
│  │ 🌙 │                                 │
│  └────┘ 今日 0/1 次                     │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  本周打卡 5/7 天    连续 3 天 🔥         │
│                                         │
│                    [  打卡  ]            │
│                                         │
└─────────────────────────────────────────┘
```

**已打卡状态**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐ 阅读30分钟               +1⭐  │
│  │ 📖 │                                 │
│  └────┘ 今日 1/1 次 ✓                   │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  本周打卡 7/7 天    连续 12 天 🔥        │
│                                         │
│                    [  已打卡  ]          │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.habit-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.habit-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.habit-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: #E8F8F5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
}

.habit-card__info {
  flex: 1;
}

.habit-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
}

.habit-card__progress {
  font-size: 13px;
  color: #636E72;
}

.habit-card__progress--done {
  color: #00B894;
}

.habit-card__reward {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 700;
  color: #F4C430;
}

.habit-card__divider {
  height: 1px;
  background: #F1F3F4;
  margin: 16px 0;
}

.habit-card__stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.habit-card__stat {
  font-size: 13px;
  color: #636E72;
}

.habit-card__stat-value {
  font-weight: 600;
  color: #2D3436;
}

.habit-card__streak {
  display: flex;
  align-items: center;
  gap: 4px;
}

.habit-card__streak-icon {
  animation: flame 1.5s ease-in-out infinite;
}

.habit-card__btn {
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.habit-card__btn--todo {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.habit-card__btn--done {
  background: #E8F8F5;
  color: #00B894;
}
```

---

### 3.5 坏习惯记录卡片

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐ 玩游戏超时（>1小时）     -2⭐  │
│  │ 🎮 │                                 │
│  └────┘ 今日发生 0 次                   │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  本周发生 2 次    累计扣分 -4⭐          │
│                                         │
│  [记录发生]  [查看记录]                  │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.bad-habit-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border-left: 4px solid #FF6B6B;
}

.bad-habit-card__icon {
  background: #FFEBEE;
}

.bad-habit-card__penalty {
  color: #FF6B6B;
}

.bad-habit-card__actions {
  display: flex;
  gap: 12px;
}

.bad-habit-card__btn {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.bad-habit-card__btn--record {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
}

.bad-habit-card__btn--history {
  background: #F1F3F4;
  color: #636E72;
}
```

---

### 3.6 添加习惯弹窗

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  添加习惯                        [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  习惯类型                               │
│  ┌─────────────┐ ┌─────────────┐       │
│  │     ✅      │ │     ⚠️      │       │
│  │   好习惯    │ │   坏习惯    │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  习惯名称 *                             │
│  ┌─────────────────────────────────┐    │
│  │ 例如：早睡、阅读、运动           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  习惯图标                               │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐        │
│  │ 🌙 ││ 📖 ││ 🏃 ││ 💧 ││ 🥗 │        │
│  └────┘└────┘└────┘└────┘└────┘        │
│                                         │
│  每日频次                               │
│  ┌─────────────┐ ┌─────────────┐       │
│  │   每日一次   │ │  每日多次   │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  积分设置                               │
│  完成奖励 / 发生扣分                    │
│  ┌─────────────────────────────────┐    │
│  │ ⭐ 2 颗                          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  提醒时间（可选）                       │
│  ┌─────────────────────────────────┐    │
│  │ 21:30                           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [      确认添加      ]                 │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.7 打卡成功反馈

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│              ✅                         │
│                                         │
│         打卡成功！                      │
│                                         │
│    ┌────┐                               │
│    │ 🌙 │  早睡                          │
│    └────┘                               │
│                                         │
│    获得 +2⭐                            │
│    连续打卡 4 天 🔥                      │
│                                         │
│         [  太棒了  ]                    │
│                                         │
└─────────────────────────────────────────┘
```

#### 动画效果
```css
@keyframes habitCheck {
  0% {
    transform: scale(0) rotate(-45deg);
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

.habit-check-icon {
  animation: habitCheck 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes starFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.star-reward {
  animation: starFloat 1s ease-in-out infinite;
}
```

---

## 四、习惯类型设计

### 4.1 好习惯预设

| 图标 | 习惯名称 | 默认奖励 | 建议提醒时间 |
|------|----------|----------|--------------|
| 🌙 | 早睡 | +2⭐ | 21:30 |
| 📖 | 阅读 | +1⭐ | 20:00 |
| 🏃 | 运动 | +3⭐ | 16:00 |
| 💧 | 喝水 | +1⭐ | 不定时 |
| 🥗 | 吃蔬菜 | +2⭐ | 12:00 |
| 🧹 | 整理房间 | +2⭐ | 19:00 |
| 🦷 | 刷牙 | +1⭐ | 07:30/21:00 |
| 🎹 | 练琴 | +3⭐ | 18:00 |

### 4.2 坏习惯预设

| 图标 | 习惯名称 | 默认扣分 | 说明 |
|------|----------|----------|------|
| 🎮 | 玩游戏超时 | -2⭐ | >1小时 |
| 🍔 | 吃垃圾食品 | -1⭐ | 每次 |
| 😤 | 发脾气 | -2⭐ | 每次 |
| 📱 | 刷手机超时 | -2⭐ | >30分钟 |
| 🛏️ | 赖床 | -1⭐ | 超过规定时间 |

---

## 五、习惯统计维度

### 5.1 个人统计

- 本周打卡次数
- 本月打卡次数
- 连续打卡天数
- 累计获得/扣除星星
- 习惯完成率

### 5.2 习惯详情统计

- 该习惯总打卡次数
- 最长连续天数
- 月度完成趋势
- 平均完成时间

---

## 六、空状态设计

### 6.1 无好习惯

```
┌─────────────────────────────────────────┐
│                                         │
│              ✅                         │
│                                         │
│         还没有好习惯                    │
│                                         │
│    添加好习惯，开始培养优秀品质         │
│                                         │
│         [添加好习惯]                    │
│                                         │
└─────────────────────────────────────────┘
```

### 6.2 无坏习惯

```
┌─────────────────────────────────────────┐
│                                         │
│              🎉                         │
│                                         │
│         没有记录坏习惯                  │
│                                         │
│    继续保持，你是最棒的！               │
│                                         │
│         [添加坏习惯约束]                │
│                                         │
└─────────────────────────────────────────┘
```

---

*文档结束*
