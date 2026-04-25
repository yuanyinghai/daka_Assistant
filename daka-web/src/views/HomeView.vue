<template>
  <div class="home-page">
    <!-- 顶部问候 -->
    <header class="home-header">
      <div class="greeting">
        <h1>{{ greeting }}，{{ userStore.userInfo?.nickname || '小朋友' }}</h1>
        <p>今天也要加油学习哦！</p>
      </div>
      <div class="star-badge">
        <span class="star-icon">⭐</span>
        <span class="star-count">{{ userStore.starBalance }}</span>
      </div>
    </header>

    <!-- 连续打卡卡片 -->
    <div class="checkin-card">
      <div class="checkin-info">
        <div class="checkin-days">
          <span class="days-number">{{ stats.continuousDays || 0 }}</span>
          <span class="days-label">天连续打卡</span>
        </div>
        <p class="checkin-tip">继续保持，创造新纪录！</p>
      </div>
      <button class="checkin-btn" @click="handleCheckIn()" :disabled="loading">
        {{ loading ? '打卡中...' : '立即打卡' }}
      </button>
    </div>

    <!-- 智能提醒 -->
    <div v-if="reminders.length > 0" class="reminders-section">
      <div
        v-for="reminder in reminders"
        :key="reminder.title"
        class="reminder-card"
        :class="reminder.type"
      >
        <div class="reminder-content">
          <h4>{{ reminder.title }}</h4>
          <p>{{ reminder.message }}</p>
        </div>
        <button v-if="reminder.action" class="reminder-action" @click="handleReminderAction(reminder)">
          {{ reminder.action }}
        </button>
      </div>
    </div>

    <!-- AI 学习建议 -->
    <div v-if="advice.length > 0" class="advice-section">
      <div class="section-header">
        <h2>💡 AI 学习建议</h2>
      </div>
      <div class="advice-list">
        <div
          v-for="(item, index) in advice.slice(0, 2)"
          :key="index"
          class="advice-card"
          :class="item.type"
        >
          <h4>{{ item.title }}</h4>
          <p>{{ item.content }}</p>
          <span v-if="item.action" class="advice-action">{{ item.action }}</span>
        </div>
      </div>
    </div>

    <!-- 今日任务 -->
    <div class="today-tasks">
      <div class="section-header">
        <h2>今日任务</h2>
        <router-link to="/plans" class="view-all">查看全部 →</router-link>
      </div>

      <div class="task-list">
        <div v-if="tasks.length === 0" class="empty-tasks">
          <p>今天还没有计划哦</p>
          <router-link to="/plans" class="add-btn">添加计划</router-link>
        </div>
        
        <div
          v-for="task in tasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.isCompleted }"
        >
          <div class="task-icon">{{ task.icon }}</div>
          <div class="task-content">
            <h3>{{ task.title }}</h3>
            <p>{{ task.time }}</p>
          </div>
          <button
            v-if="!task.isCompleted && task.recordId"
            class="checkin-btn-small"
            @click="handleCheckIn(task)"
            :disabled="loading"
          >
            打卡
          </button>
          <div v-else class="task-reward">
            {{ task.isCompleted ? '已完成' : '+' + task.stars + '⭐' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="tab-bar safe-area-bottom">
      <router-link to="/" class="tab-item active">
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
      <router-link to="/profile" class="tab-item">
        <span class="tab-icon">👤</span>
        <span class="tab-text">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getUserStatistics } from '@/api/user'
import { getTodayPlans } from '@/api/study-plan'
import { checkIn } from '@/api/plan-record'
import { getLearningAdvice, getSmartReminders } from '@/api/ai'
import type { StudyPlan } from '@/api/study-plan'
import type { LearningAdvice, SmartReminder } from '@/api/ai'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const advice = ref<LearningAdvice[]>([])
const reminders = ref<SmartReminder[]>([])

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const stats = ref({
  continuousDays: 0,
  totalCompletedPlans: 0
})

const tasks = ref<Array<StudyPlan & { icon: string; isCompleted: boolean }>>([])

// 科目图标映射
const categoryIcons: Record<string, string> = {
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

// 加载今日计划
const loadTodayPlans = async () => {
  try {
    const data = await getTodayPlans()
    tasks.value = data.map(plan => ({
      ...plan,
      icon: categoryIcons[plan.category] || '📋',
      isCompleted: plan.recordStatus === 'completed',
      time: `${plan.startTime} - ${plan.endTime}`,
      stars: plan.rewardStars
    }))
  } catch (error) {
    console.error('加载今日计划失败:', error)
  }
}

// 打卡
const handleCheckIn = async (task?: typeof tasks.value[0]) => {
  if (!task) {
    // 一键打卡所有待完成任务
    const pendingTasks = tasks.value.filter(t => !t.isCompleted && t.recordId)
    if (pendingTasks.length === 0) {
      alert('今天没有待打卡的任务')
      return
    }
    
    loading.value = true
    try {
      for (const t of pendingTasks) {
        await checkIn(t.recordId!)
      }
      alert(`打卡成功！+${pendingTasks.reduce((sum, t) => sum + t.rewardStars, 0)}⭐`)
      await loadTodayPlans()
      // 刷新用户统计
      const data = await getUserStatistics()
      stats.value = data
      userStore.setUserInfo({ ...userStore.userInfo!, starBalance: data.starBalance })
    } catch (error: any) {
      alert(error.message || '打卡失败')
    } finally {
      loading.value = false
    }
  } else if (task.recordId) {
    // 单个任务打卡
    loading.value = true
    try {
      await checkIn(task.recordId)
      alert(`打卡成功！+${task.rewardStars}⭐`)
      await loadTodayPlans()
      // 刷新用户统计
      const data = await getUserStatistics()
      stats.value = data
      userStore.setUserInfo({ ...userStore.userInfo!, starBalance: data.starBalance })
    } catch (error: any) {
      alert(error.message || '打卡失败')
    } finally {
      loading.value = false
    }
  }
}

// 处理提醒动作
const handleReminderAction = (reminder: SmartReminder) => {
  if (reminder.action?.includes('打卡') || reminder.action?.includes('计划')) {
    router.push('/plans')
  } else if (reminder.action?.includes('加油')) {
    // 滚动到任务区域
    document.querySelector('.today-tasks')?.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(async () => {
  userStore.initFromStorage()
  try {
    const [statsData, adviceData, remindersData] = await Promise.all([
      getUserStatistics(),
      getLearningAdvice(),
      getSmartReminders(),
      loadTodayPlans()
    ])
    stats.value = statsData
    advice.value = adviceData
    reminders.value = remindersData
  } catch {
    // 使用默认值
  }
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 5rem;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #ffffff;
}

.greeting h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.greeting p {
  font-size: 0.875rem;
  opacity: 0.9;
}

.star-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
}

.star-icon {
  font-size: 1.25rem;
}

.star-count {
  font-size: 1.1rem;
  font-weight: 600;
}

.checkin-card {
  margin: -1.5rem 1rem 1rem;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.checkin-days {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.days-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4ecdc4;
}

.days-label {
  font-size: 1rem;
  color: #606266;
}

.checkin-tip {
  font-size: 0.8rem;
  color: #909399;
  margin-top: 0.25rem;
}

.checkin-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #ffffff;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.checkin-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.checkin-btn-small {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #ffffff;
  border: none;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.checkin-btn-small:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.reminders-section {
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.reminder-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-left: 4px solid #4ecdc4;
}

.reminder-card.urgent {
  border-left-color: #ff6b6b;
  background: #fff5f5;
}

.reminder-card.suggestion {
  border-left-color: #f4c430;
  background: #fffbf0;
}

.reminder-card.motivation {
  border-left-color: #00b894;
  background: #f0fff4;
}

.reminder-content h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.reminder-content p {
  font-size: 0.8rem;
  color: #636e72;
}

.reminder-action {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #fff;
  border: none;
  border-radius: 1.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
}

.advice-section {
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.advice-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.advice-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  border-left: 4px solid #4ecdc4;
}

.advice-card.strength {
  border-left-color: #00b894;
  background: #f0fff4;
}

.advice-card.weakness {
  border-left-color: #ff6b6b;
  background: #fff5f5;
}

.advice-card.suggestion {
  border-left-color: #f4c430;
  background: #fffbf0;
}

.advice-card.encouragement {
  border-left-color: #667eea;
  background: #f0f4ff;
}

.advice-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 0.5rem;
}

.advice-card p {
  font-size: 0.85rem;
  color: #636e72;
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.advice-action {
  font-size: 0.8rem;
  color: #4ecdc4;
  font-weight: 500;
}

.today-tasks {
  padding: 0 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
}

.view-all {
  font-size: 0.875rem;
  color: #4ecdc4;
  text-decoration: none;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-tasks {
  text-align: center;
  padding: 3rem 1rem;
  background: #ffffff;
  border-radius: 1rem;
}

.empty-tasks p {
  color: #909399;
  margin-bottom: 1rem;
}

.add-btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: #4ecdc4;
  color: #ffffff;
  text-decoration: none;
  border-radius: 2rem;
  font-size: 0.9rem;
}

.task-item {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 1rem;
  border-radius: 1rem;
  border-left: 4px solid #4ecdc4;
}

.task-item.completed {
  border-left-color: #00b894;
  opacity: 0.7;
  background: #e8f8f5;
}

.task-icon {
  font-size: 1.75rem;
  margin-right: 0.75rem;
}

.task-content {
  flex: 1;
}

.task-content h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.task-content p {
  font-size: 0.8rem;
  color: #909399;
}

.task-reward {
  font-size: 0.9rem;
  color: #f4c430;
  font-weight: 600;
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
