<template>
  <div class="statistics-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <h1>学习统计</h1>
    </header>

    <!-- 时间维度切换 -->
    <div class="time-tabs">
      <button
        v-for="tab in timeTabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 核心数据卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">📋</div>
        <span class="stat-label">总任务</span>
        <span class="stat-value">{{ summary.weekTotal }}</span>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <span class="stat-label">已完成</span>
        <span class="stat-value">{{ summary.weekCompleted }}</span>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">📊</div>
        <span class="stat-label">完成率</span>
        <span class="stat-value">{{ summary.weekCompletionRate }}%</span>
      </div>
    </div>

    <!-- 学习时长 -->
    <div class="duration-card">
      <div class="duration-header">
        <span class="duration-title">⏱️ 累计学习时长</span>
      </div>
      <div class="duration-value">{{ summary.totalStudyHours }}小时{{ summary.totalStudyMinutes }}分钟</div>
      <div class="duration-detail">
        <span>连续打卡 {{ summary.continuousDays }} 天 | 最高纪录 {{ summary.maxContinuousDays }} 天</span>
      </div>
    </div>

    <!-- 完成率趋势 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3>完成率趋势</h3>
      </div>
      <div class="simple-chart">
        <div
          v-for="(item, index) in completionTrend"
          :key="index"
          class="chart-bar"
        >
          <div class="bar-wrapper">
            <div
              class="bar-fill"
              :style="{ height: item.completionRate + '%' }"
              :class="{ high: item.completionRate >= 80, medium: item.completionRate >= 50 && item.completionRate < 80, low: item.completionRate < 50 }"
            ></div>
          </div>
          <span class="bar-label">{{ item.date.slice(5) }}</span>
          <span class="bar-value">{{ item.completionRate }}%</span>
        </div>
        <div v-if="completionTrend.length === 0" class="chart-empty">
          暂无数据
        </div>
      </div>
    </div>

    <!-- 科目分布 -->
    <div class="chart-card">
      <div class="chart-header">
        <h3>科目分布</h3>
      </div>
      <div class="category-list">
        <div
          v-for="item in categoryDistribution"
          :key="item.category"
          class="category-item"
        >
          <span class="category-icon">{{ getCategoryIcon(item.category) }}</span>
          <div class="category-info">
            <span class="category-name">{{ getCategoryName(item.category) }}</span>
            <div class="category-progress">
              <div
                class="progress-bar"
                :style="{ width: (item.completed / Math.max(item.count, 1) * 100) + '%' }"
              ></div>
            </div>
          </div>
          <span class="category-count">{{ item.completed }}/{{ item.count }}</span>
        </div>
        <div v-if="categoryDistribution.length === 0" class="chart-empty">
          暂无数据
        </div>
      </div>
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
      <router-link to="/statistics" class="tab-item active">
        <span class="tab-icon">📊</span>
        <span class="tab-text">统计</span>
      </router-link>
      <router-link to="/profile" class="tab-item">
        <span class="tab-icon">👤</span>
        <span class="tab-text">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { getOverview, getCompletionTrend, getDurationTrend, getCategoryDistribution } from '@/api/statistics'
import type { OverviewStatistics, CompletionTrendItem, DurationTrendItem, CategoryDistributionItem } from '@/api/statistics'

const currentTab = ref('7days')
const loading = ref(false)

const timeTabs = [
  { label: '最近7天', value: '7days' },
  { label: '最近30天', value: '30days' },
  { label: '本学期', value: 'semester' }
]

const summary = reactive<OverviewStatistics>({
  totalStudyHours: 0,
  totalStudyMinutes: 0,
  totalCompletedPlans: 0,
  continuousDays: 0,
  maxContinuousDays: 0,
  totalEarnedStars: 0,
  currentStars: 0,
  todayTotal: 0,
  todayCompleted: 0,
  todayCompletionRate: 0,
  weekTotal: 0,
  weekCompleted: 0,
  weekCompletionRate: 0,
  monthTotal: 0,
  monthCompleted: 0,
  monthCompletionRate: 0
})

const completionTrend = ref<CompletionTrendItem[]>([])
const durationTrend = ref<DurationTrendItem[]>([])
const categoryDistribution = ref<CategoryDistributionItem[]>([])

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`
  }
  return `${minutes}分钟`
}

const formatMinutes = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}小时${mins > 0 ? mins + '分钟' : ''}`
  }
  return `${mins}分钟`
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    chinese: '📖',
    math: '📐',
    english: '🔤',
    science: '🔬',
    art: '🎨',
    music: '🎵',
    sports: '⚽',
    reading: '📚',
    other: '📋'
  }
  return icons[category] || '📋'
}

const getCategoryName = (category: string) => {
  const names: Record<string, string> = {
    chinese: '语文',
    math: '数学',
    english: '英语',
    science: '科学',
    art: '艺术',
    music: '音乐',
    sports: '体育',
    reading: '阅读',
    other: '其他'
  }
  return names[category] || category
}

const getDaysByTab = () => {
  switch (currentTab.value) {
    case '7days': return 7
    case '30days': return 30
    case 'semester': return 90
    default: return 7
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const days = getDaysByTab()
    const [overviewData, trendData, durationData, categoryData] = await Promise.all([
      getOverview(),
      getCompletionTrend(days),
      getDurationTrend(days),
      getCategoryDistribution()
    ])
    
    Object.assign(summary, overviewData)
    completionTrend.value = trendData
    durationTrend.value = durationData
    categoryDistribution.value = categoryData
  } catch (error) {
    console.error('加载统计数据失败:', error)
  } finally {
    loading.value = false
  }
}

watch(currentTab, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.statistics-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 5rem;
}

.page-header {
  padding: 1rem;
  background: #ffffff;
}

.page-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3436;
}

.time-tabs {
  display: flex;
  background: #f1f3f4;
  border-radius: 0.75rem;
  padding: 0.5rem;
  margin: 1rem;
}

.tab-item {
  flex: 1;
  padding: 0.75rem;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #636e72;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-item.active {
  background: #ffffff;
  color: #2d3436;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.stat-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.25rem 0.75rem;
  text-align: center;
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 0.75rem;
}

.stat-icon.blue {
  background: #e3f2fd;
}

.stat-icon.green {
  background: #e8f5e9;
}

.stat-icon.orange {
  background: #fff3e0;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: #636e72;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3436;
}

.duration-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin: 0 1rem 1rem;
  color: #ffffff;
}

.duration-header {
  margin-bottom: 0.75rem;
}

.duration-title {
  font-size: 0.875rem;
  opacity: 0.9;
}

.duration-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.duration-detail {
  font-size: 0.875rem;
  opacity: 0.8;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.chart-card {
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.25rem;
  margin: 0 1rem 1rem;
}

.chart-header {
  margin-bottom: 1rem;
}

.chart-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3436;
}

.chart-placeholder {
  height: 12rem;
  background: #f8f9fa;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.chart-placeholder span {
  font-size: 1.25rem;
  color: #909399;
}

.chart-placeholder .sub {
  font-size: 0.875rem;
}

.simple-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 12rem;
  padding: 1rem 0;
  gap: 0.5rem;
}

.chart-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.bar-wrapper {
  width: 100%;
  height: 8rem;
  background: #f0f0f0;
  border-radius: 0.5rem;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 0.5rem;
  transition: height 0.3s ease;
}

.bar-fill.high {
  background: linear-gradient(180deg, #00b894 0%, #00a085 100%);
}

.bar-fill.medium {
  background: linear-gradient(180deg, #f4c430 0%, #e1b12c 100%);
}

.bar-fill.low {
  background: linear-gradient(180deg, #ff6b6b 0%, #ee5a5a 100%);
}

.bar-label {
  font-size: 0.7rem;
  color: #909399;
}

.bar-value {
  font-size: 0.7rem;
  color: #2d3436;
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  font-size: 1.5rem;
}

.category-info {
  flex: 1;
}

.category-name {
  display: block;
  font-size: 0.875rem;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.category-progress {
  height: 0.5rem;
  background: #f0f0f0;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #4ecdc4 0%, #44a08d 100%);
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.category-count {
  font-size: 0.875rem;
  color: #909399;
  min-width: 3rem;
  text-align: right;
}

.chart-empty {
  text-align: center;
  padding: 3rem;
  color: #909399;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
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
  padding: 0.25rem 1rem;
}

.tab-item.active,
.tab-item.router-link-active {
  color: #4ecdc4;
}

.tab-icon {
  font-size: 1.5rem;
}

.tab-text {
  font-size: 0.7rem;
}
</style>
