# 交互规范与动画效果设计文档

**文档版本**: V1.0  
**更新日期**: 2026-04-24  
**适用范围**: 智能学习管理助手全应用

---

## 一、交互设计原则

### 1.1 核心原则

| 原则 | 说明 | 应用场景 |
|------|------|----------|
| **即时反馈** | 用户操作后立即给予视觉/触觉反馈 | 按钮点击、表单提交 |
| **渐进呈现** | 信息按优先级逐步展示 | 页面加载、数据更新 |
| **容错设计** | 允许撤销，防止误操作 | 删除、兑换等重要操作 |
| **一致性** | 相同操作有相同反馈 | 全应用交互统一 |
| **趣味性** | 针对儿童用户增加游戏化反馈 | 获得星星、解锁成就 |

### 1.2 交互层次

```
Level 1: 微交互 (0-150ms)
├── 按钮状态变化
├── 图标动画
└── 开关切换

Level 2: 元素动画 (150-300ms)
├── 卡片展开
├── 弹窗出现
└── 页面切换

Level 3: 场景动画 (300-600ms)
├── 获得奖励
├── 成就解锁
└── 连续打卡庆祝

Level 4: 氛围动画 (持续)
├── 星星闪烁
├── 火焰效果
└── 进度流动
```

---

## 二、微交互规范

### 2.1 按钮交互

#### 点击反馈
```css
/* 基础按钮点击 */
.btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.btn:active {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

/* 主要按钮点击 */
.btn-primary:active {
  transform: scale(0.96);
  filter: brightness(0.95);
}

/* 图标按钮点击 */
.btn-icon:active {
  background: rgba(0,0,0,0.05);
  transform: scale(0.9);
}
```

#### 悬停效果（桌面端）
```css
@media (hover: hover) {
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .btn-icon:hover {
    background: rgba(0,0,0,0.03);
  }
}
```

### 2.2 输入框交互

```css
.input-field {
  border: 2px solid #E8EAEB;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field:focus {
  border-color: #4ECDC4;
  box-shadow: 0 0 0 4px rgba(78, 205, 196, 0.1);
  outline: none;
}

/* 错误状态 */
.input-field--error {
  border-color: #FF6B6B;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
```

### 2.3 开关/复选框

```css
.toggle {
  width: 52px;
  height: 32px;
  background: #E8EAEB;
  border-radius: 16px;
  position: relative;
  transition: background 0.3s ease;
}

.toggle::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toggle--active {
  background: #4ECDC4;
}

.toggle--active::after {
  transform: translateX(20px);
}
```

### 2.4 卡片交互

```css
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:active {
  transform: scale(0.98);
}

/* 可滑动卡片 */
.card--swipeable {
  transition: transform 0.3s ease;
}

.card--swipeable.swiping {
  transition: none;
}
```

---

## 三、页面转场动画

### 3.1 页面切换

```css
/* 新页面从右侧进入 */
.page-enter {
  animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 页面返回从左侧进入 */
.page-enter-back {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 页面离开 */
.page-leave {
  animation: slideOutLeft 0.3s ease-in;
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-30px);
  }
}
```

### 3.2 弹窗动画

```css
/* 弹窗遮罩 */
.modal-overlay {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 弹窗内容 - 从底部滑入 */
.modal-content {
  animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 弹窗关闭 */
.modal-content--closing {
  animation: slideDown 0.2s ease-in forwards;
}

@keyframes slideDown {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}
```

### 3.3 列表加载动画

```css
/* 列表项依次入场 */
.list-item {
  opacity: 0;
  transform: translateY(20px);
  animation: listItemEnter 0.4s ease forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
.list-item:nth-child(5) { animation-delay: 200ms; }

@keyframes listItemEnter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 骨架屏加载 */
.skeleton {
  background: linear-gradient(90deg, #F1F3F4 25%, #E8EAEB 50%, #F1F3F4 75%);
  background-size: 200% 100%;
  animation: skeletonLoading 1.5s ease-in-out infinite;
}

@keyframes skeletonLoading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 四、奖励与庆祝动画

### 4.1 星星获得动画

```css
/* 星星飞入 */
@keyframes starFlyIn {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.3) rotate(10deg);
  }
  70% {
    transform: scale(0.9) rotate(-5deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.star-earned {
  animation: starFlyIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 星星飘动 */
@keyframes starFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-5px) rotate(5deg);
  }
  75% {
    transform: translateY(-3px) rotate(-5deg);
  }
}

.star-floating {
  animation: starFloat 2s ease-in-out infinite;
}

/* 星星爆发效果 */
.star-burst {
  position: absolute;
  pointer-events: none;
}

.star-burst__particle {
  position: absolute;
  animation: burst 0.8s ease-out forwards;
}

@keyframes burst {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--tx), var(--ty)) scale(0);
    opacity: 0;
  }
}
```

### 4.2 连续打卡火焰

```css
/* 火焰跳动 */
@keyframes flame {
  0%, 100% {
    transform: scale(1);
    filter: brightness(1);
  }
  25% {
    transform: scale(1.05) rotate(-2deg);
    filter: brightness(1.1);
  }
  50% {
    transform: scale(1.1) rotate(2deg);
    filter: brightness(1.2);
  }
  75% {
    transform: scale(1.05) rotate(-1deg);
    filter: brightness(1.1);
  }
}

.streak-flame {
  animation: flame 1.5s ease-in-out infinite;
  transform-origin: bottom center;
}

/* 火焰光晕 */
@keyframes flameGlow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 107, 107, 0.6);
  }
}

.streak-card {
  animation: flameGlow 2s ease-in-out infinite;
}
```

### 4.3 成就解锁动画

```css
/* 成就解锁 - 缩放弹跳 */
@keyframes achievementUnlock {
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
  85% {
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.achievement-unlock {
  animation: achievementUnlock 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 成就发光 */
@keyframes achievementGlow {
  0%, 100% {
    filter: brightness(1) drop-shadow(0 0 0 rgba(255, 217, 61, 0));
  }
  50% {
    filter: brightness(1.3) drop-shadow(0 0 20px rgba(255, 217, 61, 0.6));
  }
}

.achievement-glow {
  animation: achievementGlow 2s ease-in-out infinite;
}
```

### 4.4 兑换成功庆祝

```css
/* 彩带效果 */
.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confettiFall 3s ease-out forwards;
}

@keyframes confettiFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

/* 缩放庆祝 */
@keyframes celebrateScale {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.celebrate-icon {
  animation: celebrateScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

---

## 五、进度与加载动画

### 5.1 进度条动画

```css
/* 进度条填充 */
@keyframes progressFill {
  from {
    width: 0%;
  }
  to {
    width: var(--progress);
  }
}

.progress-bar__fill {
  animation: progressFill 0.8s ease-out;
}

/* 进度条闪光 */
@keyframes progressShine {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.progress-bar__fill--animated {
  background: linear-gradient(
    90deg,
    #4ECDC4 0%,
    #7EDDD7 50%,
    #4ECDC4 100%
  );
  background-size: 200% 100%;
  animation: progressShine 2s linear infinite;
}
```

### 5.2 加载动画

```css
/* 旋转加载 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

/* 脉冲加载 */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.8);
    opacity: 0.5;
  }
}

.loading-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

/* 弹跳加载 */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.loading-bounce {
  animation: bounce 0.6s ease-in-out infinite;
}

.loading-bounce:nth-child(2) {
  animation-delay: 0.1s;
}

.loading-bounce:nth-child(3) {
  animation-delay: 0.2s;
}
```

### 5.3 下拉刷新

```css
/* 下拉刷新动画 */
@keyframes pullRefresh {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.pull-refresh__icon {
  animation: pullRefresh 1s linear infinite;
}

/* 刷新成功 */
@keyframes refreshSuccess {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.pull-refresh--success {
  animation: refreshSuccess 0.3s ease;
}
```

---

## 六、图表动画

### 6.1 折线图绘制

```css
/* 线条绘制 */
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

/* 区域填充 */
@keyframes fadeInArea {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.3;
  }
}

.line-chart__area {
  animation: fadeInArea 1s ease-out 0.5s both;
}

/* 数据点弹出 */
@keyframes popIn {
  0% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.line-chart__point {
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
}

.line-chart__point:nth-child(1) { animation-delay: 0.6s; }
.line-chart__point:nth-child(2) { animation-delay: 0.7s; }
.line-chart__point:nth-child(3) { animation-delay: 0.8s; }
/* ... */
```

### 6.2 柱状图增长

```css
/* 柱子增长 */
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
  animation: growUp 0.6s ease-out both;
}

.bar-chart__bar:nth-child(1) { animation-delay: 0ms; }
.bar-chart__bar:nth-child(2) { animation-delay: 100ms; }
.bar-chart__bar:nth-child(3) { animation-delay: 200ms; }
/* ... */

/* 数值弹出 */
@keyframes valuePop {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.bar-chart__value {
  animation: valuePop 0.4s ease-out 0.6s both;
}
```

### 6.3 饼图展开

```css
/* 扇形展开 */
@keyframes pieSlice {
  from {
    transform: rotate(-90deg) scale(0);
  }
  to {
    transform: rotate(-90deg) scale(1);
  }
}

.pie-chart__slice {
  transform-origin: center;
  animation: pieSlice 0.6s ease-out both;
}

/* 中心放大 */
@keyframes centerScale {
  from {
    transform: translate(-50%, -50%) scale(0);
  }
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

.pie-chart__center {
  animation: centerScale 0.4s ease-out 0.4s both;
}
```

---

## 七、手势交互

### 7.1 滑动操作

```css
/* 滑动删除 */
.swipeable-item {
  transition: transform 0.3s ease;
}

.swipeable-item--swiped-left {
  transform: translateX(-80px);
}

.swipeable-item--swiped-right {
  transform: translateX(80px);
}

/* 滑动动作按钮 */
.swipe-action {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.swipe-action--left {
  left: -80px;
  background: #4ECDC4;
}

.swipe-action--right {
  right: -80px;
  background: #FF6B6B;
}
```

### 7.2 拖拽排序

```css
/* 拖拽中 */
.dragging {
  opacity: 0.8;
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 100;
}

/* 占位符 */
.drag-placeholder {
  background: #F1F3F4;
  border: 2px dashed #B2BEC3;
  border-radius: 12px;
}
```

### 7.3 长按操作

```css
/* 长按反馈 */
.long-press {
  transition: transform 0.2s ease;
}

.long-press--pressing {
  transform: scale(0.95);
}

/* 长按菜单 */
@keyframes contextMenuAppear {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.context-menu {
  animation: contextMenuAppear 0.2s ease-out;
}
```

---

## 八、时间函数参考

### 8.1 缓动函数

```css
:root {
  /* 标准 */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* 减速 */
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  
  /* 加速 */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  
  /* 弹性 */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  /* 弹簧 */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* 平滑 */
  --ease-smooth: cubic-bezier(0.45, 0, 0.55, 1);
}
```

### 8.2 动画时长指南

| 场景 | 时长 | 缓动 |
|------|------|------|
| 微交互 | 100-150ms | ease-out |
| 按钮反馈 | 150-200ms | ease |
| 页面切换 | 250-350ms | ease-out |
| 弹窗出现 | 200-300ms | spring |
| 弹窗关闭 | 150-200ms | ease-in |
| 列表入场 | 300-500ms | ease-out |
| 庆祝动画 | 500-800ms | bounce |
| 循环动画 | 1500-3000ms | ease-in-out |

---

## 九、无障碍支持

### 9.1 减少动效

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 9.2 焦点状态

```css
/* 键盘导航焦点 */
:focus-visible {
  outline: 3px solid #4ECDC4;
  outline-offset: 2px;
}

/* 跳过链接 */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #2D3436;
  color: white;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}
```

---

## 十、性能优化

### 10.1 动画性能

```css
/* 使用 transform 和 opacity */
.optimized-animation {
  will-change: transform, opacity;
  transform: translateZ(0); /* 开启硬件加速 */
}

/* 动画结束后移除 will-change */
.optimized-animation--done {
  will-change: auto;
}
```

### 10.2 避免重排

```css
/* 避免动画 width/height/top/left */
/* 推荐：使用 transform */
/* ❌ 不推荐 */
.bad-animation {
  animation: badMove 1s ease;
}

@keyframes badMove {
  from { left: 0; }
  to { left: 100px; }
}

/* ✅ 推荐 */
.good-animation {
  animation: goodMove 1s ease;
}

@keyframes goodMove {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

### 10.3 节流与防抖

```javascript
// 滚动动画节流
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // 执行动画
      ticking = false;
    });
    ticking = true;
  }
});
```

---

*文档结束*
