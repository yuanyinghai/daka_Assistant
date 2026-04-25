<template>
  <div class="report-page">
    <!-- 顶部 -->
    <header class="page-header">
      <h1>📊 学习周报</h1>
      <p class="period">{{ report.period.start }} ~ {{ report.period.end }}</p>
    </header>

    <!-- 数据概览 -->
    <div class="summary-cards">
      <div class="summary-card">
        <span class="summary-value">{{ report.summary.completionRate }}%</span>
        <span class="summary-label">完成率</span>
      </div>
      <div class="summary-card">
        <span class="summary-value">{{ report.summary.completedTasks }}/{{ report.summary.totalTasks }}</span>
        <span class="summary-label">完成任务</span>
      </div>
      <div class="summary-card">
        <span class="summary-value">{{ Math.floor(report.summary.totalStudyMinutes / 60) }}h</span>
        <span class="summary-label">学习时长</span>
      </div>
      <div class="summary-card stars">
        <span class="summary-value">{{ report.summary.earnedStars }}⭐</span>
        <span class="summary-label">获得星星</span>
      </div>
    </div>

    <!-- AI 洞察 -->
    <div class="ai-insights" v-if="report.aiInsights">
      <div class="ai-header">
        <span class="ai-icon">🤖</span>
        <span class="ai-title">AI 学习分析</span>
      </div>
      <p class="ai-content">{{ report.aiInsights }}</p>
    </div>

    <!-- 本周亮点 -->
    <div class="section">
      <h3 class="section-title">🌟 本周亮点</h3>
      <div class="highlight-list">
        <div
          v-for="(highlight, index) in report.highlights"
          :key="index"
          class="highlight-item"
        >
          <span class="highlight-icon">✨</span>
          <span class="highlight-text">{{ highlight }}</span>
        </div>
      </div>
    </div>

    <!-- 改进空间 -->
    <div class="section">
      <h3 class="section-title">📈 改进空间</h3>
      <div class="improvement-list">
        <div
          v-for="(improvement, index) in report.improvements"
          :key="index"
          class="improvement-item"
        >
          <span class="improvement-icon">💡</span>
          <span class="improvement-text">{{ improvement }}</span>
        </div>
      </div>
    </div>

    <!-- 下周目标 -->
    <div class="section">
      <h3 class="section-title">🎯 下周目标</h3>
      <div class="goal-list">
        <div
          v-for="(goal, index) in report.nextWeekGoals"
          :key="index"
          class="goal-item"
        >
          <span class="goal-checkbox">☐</span>
          <span class="goal-text">{{ goal }}</span>
        </div>
      </div>
    </div>

    <!-- 分享按钮 -->
    <div class="share-section">
      <button class="btn-share" @click="shareReport">
        <span>📤</span>
        分享周报
      </button>
    </div>

    <!-- 底部导航 -->
    <nav class="tab-bar safe-area-bottom">
      <router-link to="/" class="tab-item">
        <span class="tab-icon">🏠</span>
        <span class="tab-text">首页</span>
      </router-link>
      <router-link to="/plans" class="tab-item">
        <span class="tab-icon">📋</span>
        <span class="tab-text">计划</span>
      </router-link>
      <router-link to="/statistics" class="tab-item">
        <span class="tab-icon">📊</span>
        <span class="tab-text">统计</span>
      </router-link>
      <router-link to="/rewards" class="tab-item">
        <span class="tab-icon">🎁</span>
        <span class="tab-text">奖励</span>
      </router-link>
      <router-link to="/profile" class="tab-item">
        <span class="tab-icon">👤</span>
        <span class="tab-text">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getWeeklyReport } from '@/api/ai'
import type { WeeklyReport } from '@/api/ai'

const report = ref<WeeklyReport>({
  period: { start: '', end: '' },
  summary: {
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    totalStudyMinutes: 0,
    earnedStars: 0,
  },
  highlights: [],
  improvements: [],
  nextWeekGoals: [],
  aiInsights: '',
})

const shareReport = () => {
  const text = `我的学习周报\n` +
    `完成率：${report.value.summary.completionRate}%\n` +
    `完成任务：${report.value.summary.completedTasks}/${report.value.summary.totalTasks}\n` +
    `学习时长：${Math.floor(report.value.summary.totalStudyMinutes / 60)}小时\n` +
    `获得星星：${report.value.summary.earnedStars}⭐\n` +
    `\n${report.value.aiInsights.slice(0, 50)}...`
  
  if (navigator.share) {
    navigator.share({
      title: '我的学习周报',
      text,
    })
  } else {
    alert('分享内容已复制到剪贴板')
  }
}

onMounted(async () => {
  try {
    const data = await getWeeklyReport()
    report.value = data
  } catch (error) {
    console.error('加载周报失败:', error)
  }
})
</script>

<style scoped>
.report-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 5rem;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1.5rem;
  color: #fff;
  text-align: center;
}

.page-header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.period {
  font-size: 0.875rem;
  opacity: 0.9;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  padding: 1rem;
  margin-top: -1rem;
}

.summary-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem 0.5rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.summary-card.stars {
  background: linear-gradient(135deg, #f4c430 0%, #f39c12 100%);
  color: #fff;
}

.summary-value {
  display: block;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #909399;
}

.summary-card.stars .summary-label {
  color: rgba(255, 255, 255, 0.9);
}

.ai-insights {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border-radius: 1rem;
  padding: 1.25rem;
  margin: 0 1rem 1rem;
  color: #fff;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.ai-icon {
  font-size: 1.5rem;
}

.ai-title {
  font-weight: 600;
}

.ai-content {
  font-size: 0.9rem;
  line-height: 1.6;
  opacity: 0.95;
}

.section {
  background: #fff;
  border-radius: 1rem;
  padding: 1.25rem;
  margin: 0 1rem 1rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 1rem;
}

.highlight-list,
.improvement-list,
.goal-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.highlight-item,
.improvement-item,
.goal-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
}

.highlight-icon,
.improvement-icon {
  font-size: 1.25rem;
}

.highlight-text,
.improvement-text,
.goal-text {
  flex: 1;
  font-size: 0.9rem;
  color: #2d3436;
  line-height: 1.5;
}

.goal-checkbox {
  font-size: 1.25rem;
  color: #4ecdc4;
}

.share-section {
  padding: 1rem;
  text-align: center;
}

.btn-share {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #fff;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

@media (min-width: 768px) {
  .tab-bar {
    max-width: 480px;
    margin: 0 auto;
  }
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  color: #b2bec3;
  padding: 0.25rem 0.75rem;
}

.tab-item.active,
.tab-item.router-link-active {
  color: #4ecdc4;
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-text {
  font-size: 0.65rem;
}
</style>
