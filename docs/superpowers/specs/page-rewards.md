# 积分与成就页设计文档

**页面名称**: 积分与成就  
**页面类型**: 激励中心页面  
**适用角色**: 孩子端（主要）+ 家长端  
**更新日期**: 2026-04-24

---

## 一、页面概述

### 1.1 设计目标

积分与成就页是产品的核心激励模块：
- **即时反馈**：清晰展示星星余额和获取途径
- **成就驱动**：通过勋章墙激发孩子的成就感
- **愿望激励**：用可兑换的愿望驱动持续学习

### 1.2 设计原则

- **游戏化体验**：像游戏一样有收集、升级的乐趣
- **可视化进度**：进度条、百分比让目标清晰可见
- **庆祝时刻**：获得成就、兑换愿望时有仪式感

---

## 二、页面结构

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  积分与成就                             │
├─────────────────────────────────────────┤
│  星星余额卡片                           │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │        ⭐ 256                   │    │
│  │      我的星星                   │    │
│  │                                 │    │
│  │  本周 +28  |  本月 +86  |  消费 45 │  │
│  │                                 │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  今日可获取星星                         │
│  还有 15⭐ 可以获得                     │
│  ┌─────────────────────────────────┐    │
│  │ ████████████████████░░░░░░░░░░░ │    │
│  │ 已完成 5/8 任务                 │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  Tab 切换                               │
│  [🏆 成就勋章] [📜 积分历史] [🎁 愿望清单]│
├─────────────────────────────────────────┤
│  成就勋章墙                             │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │ 🏆 │ │ 🥇 │ │ 📚 │ │ ⏰ │           │
│  │学习│ │连胜│ │阅读│ │早起│           │
│  │达人│ │冠军│ │之星│ │鸟  │           │
│  └────┘ └────┘ └────┘ └────┘           │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│  │ 🔒 │ │ 🔒 │ │ 🔒 │ │ 🔒 │           │
│  │未解│ │未解│ │未解│ │未解│           │
│  │锁  │ │锁  │ │锁  │ │锁  │           │
│  └────┘ └────┘ └────┘ └────┘           │
├─────────────────────────────────────────┤
│  积分历史（Tab内容）                    │
│  ┌─────────────────────────────────┐    │
│  │ ➕ 完成数学作业        +5⭐ 今天 │    │
│  │ ➕ 连续打卡7天         +10⭐ 昨天│    │
│  │ ➖ 兑换周末看电影      -30⭐ 昨天│    │
│  │ ➕ 英语朗读完成        +3⭐ 前天 │    │
│  └─────────────────────────────────┘    │
├─────────────────────────────────────────┤
│  愿望清单（Tab内容）                    │
│  ┌─────────────────────────────────┐    │
│  │ 🎮 游戏时间30分钟      20⭐ [兑]│    │
│  │ 🍦 冰淇淋一份          15⭐ [兑]│    │
│  │ 🎬 周末看电影          30⭐ [兑]│    │
│  │ 🔒 去游乐园            100⭐    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

## 三、模块详细设计

### 3.1 星星余额卡片

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│              ⭐                         │
│                                         │
│            256                          │
│          我的星星                       │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│   本周 +28      本月 +86      已消费 45 │
│                                         │
│         [查看积分明细 >]                │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.star-balance-card {
  background: linear-gradient(135deg, #FFD93D 0%, #F4C430 50%, #FF6B6B 100%);
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
  color: white;
  box-shadow: 0 8px 32px rgba(255, 217, 61, 0.4);
  position: relative;
  overflow: hidden;
}

.star-balance-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

.star-balance-card__icon {
  font-size: 48px;
  margin-bottom: 8px;
  animation: float 2s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.star-balance-card__amount {
  font-size: 56px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
  margin-bottom: 4px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.star-balance-card__label {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.star-balance-card__divider {
  height: 1px;
  background: rgba(255,255,255,0.3);
  margin: 20px 0;
}

.star-balance-card__stats {
  display: flex;
  justify-content: space-around;
}

.star-balance-card__stat {
  text-align: center;
}

.star-balance-card__stat-value {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.star-balance-card__stat-label {
  font-size: 12px;
  opacity: 0.8;
}
```

---

### 3.2 今日可获取星星

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  今日还可获得 15⭐                      │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │████████████████████░░░░░░░░░░░░░│    │
│  └─────────────────────────────────┘    │
│                                         │
│  已完成 5/8 任务    完成率 62%          │
│                                         │
│  剩余任务：                             │
│  • 数学作业（+5⭐）                     │
│  • 钢琴练习（+4⭐）                     │
│  • 阅读30分钟（+3⭐）                    │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.today-progress {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-top: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.today-progress__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.today-progress__title {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
}

.today-progress__amount {
  font-size: 18px;
  font-weight: 700;
  color: #F4C430;
}

.today-progress__bar {
  height: 12px;
  background: #F1F3F4;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
}

.today-progress__bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #FFD93D 0%, #F4C430 100%);
  border-radius: 6px;
  transition: width 0.6s ease;
  position: relative;
}

.today-progress__bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: progressShine 2s ease-in-out infinite;
}

@keyframes progressShine {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.today-progress__info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #636E72;
  margin-bottom: 16px;
}

.today-progress__tasks {
  border-top: 1px solid #F1F3F4;
  padding-top: 16px;
}

.today-progress__tasks-title {
  font-size: 13px;
  font-weight: 600;
  color: #636E72;
  margin-bottom: 12px;
}

.today-progress__task-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #2D3436;
  margin-bottom: 8px;
}

.today-progress__task-reward {
  color: #F4C430;
  font-weight: 600;
}
```

---

### 3.3 Tab 切换

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌───────────┐ ┌───────────┐ ┌────────┐ │
│  │  🏆      │ │  📜      │ │  🎁    │ │
│  │  成就勋章 │ │  积分历史 │ │ 愿望清单│ │
│  │  ────   │ │          │ │        │ │
│  └───────────┘ └───────────┘ └────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.tabs {
  display: flex;
  gap: 8px;
  padding: 4px;
  background: #F1F3F4;
  border-radius: 16px;
  margin: 20px 0;
}

.tab {
  flex: 1;
  padding: 14px 8px;
  text-align: center;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #636E72;
  transition: all 0.2s;
  position: relative;
}

.tab--active {
  background: white;
  color: #2D3436;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  font-weight: 600;
}

.tab--active::after {
  content: '';
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #FFD93D;
  border-radius: 2px;
}

.tab__icon {
  display: block;
  font-size: 20px;
  margin-bottom: 4px;
}
```

---

### 3.4 成就勋章墙

#### 视觉设计

**已解锁成就**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐        │
│  │ 🏆 │  │ 🥇 │  │ 📚 │  │ ⏰ │        │
│  │    │  │    │  │    │  │    │        │
│  │ LV3│  │ LV2│  │ LV4│  │ LV1│        │
│  └────┘  └────┘  └────┘  └────┘        │
│  学习达人 连胜冠军 阅读之星 早起鸟       │
│                                         │
└─────────────────────────────────────────┘
```

**未解锁成就**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐        │
│  │ 🔒 │  │ 🔒 │  │ 🔒 │  │ 🔒 │        │
│  │    │  │    │  │    │  │    │        │
│  │ ???│  │ ???│  │ ???│  │ ???│        │
│  └────┘  └────┘  └────┘  └────┘        │
│  完成任务  全勤奖  运动健将  背诵达人    │
│  50个                 (点击解锁条件)     │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.achievement-card {
  aspect-ratio: 1;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  text-align: center;
  transition: transform 0.2s;
}

.achievement-card:active {
  transform: scale(0.95);
}

.achievement-card--unlocked {
  background: linear-gradient(135deg, #FFD93D 0%, #F4C430 100%);
  box-shadow: 0 4px 16px rgba(255, 217, 61, 0.3);
}

.achievement-card--locked {
  background: #F1F3F4;
}

.achievement-card__icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.achievement-card--unlocked .achievement-card__icon {
  animation: achievementGlow 2s ease-in-out infinite;
}

@keyframes achievementGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

.achievement-card__level {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  margin-bottom: 4px;
}

.achievement-card--unlocked .achievement-card__level {
  background: rgba(255,255,255,0.3);
  color: white;
}

.achievement-card--locked .achievement-card__level {
  background: #E0E0E0;
  color: #9E9E9E;
}

.achievement-card__name {
  font-size: 11px;
  line-height: 1.3;
}

.achievement-card--unlocked .achievement-card__name {
  color: white;
  font-weight: 500;
}

.achievement-card--locked .achievement-card__name {
  color: #9E9E9E;
}
```

#### 成就等级颜色
```css
/* 青铜 */
.achievement--bronze {
  background: linear-gradient(135deg, #CD7F32 0%, #E6A65C 100%);
}

/* 白银 */
.achievement--silver {
  background: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
}

/* 黄金 */
.achievement--gold {
  background: linear-gradient(135deg, #FFD700 0%, #FFE55C 100%);
}

/* 钻石 */
.achievement--diamond {
  background: linear-gradient(135deg, #B9F2FF 0%, #E0F7FF 100%);
}
```

---

### 3.5 成就详情弹窗

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│              ┌────┐                     │
│              │ 🏆 │                     │
│              │ LV3│                     │
│              └────┘                     │
│                                         │
│           学习达人                      │
│                                         │
│    累计完成100个学习计划                │
│                                         │
│    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│    ████████████████████████░░░░░░       │
│    78 / 100                             │
│                                         │
│    下一等级：学习大师（200个计划）       │
│    奖励：解锁后获得 50⭐                │
│                                         │
│         [  分享成就  ]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.6 积分历史列表

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  4月                                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ➕  完成数学作业                 │    │
│  │     任务奖励            +5⭐    │    │
│  │     今天 14:30                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ➕  连续打卡7天                  │    │
│  │     成就奖励           +10⭐    │    │
│  │     昨天 09:00                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ ➖  兑换周末看电影               │    │
│  │     愿望兑换           -30⭐    │    │
│  │     昨天 20:15                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  3月                                    │
│  ...                                    │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.history-list {
  background: white;
  border-radius: 20px;
  padding: 20px;
}

.history-month {
  font-size: 16px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 16px;
  padding-left: 8px;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #F8F9FA;
  border-radius: 12px;
  margin-bottom: 12px;
}

.history-item__icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-right: 12px;
}

.history-item--income .history-item__icon {
  background: #E8F5E9;
  color: #4CAF50;
}

.history-item--expense .history-item__icon {
  background: #FFEBEE;
  color: #F44336;
}

.history-item__content {
  flex: 1;
}

.history-item__title {
  font-size: 15px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 2px;
}

.history-item__type {
  font-size: 12px;
  color: #636E72;
}

.history-item__amount {
  font-size: 18px;
  font-weight: 700;
  font-family: 'Quicksand', sans-serif;
}

.history-item--income .history-item__amount {
  color: #4CAF50;
}

.history-item--expense .history-item__amount {
  color: #F44336;
}

.history-item__time {
  font-size: 11px;
  color: #B2BEC3;
  margin-top: 4px;
  text-align: right;
}
```

---

### 3.7 愿望清单

#### 视觉设计

**可兑换愿望**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🎮 游戏时间30分钟                │    │
│  │                                 │    │
│  │ 每周可兑换2次                   │    │
│  │ 剩余 2/2 次                     │    │
│  │                                 │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │           20⭐   [立即兑换]      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🍦 冰淇淋一份                    │    │
│  │                                 │    │
│  │ 每周可兑换1次                   │    │
│  │ 剩余 1/1 次                     │    │
│  │                                 │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │           15⭐   [立即兑换]      │    │
│  └─────────────────────────────────┘    │
│                                         │
```

**星星不足的愿望**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🔒 去游乐园                      │    │
│  │                                 │    │
│  │ 每月可兑换1次                   │    │
│  │ 剩余 1/1 次                     │    │
│  │                                 │    │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │          100⭐   [还差44⭐]      │    │
│  │                                 │    │
│  │ 再完成9个任务就能兑换啦！         │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.wish-list {
  display: grid;
  gap: 12px;
}

.wish-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}

.wish-card:active {
  transform: scale(0.98);
}

.wish-card--locked {
  opacity: 0.7;
}

.wish-card__header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.wish-card__icon {
  font-size: 32px;
  margin-right: 12px;
}

.wish-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
  flex: 1;
}

.wish-card__info {
  font-size: 13px;
  color: #636E72;
  margin-bottom: 8px;
}

.wish-card__remaining {
  font-size: 13px;
  color: #4ECDC4;
  font-weight: 500;
  margin-bottom: 16px;
}

.wish-card__divider {
  height: 1px;
  background: #F1F3F4;
  margin: 16px 0;
}

.wish-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wish-card__price {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 20px;
  font-weight: 700;
  color: #F4C430;
  font-family: 'Quicksand', sans-serif;
}

.wish-card__btn {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.wish-card__btn--available {
  background: linear-gradient(135deg, #FFD93D 0%, #F4C430 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(255, 217, 61, 0.3);
}

.wish-card__btn--locked {
  background: #F1F3F4;
  color: #B2BEC3;
}

.wish-card__hint {
  font-size: 12px;
  color: #FF6B6B;
  margin-top: 8px;
}
```

---

### 3.8 兑换成功弹窗

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│              🎉                         │
│                                         │
│         兑换成功！                      │
│                                         │
│    ┌────┐                               │
│    │ 🎮 │  游戏时间30分钟               │
│    └────┘                               │
│                                         │
│    消耗 20⭐                            │
│    剩余 236⭐                           │
│                                         │
│    剩余兑换次数：1/2                    │
│                                         │
│         [  太棒了  ]                    │
│                                         │
└─────────────────────────────────────────┘
```

#### 动画效果
```css
@keyframes celebration {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  70% {
    transform: scale(0.9) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.celebration-icon {
  animation: celebration 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes starBurst {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.star-burst {
  position: absolute;
  animation: starBurst 0.6s ease-out forwards;
}
```

---

## 四、成就系统设计

### 4.1 成就分类

| 类别 | 说明 | 示例 |
|------|------|------|
| **学习类** | 与学习任务相关 | 学习达人、科目专家 |
| **习惯类** | 与习惯养成相关 | 早起鸟、阅读之星 |
| **连续类** | 与连续行为相关 | 连胜冠军、全勤奖 |
| **特殊类** | 特殊里程碑 | 百日打卡、年度之星 |

### 4.2 成就等级

| 等级 | 名称 | 颜色 | 解锁条件示例 |
|------|------|------|--------------|
| 1 | 青铜 | 棕色 | 完成10个任务 |
| 2 | 白银 | 银色 | 完成50个任务 |
| 3 | 黄金 | 金色 | 完成100个任务 |
| 4 | 钻石 | 蓝色 | 完成200个任务 |

### 4.3 成就列表

| 成就名称 | 类别 | 等级1 | 等级2 | 等级3 | 等级4 |
|----------|------|-------|-------|-------|-------|
| 学习达人 | 学习 | 10个 | 50个 | 100个 | 200个 |
| 连胜冠军 | 连续 | 3天 | 7天 | 30天 | 100天 |
| 阅读之星 | 习惯 | 5本 | 20本 | 50本 | 100本 |
| 早起鸟 | 习惯 | 5天 | 15天 | 30天 | 60天 |
| 全勤奖 | 连续 | 7天 | 30天 | 100天 | 365天 |
| 数学专家 | 学习 | 10小时 | 50小时 | 100小时 | 200小时 |
| 英语达人 | 学习 | 10小时 | 50小时 | 100小时 | 200小时 |
| 运动健将 | 习惯 | 10次 | 30次 | 60次 | 100次 |

---

## 五、空状态设计

### 5.1 无成就状态

```
┌─────────────────────────────────────────┐
│                                         │
│              🏆                         │
│                                         │
│         还没有获得成就                  │
│                                         │
│    完成学习计划，解锁你的第一个成就     │
│                                         │
│         [去完成任务]                    │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 无愿望状态

```
┌─────────────────────────────────────────┐
│                                         │
│              🎁                         │
│                                         │
│         愿望清单是空的                  │
│                                         │
│    添加愿望，用星星兑换你想要的奖励     │
│                                         │
│         [添加愿望]                      │
│                                         │
└─────────────────────────────────────────┘
```

---

*文档结束*
