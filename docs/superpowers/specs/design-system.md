# 智能学习管理助手 - 设计系统文档

**文档版本**: V1.0  
**更新日期**: 2026-04-24  
**适用平台**: 移动端 App (iOS/Android) + Web 管理后台

---

## 一、设计理念

### 1.1 设计愿景

打造一个**温暖、有趣且专业**的学习陪伴工具，让孩子爱上学习，让家长轻松管理。

### 1.2 设计原则

| 原则 | 说明 | 体现方式 |
|------|------|----------|
| **童趣但不幼稚** | 适合5-15岁年龄段，避免过于卡通化 | 圆润的圆角 + 克制的插画元素 |
| **正向激励** | 通过视觉反馈强化积极行为 | 星星动画、成就徽章、进度可视化 |
| **清晰分层** | 孩子端专注执行，家长端侧重管理 | 双端差异化布局 |
| **即时反馈** | 每次操作都有明确的视觉回应 | 微交互动画、状态变化 |

### 1.3 情绪板

```
关键词：温暖阳光、成长、星空探索、游戏化、亲子互动

视觉方向：
- 主色调：温暖的金黄色（星星、阳光）
- 辅助色：清新的蓝绿色（成长、平静）
- 点缀色：活力的珊瑚色（提醒、重要操作）
- 背景：柔和的渐变，营造梦幻氛围
```

---

## 二、色彩系统

### 2.1 主色调

```css
:root {
  /* 品牌主色 - 星光金 */
  --star-gold: #FFD93D;
  --star-gold-light: #FFE066;
  --star-gold-dark: #F4C430;
  
  /* 成长绿 */
  --growth-green: #4ECDC4;
  --growth-green-light: #7EDDD7;
  --growth-green-dark: #3DBBB3;
  
  /* 天空蓝 */
  --sky-blue: #6C5CE7;
  --sky-blue-light: #A29BFE;
  --sky-blue-dark: #5B4BC4;
}
```

### 2.2 功能色

```css
:root {
  /* 成功 - 翠绿 */
  --success: #00B894;
  --success-light: #55EFC4;
  --success-bg: #E8F8F5;
  
  /* 警告 - 暖橙 */
  --warning: #FDCB6E;
  --warning-light: #FFEAA7;
  --warning-bg: #FFF9E6;
  
  /* 错误 - 珊瑚红 */
  --error: #FF6B6B;
  --error-light: #FF8E8E;
  --error-bg: #FFEEEE;
  
  /* 信息 - 天蓝 */
  --info: #74B9FF;
  --info-light: #A8D8FF;
  --info-bg: #EBF5FF;
}
```

### 2.3 中性色

```css
:root {
  /* 文字颜色 */
  --text-primary: #2D3436;      /* 主文字 */
  --text-secondary: #636E72;    /* 次要文字 */
  --text-tertiary: #B2BEC3;     /* 辅助文字 */
  --text-inverse: #FFFFFF;      /* 反色文字 */
  
  /* 背景颜色 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --bg-tertiary: #F1F3F4;
  --bg-dark: #2D3436;
  
  /* 边框颜色 */
  --border-light: #E8EAEB;
  --border-medium: #DEE2E6;
  --border-dark: #CED4DA;
}
```

### 2.4 渐变色

```css
:root {
  /* 主渐变 - 星光 */
  --gradient-star: linear-gradient(135deg, #FFD93D 0%, #FF6B6B 50%, #6C5CE7 100%);
  
  /* 背景渐变 - 晨曦 */
  --gradient-dawn: linear-gradient(180deg, #FFF9E6 0%, #FFFFFF 100%);
  
  /* 背景渐变 - 星空 */
  --gradient-sky: linear-gradient(180deg, #E8F4F8 0%, #F8F9FA 100%);
  
  /* 成就渐变 */
  --gradient-bronze: linear-gradient(135deg, #CD7F32 0%, #E6A65C 100%);
  --gradient-silver: linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 100%);
  --gradient-gold: linear-gradient(135deg, #FFD700 0%, #FFE55C 100%);
  --gradient-diamond: linear-gradient(135deg, #B9F2FF 0%, #E0F7FF 100%);
}
```

---

## 三、字体系统

### 3.1 字体家族

```css
:root {
  /* 中文标题字体 */
  --font-display: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  
  /* 正文字体 */
  --font-body: 'PingFang SC', 'Microsoft YaHei', -apple-system, sans-serif;
  
  /* 数字字体 - 等宽 */
  --font-mono: 'SF Mono', 'Consolas', monospace;
  
  /* 英文装饰字体 */
  --font-decorative: 'Quicksand', 'Nunito', sans-serif;
}
```

### 3.2 字号规范

| 层级 | 字号 | 行高 | 字重 | 用途 |
|------|------|------|------|------|
| **H1** | 28px | 36px | 700 | 页面大标题 |
| **H2** | 24px | 32px | 700 | 模块标题 |
| **H3** | 20px | 28px | 600 | 卡片标题 |
| **H4** | 18px | 26px | 600 | 小标题 |
| **Body Large** | 16px | 24px | 400 | 重要正文 |
| **Body** | 14px | 22px | 400 | 默认正文 |
| **Caption** | 12px | 18px | 400 | 辅助说明 |
| **Small** | 10px | 14px | 400 | 标签、时间 |

### 3.3 字体样式

```css
/* 大标题 - 今日看板 */
.text-hero {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

/* 数字强调 - 星星数量、连续天数 */
.text-number {
  font-family: var(--font-decorative);
  font-size: 32px;
  font-weight: 700;
  color: var(--star-gold);
}

/* 标签文字 */
.text-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary);
}
```

---

## 四、间距系统

### 4.1 基础间距

```css
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;
  --space-4xl: 40px;
  --space-5xl: 48px;
}
```

### 4.2 组件间距

| 场景 | 间距值 | 示例 |
|------|--------|------|
| 卡片内边距 | 16px | 计划卡片 |
| 卡片间距 | 12px | 列表项之间 |
| 页面边距 | 20px | 屏幕左右边距 |
| 模块间距 | 24px | 不同模块之间 |
| 元素间距 | 8px | 图标与文字 |

---

## 五、圆角系统

```css
:root {
  --radius-sm: 4px;      /* 小标签、按钮 */
  --radius-md: 8px;      /* 输入框、小卡片 */
  --radius-lg: 12px;     /* 卡片、弹窗 */
  --radius-xl: 16px;     /* 大卡片、模块 */
  --radius-2xl: 20px;    /* 底部导航、特殊卡片 */
  --radius-full: 9999px; /* 圆形、胶囊按钮 */
}
```

---

## 六、阴影系统

```css
:root {
  /* 轻微阴影 - 静态元素 */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  /* 默认阴影 - 卡片 */
  --shadow-md: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  /* 悬浮阴影 - 可交互卡片 */
  --shadow-lg: 0 4px 16px rgba(0, 0, 0, 0.12);
  
  /* 强调阴影 - 按钮、重要元素 */
  --shadow-xl: 0 8px 24px rgba(0, 0, 0, 0.15);
  
  /* 彩色阴影 - 星星、成就 */
  --shadow-gold: 0 4px 16px rgba(255, 217, 61, 0.4);
  --shadow-green: 0 4px 16px rgba(78, 205, 196, 0.4);
}
```

---

## 七、组件规范

### 7.1 按钮

#### 主按钮
```css
.btn-primary {
  background: var(--gradient-star);
  color: var(--text-inverse);
  padding: 14px 28px;
  border-radius: var(--radius-full);
  font-size: 16px;
  font-weight: 600;
  box-shadow: var(--shadow-gold);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}
```

#### 次级按钮
```css
.btn-secondary {
  background: var(--bg-primary);
  color: var(--growth-green);
  border: 2px solid var(--growth-green);
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-size: 16px;
  font-weight: 600;
}
```

#### 图标按钮
```css
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-icon:active {
  background: var(--bg-tertiary);
}
```

### 7.2 卡片

#### 计划卡片
```css
.card-plan {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--growth-green);
}

.card-plan--completed {
  border-left-color: var(--success);
  background: var(--success-bg);
}

.card-plan--pending {
  border-left-color: var(--warning);
}
```

#### 统计卡片
```css
.card-stat {
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  box-shadow: var(--shadow-md);
  text-align: center;
}

.card-stat__number {
  font-size: 32px;
  font-weight: 700;
  color: var(--star-gold);
  font-family: var(--font-decorative);
}

.card-stat__label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}
```

### 7.3 输入框

```css
.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  border-color: var(--growth-green);
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
  outline: none;
}

.input-field::placeholder {
  color: var(--text-tertiary);
}
```

### 7.4 标签

```css
.tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
}

.tag--category {
  background: var(--info-bg);
  color: var(--info);
}

.tag--reward {
  background: var(--warning-bg);
  color: var(--star-gold-dark);
}

.tag--status {
  background: var(--success-bg);
  color: var(--success);
}
```

### 7.5 星星组件

```css
.star-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #FFF9E6 0%, #FFF5D6 100%);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  border: 1px solid var(--star-gold-light);
}

.star-display__icon {
  color: var(--star-gold);
  font-size: 18px;
}

.star-display__count {
  font-family: var(--font-decorative);
  font-size: 18px;
  font-weight: 700;
  color: var(--star-gold-dark);
}
```

---

## 八、图标系统

### 8.1 图标风格

- **风格**: 线性图标 + 面性图标结合
- **描边**: 2px
- **圆角**: 圆角端点
- **尺寸**: 16px(小)、20px(默认)、24px(大)、32px(超大)

### 8.2 核心图标

| 图标 | 用途 | 图标 | 用途 |
|------|------|------|------|
| ⭐ | 星星/积分 | 🏆 | 成就/奖杯 |
| 📚 | 学习计划 | ⏱️ | 计时器 |
| ✅ | 完成 | 📊 | 统计图表 |
| 🎯 | 目标 | 🎁 | 愿望清单 |
| 🌟 | 连续打卡 | 🔥 | 热门/连胜 |
| 👤 | 个人中心 | ⚙️ | 设置 |
| 🔔 | 通知 | ➕ | 添加 |

---

## 九、布局规范

### 9.1 页面结构

```
┌─────────────────────────────┐
│        Status Bar           │  24px
├─────────────────────────────┤
│        Header               │  56px
│  [Back]    Title    [Menu]  │
├─────────────────────────────┤
│                             │
│        Content Area         │  自适应
│                             │
├─────────────────────────────┤
│        Bottom Nav           │  64px
│  [首页][计划][统计][我的]   │
└─────────────────────────────┘
```

### 9.2 安全区域

```css
.safe-area {
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
```

### 9.3 网格系统

```css
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
```

---

## 十、动画规范

### 10.1 时间函数

```css
:root {
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

### 10.2 动画时长

| 类型 | 时长 | 用途 |
|------|------|------|
| 微交互 | 150ms | 按钮点击、状态切换 |
| 快速 | 200ms | 悬停效果、小过渡 |
| 正常 | 300ms | 页面切换、弹窗 |
| 缓慢 | 500ms | 重要动画、庆祝效果 |

### 10.3 关键动画

#### 星星获得动画
```css
@keyframes starEarned {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.star-earned {
  animation: starEarned 0.6s var(--ease-spring);
}
```

#### 连续打卡火焰
```css
@keyframes flame {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.2);
  }
}

.streak-flame {
  animation: flame 1.5s ease-in-out infinite;
}
```

#### 进度条填充
```css
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress);
  }
}

.progress-bar__fill {
  animation: progressFill 0.8s var(--ease-out);
}
```

#### 卡片入场
```css
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: cardEnter 0.4s var(--ease-out) forwards;
}
```

---

## 十一、响应式断点

```css
/* 移动端优先 */

/* 小屏手机 */
@media (max-width: 375px) {
  :root {
    --page-padding: 16px;
  }
}

/* 标准手机 */
@media (min-width: 376px) and (max-width: 414px) {
  :root {
    --page-padding: 20px;
  }
}

/* 大屏手机/小平板 */
@media (min-width: 415px) and (max-width: 768px) {
  :root {
    --page-padding: 24px;
  }
}

/* 平板 */
@media (min-width: 769px) {
  :root {
    --page-padding: 32px;
    --max-content-width: 600px;
  }
}
```

---

## 十二、无障碍规范

### 12.1 色彩对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大文字与背景对比度 ≥ 3:1
- 交互元素与背景对比度 ≥ 3:1

### 12.2 触摸目标

- 最小触摸目标：44x44px
- 推荐触摸目标：48x48px
- 相邻元素间距：≥ 8px

### 12.3 动效

- 支持 `prefers-reduced-motion` 媒体查询
- 关键信息不依赖动画传达

---

## 十三、文件命名规范

```
assets/
├── icons/                    # 图标
│   ├── ic_home.svg
│   ├── ic_plan.svg
│   └── ic_star.svg
├── images/                   # 图片
│   ├── img_achievement_empty.png
│   └── img_wish_empty.png
├── illustrations/            # 插画
│   ├── illu_welcome.svg
│   └── illu_no_data.svg
└── animations/               # 动画文件
    ├── anim_star.json        # Lottie
    └── anim_celebration.json
```

---

## 十四、设计工具配置

### 14.1 Figma 变量

- 颜色变量：与 CSS 变量一一对应
- 文字样式：按层级命名
- 组件库：原子化设计，从基础组件到页面模板

### 14.2 导出规范

- 图标：SVG 格式
- 插画：SVG 或 PNG@2x
- 图片：WebP 格式，提供 1x/2x/3x

---

*文档结束*
