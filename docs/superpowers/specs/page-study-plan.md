# 学习计划页设计文档

**页面名称**: 学习计划  
**页面类型**: 核心页面  
**适用角色**: 家长端（主要）+ 孩子端（查看）  
**更新日期**: 2026-04-24

---

## 一、页面概述

### 1.1 设计目标

学习计划页是家长管理孩子学习任务的核心界面：
- **清晰管理**：周视图展示，一目了然
- **灵活创建**：支持多种计划类型和批量操作
- **智能辅助**：AI创建、艾宾浩斯复习计划

### 1.2 用户场景

| 场景 | 用户行为 | 设计支持 |
|------|----------|----------|
| 制定周计划 | 查看整周安排，合理分配任务 | 周视图展示 |
| 添加任务 | 创建新的学习计划 | 多种添加方式 |
| 调整计划 | 修改、删除、移动任务 | 编辑操作 |
| 查看总览 | 了解所有计划分布 | 总预览模式 |

---

## 二、页面结构

```
┌─────────────────────────────────────────┐
│  Header                                 │
│  学习计划                    [➕添加]   │
├─────────────────────────────────────────┤
│  周视图导航                             │
│  [一][二][三][四][五][六][日]           │
│   今天  4月24日  第17周                  │
├─────────────────────────────────────────┤
│  快捷操作栏                             │
│  [📋批量添加] [🤖AI创建] [👁️总预览]     │
├─────────────────────────────────────────┤
│  计划列表                               │
│  ─────────────────────────────────────  │
│  ┌──────────────────────────────────┐   │
│  │ 📐 数学作业              16:00   │   │
│  │ 复习第3章，完成练习册P25-28      │   │
│  │ 计时任务 · 45分钟 · +5⭐        │   │
│  │                        [编辑]   │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │ 🔤 英语单词背诵          19:00   │   │
│  │ 艾宾浩斯复习计划                 │   │
│  │ 快速完成 · +3⭐ · 需审核        │   │
│  │                        [编辑]   │   │
│  └──────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  空状态/底部提示                        │
└─────────────────────────────────────────┘
```

---

## 三、模块详细设计

### 3.1 周视图导航

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  一    二    三    四    五    六    日 │
│  21    22    23   [24]   25    26    27 │
│         2     1    3     2     0     0  │
│                                         │
│  今天 · 4月24日 · 第17周                │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.week-nav {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
}

.week-nav__days {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.week-day {
  flex: 1;
  text-align: center;
  padding: 12px 4px;
  border-radius: 12px;
  transition: background 0.2s;
}

.week-day__label {
  font-size: 12px;
  color: #636E72;
  margin-bottom: 4px;
}

.week-day__date {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
}

.week-day__count {
  font-size: 11px;
  color: #4ECDC4;
  background: #E8F8F5;
  padding: 2px 6px;
  border-radius: 8px;
  display: inline-block;
}

.week-day--active {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
}

.week-day--active .week-day__label,
.week-day--active .week-day__date {
  color: white;
}

.week-day--active .week-day__count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.week-day--today .week-day__date {
  color: #4ECDC4;
}
```

#### 交互
- 点击日期：切换到该日计划
- 左右滑动：切换周
- 长按日期：快速添加该日计划

---

### 3.2 快捷操作栏

#### 视觉设计
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌─────────────┐ ┌─────────────┐        │
│  │   📋        │ │   🤖        │        │
│  │  批量添加   │ │  AI创建     │        │
│  └─────────────┘ └─────────────┘        │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │        👁️ 查看总预览             │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.quick-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.action-btn {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.action-btn:active {
  transform: translateY(2px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.action-btn__icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.action-btn__text {
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
}

.action-btn--primary {
  background: linear-gradient(135deg, #FFD93D 0%, #F4C430 100%);
}

.action-btn--primary .action-btn__text {
  color: white;
}
```

---

### 3.3 计划卡片

#### 视觉设计

**标准计划卡片**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐ 数学作业              16:00    │
│  │ 📐 │  复习第3章，完成练习册P25-28   │
│  └────┘                                 │
│  ─────────────────────────────────────  │
│  ⏱️ 计时任务 · 45分钟 · +5⭐   [编辑]   │
│                                         │
└─────────────────────────────────────────┘
```

**艾宾浩斯计划卡片**
```
┌─────────────────────────────────────────┐
│                                         │
│  ┌────┐ 英语单词背诵          19:00    │
│  │ 🔤 │  🧠 艾宾浩斯复习计划            │
│  └────┘  第1/8次复习 · 下次：4月25日   │
│  ─────────────────────────────────────  │
│  ⚡ 快速完成 · +3⭐ · 需审核   [编辑]   │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.plan-card {
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-left: 4px solid var(--category-color);
}

.plan-card__header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}

.plan-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--category-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 12px;
}

.plan-card__info {
  flex: 1;
}

.plan-card__title {
  font-size: 16px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 4px;
}

.plan-card__desc {
  font-size: 13px;
  color: #636E72;
  line-height: 1.5;
}

.plan-card__time {
  font-size: 14px;
  font-weight: 600;
  color: #4ECDC4;
}

.plan-card__divider {
  height: 1px;
  background: #F1F3F4;
  margin: 12px 0;
}

.plan-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.plan-card__tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.plan-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
}

.plan-tag--timer {
  background: #E3F2FD;
  color: #2196F3;
}

.plan-tag--quick {
  background: #E8F5E9;
  color: #4CAF50;
}

.plan-tag--review {
  background: #FFF3E0;
  color: #FF9800;
}

.plan-tag--reward {
  background: #FFF8E1;
  color: #F4C430;
}

.plan-tag--audit {
  background: #FCE4EC;
  color: #E91E63;
}

.plan-card__action {
  padding: 8px 16px;
  background: #F8F9FA;
  border-radius: 8px;
  font-size: 13px;
  color: #636E72;
}
```

#### 分类颜色映射
```css
:root {
  --category-chinese: #E74C3C;
  --category-chinese-bg: #FDEDEC;
  
  --category-math: #3498DB;
  --category-math-bg: #EBF5FB;
  
  --category-english: #9B59B6;
  --category-english-bg: #F5EEF8;
  
  --category-science: #1ABC9C;
  --category-science-bg: #E8F8F5;
  
  --category-art: #E91E63;
  --category-art-bg: #FCE4EC;
  
  --category-music: #FF5722;
  --category-music-bg: #FBE9E7;
  
  --category-sport: #4CAF50;
  --category-sport-bg: #E8F5E9;
  
  --category-reading: #795548;
  --category-reading-bg: #EFEBE9;
  
  --category-code: #607D8B;
  --category-code-bg: #ECEFF1;
  
  --category-writing: #FF9800;
  --category-writing-bg: #FFF3E0;
  
  --category-memory: #3F51B5;
  --category-memory-bg: #E8EAF6;
  
  --category-practice: #009688;
  --category-practice-bg: #E0F2F1;
  
  --category-other: #757575;
  --category-other-bg: #F5F5F5;
}
```

---

### 3.4 添加计划弹窗

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  添加学习计划                    [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  计划名称 *                             │
│  ┌─────────────────────────────────┐    │
│  │ 例如：数学作业                   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  分类                                   │
│  ┌────┐┌────┐┌────┐┌────┐┌────┐        │
│  │ 📐 ││ 🔤 ││ 📖 ││ 🔬 ││ 🎨 │        │
│  │数学││英语││语文││科学││艺术│        │
│  └────┘└────┘└────┘└────┘└────┘        │
│                                         │
│  计划类型                               │
│  ┌─────────────┐ ┌─────────────┐       │
│  │  单次计划   │ │  周期计划   │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  日期              时间                 │
│  ┌───────────┐    ┌───────────┐        │
│  │ 2026-04-24│    │ 16:00-17:00       │
│  └───────────┘    └───────────┘        │
│                                         │
│  计时设置                               │
│  ┌─────────────┐ ┌─────────────┐       │
│  │ ⏱️ 需要计时 │ │ ⚡ 快速完成 │       │
│  └─────────────┘ └─────────────┘       │
│                                         │
│  预计时长                               │
│  ┌─────────────────────────────────┐    │
│  │ 45 分钟                          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  奖励星星                               │
│  ┌─────────────────────────────────┐    │
│  │ ⭐ 5 颗                          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  需要家长审核                           │
│  ┌─────────────────────────────────┐    │
│  │ 完成后需要家长审核通过才发放星星  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [      确认添加      ]                 │
│                                         │
└─────────────────────────────────────────┘
```

#### 样式规范
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F1F3F4;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2D3436;
  margin-bottom: 8px;
  display: block;
}

.form-label__required {
  color: #FF6B6B;
}

.form-input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #F1F3F4;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #4ECDC4;
  outline: none;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.category-item {
  aspect-ratio: 1;
  border-radius: 12px;
  background: #F8F9FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: all 0.2s;
}

.category-item__icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.category-item__label {
  font-size: 11px;
  color: #636E72;
}

.category-item--selected {
  background: var(--category-bg);
  border: 2px solid var(--category-color);
}

.category-item--selected .category-item__label {
  color: var(--category-color);
  font-weight: 600;
}

.type-selector {
  display: flex;
  gap: 12px;
}

.type-option {
  flex: 1;
  padding: 16px;
  border: 2px solid #F1F3F4;
  border-radius: 12px;
  text-align: center;
  transition: all 0.2s;
}

.type-option--selected {
  border-color: #4ECDC4;
  background: #E8F8F5;
}

.type-option__icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.type-option__label {
  font-size: 14px;
  font-weight: 600;
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  color: white;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 24px;
}
```

---

### 3.5 AI创建弹窗

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  AI智能创建计划                  [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  告诉AI你想创建什么计划：                │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │ 例如：                          │    │
│  │ • 每天背诵10个英语单词，持续30天  │    │
│  │ • 每周一三五练习钢琴1小时         │    │
│  │ • 按照艾宾浩斯曲线复习古诗        │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  或上传课程表图片：                      │
│  ┌─────────────────────────────────┐    │
│  │      📷 点击上传课程表          │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [      🤖 生成学习计划      ]          │
│                                         │
│  ─────────────────────────────────────  │
│  💡 AI会根据你的描述自动生成合理的计划   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.6 批量添加界面

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  批量添加计划                    [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  日期：2026年4月24日（周四）            │
│                                         │
│  计划列表                               │
│  ┌─────────────────────────────────┐    │
│  │ 📐 数学作业    16:00  45分钟  ✕ │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 🔤 英语朗读    17:00  30分钟  ✕ │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────────────────────┐    │
│  │ 🎹 钢琴练习    19:00  60分钟  ✕ │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [+ 添加一项]                           │
│                                         │
│  应用到本周所有工作日                   │
│  ┌─────────────────────────────────┐    │
│  │ ☑️ 周一到周五都添加这些计划       │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [      确认批量添加      ]             │
│                                         │
└─────────────────────────────────────────┘
```

---

### 3.7 总预览模式

#### 视觉设计
```
┌─────────────────────────────────────────┐
│  计划总预览                      [✕]    │
├─────────────────────────────────────────┤
│                                         │
│  第17周（4月21日 - 4月27日）            │
│                                         │
│  周一      周二      周三      周四     │
│  ┌───┐   ┌───┐   ┌───┐   ┌───┐        │
│  │📐 │   │📐 │   │📐 │   │📐 │        │
│  │🔤 │   │🔤 │   │🔤 │   │🔤 │        │
│  │🎹 │   │   │   │🎹 │   │🎹 │        │
│  └───┘   └───┘   └───┘   └───┘        │
│                                         │
│  周五      周六      周日               │
│  ┌───┐   ┌───┐   ┌───┐                │
│  │📐 │   │   │   │   │                │
│  │🔤 │   │   │   │   │                │
│  │   │   │   │   │   │                │
│  └───┘   └───┘   └───┘                │
│                                         │
│  图例：📐数学 🔤英语 🎹钢琴 📖语文      │
│                                         │
└─────────────────────────────────────────┘
```

---

## 四、交互流程

### 4.1 添加计划流程

```
点击[添加]按钮
      ↓
弹出添加弹窗
      ↓
填写计划信息
      ↓
点击[确认添加]
      ↓
验证表单
      ↓
成功 → 关闭弹窗 → 刷新列表 → 显示成功提示
失败 → 显示错误信息
```

### 4.2 编辑计划流程

```
点击计划卡片[编辑]
      ↓
弹出编辑弹窗（预填充数据）
      ↓
修改计划信息
      ↓
点击[保存修改]
      ↓
确认修改（如有进行中的记录需提示）
      ↓
保存成功 → 刷新列表
```

### 4.3 删除计划流程

```
点击计划卡片[编辑]
      ↓
点击[删除计划]
      ↓
确认弹窗："确定删除该计划？已完成的记录将保留"
      ↓
确认 → 删除成功 → 刷新列表
取消 → 返回编辑弹窗
```

---

## 五、空状态设计

### 5.1 当日无计划

```
┌─────────────────────────────────────────┐
│                                         │
│              📋                         │
│                                         │
│         这一天还没有计划                │
│                                         │
│    点击"添加"创建第一个学习计划         │
│                                         │
│         [+ 添加计划]                    │
│                                         │
└─────────────────────────────────────────┘
```

### 5.2 整周无计划

```
┌─────────────────────────────────────────┐
│                                         │
│              🎯                         │
│                                         │
│         本周还没有学习计划              │
│                                         │
│    制定计划，让学习更有条理！           │
│                                         │
│      [批量添加]  [AI创建]               │
│                                         │
└─────────────────────────────────────────┘
```

---

## 六、艾宾浩斯复习计划

### 6.1 创建艾宾浩斯计划

当用户选择艾宾浩斯类型时，显示特殊配置：

```
┌─────────────────────────────────────────┐
│  艾宾浩斯复习设置                       │
├─────────────────────────────────────────┤
│                                         │
│  复习内容 *                             │
│  ┌─────────────────────────────────┐    │
│  │ 例如：英语单词Unit 1-5           │    │
│  └─────────────────────────────────┘    │
│                                         │
│  首次学习日期                           │
│  ┌─────────────────────────────────┐    │
│  │ 2026-04-24                      │    │
│  └─────────────────────────────────┘    │
│                                         │
│  复习周期预览                           │
│  ┌─────────────────────────────────┐    │
│  │ 第1次：4月24日（今天）首次学习    │    │
│  │ 第2次：4月25日（1天后）          │    │
│  │ 第3次：4月27日（2天后）          │    │
│  │ 第4次：5月1日（4天后）           │    │
│  │ 第5次：5月9日（8天后）           │    │
│  │ 第6次：5月25日（16天后）         │    │
│  │ 第7次：6月26日（32天后）         │    │
│  │ 第8次：8月28日（64天后）         │    │
│  └─────────────────────────────────┘    │
│                                         │
│  每次复习奖励：3⭐                      │
│                                         │
└─────────────────────────────────────────┘
```

---

*文档结束*
