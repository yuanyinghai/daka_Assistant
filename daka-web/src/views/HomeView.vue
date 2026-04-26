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
        <span class="star-count">{{ totalStars }}</span>
      </div>
    </header>

    <!-- 连续打卡卡片 -->
    <div class="checkin-card">
      <div class="checkin-info">
        <div class="checkin-days">
          <span class="days-number">{{ continuousDays }}</span>
          <span class="days-label">天连续打卡</span>
        </div>
        <p class="checkin-tip">继续保持，创造新纪录！</p>
      </div>
      <button 
        class="checkin-btn" 
        @click="handleQuickCheckIn" 
        :disabled="loading || pendingTasks.length === 0"
        v-if="userStore.userRole === 'child'"
      >
        {{ loading ? '打卡中...' : '一键打卡' }}
      </button>
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
          <router-link v-if="userStore.userRole === 'parent'" to="/plans" class="add-btn">添加计划</router-link>
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
            v-if="!task.isCompleted && userStore.userRole === 'child'"
            class="checkin-btn-small"
            @click="handleCheckIn(task)"
            :disabled="loading"
          >
            打卡
          </button>
          <span v-else-if="task.isCompleted" class="task-status">已完成</span>
          <span v-else class="task-reward">+{{ task.stars }}⭐</span>
        </div>
      </div>
    </div>

    <!-- 角色提示 -->
    <div class="role-info">
      <span v-if="userStore.userRole === 'parent'" class="role-badge parent">家长模式 - 可以创建计划</span>
      <span v-else class="role-badge child">孩子模式 - 可以打卡学习</span>
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
import { studyPlanApi, planRecordApi, starsApi } from '@/utils/supabase'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const totalStars = ref(0)
const continuousDays = ref(0)

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

const tasks = ref<any[]>([])

// 待打卡任务
const pendingTasks = computed(() => tasks.value.filter(t => !t.isCompleted))

// 科目图标映射
const categoryIcons: Record<string, string> = {
  '语文': '📖',
  '数学': '📐',
  '英语': '🔤',
  '科学': '🔬',
  '艺术': '🎨',
  '音乐': '🎵',
  '体育': '⚽',
  '阅读': '📚',
  '其他': '📋'
}

// 加载今日计划
const loadTodayPlans = async () => {
  if (!userStore.userInfo?.id) return
  
  try {
    const today = new Date().toISOString().split('T')[0]
    const plans = await studyPlanApi.getPlans(userStore.userInfo.id)
    const records = await planRecordApi.getRecords(userStore.userInfo.id, today)
    
    tasks.value = plans.map((plan: any) => {
      const record = records.find((r: any) => r.plan_id === plan.id)
      return {
        id: plan.id,
        title: plan.title,
        icon: categoryIcons[plan.category] || '📋',
        isCompleted: record?.status === 'completed',
        recordId: record?.id,
        time: `${plan.start_time || '16:00'} - ${plan.end_time || '17:00'}`,
        stars: plan.reward_stars
      }
    })
  } catch (error) {
    console.error('加载今日计划失败:', error)
  }
}

// 加载星星总数
const loadTotalStars = async () => {
  if (!userStore.userInfo?.id) return
  
  try {
    totalStars.value = await starsApi.getTotal(userStore.userInfo.id)
  } catch (error) {
    console.error('加载星星失败:', error)
  }
}

// 打卡
const handleCheckIn = async (task: any) => {
  if (!userStore.userInfo?.id) return
  
  loading.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    
    // 创建打卡记录
    await planRecordApi.createRecord({
      plan_id: task.id,
      user_id: userStore.userInfo.id,
      record_date: today,
      status: 'pending',
      earned_stars: task.stars
    })
    
    task.isCompleted = true
    alert(`打卡成功！获得 ${task.stars} 颗星星（待家长审核）`)
  } catch (error: any) {
    alert('打卡失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 一键打卡所有待完成任务
const handleQuickCheckIn = async () => {
  if (pendingTasks.value.length === 0) {
    alert('今天没有待打卡的任务')
    return
  }
  
  loading.value = true
  try {
    for (const task of pendingTasks.value) {
      await handleCheckIn(task)
    }
    alert('一键打卡完成！')
  } catch (error: any) {
    alert('打卡失败：' + error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTodayPlans()
  loadTotalStars()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  padding-bottom: 5rem;
}

.home-header {
  padding: 2rem 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.greeting h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.greeting p {
  font-size: 0.875rem;
  opacity: 0.9;
}

.star-badge {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
}

.star-icon {
  font-size: 1.25rem;
  margin-right: 0.25rem;
}

.star-count {
  font-size: 1.25rem;
  font-weight: 600;
}

.checkin-card {
  margin: 0 1rem 1.5rem;
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.checkin-days {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.days-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4ecdc4;
}

.days-label {
  font-size: 0.875rem;
  color: #606266;
}

.checkin-tip {
  font-size: 0.75rem;
  color: #909399;
  margin-top: 0.25rem;
}

.checkin-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.checkin-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.today-tasks {
  background: white;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  min-height: 50vh;
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
  color: #909399;
}

.empty-tasks p {
  margin-bottom: 1rem;
}

.add-btn {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: #4ecdc4;
  color: white;
  border-radius: 2rem;
  text-decoration: none;
  font-size: 0.875rem;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 1rem;
}

.task-item.completed {
  opacity: 0.6;
  background: #e8f8f5;
}

.task-icon {
  font-size: 2rem;
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
  font-size: 0.75rem;
  color: #909399;
}

.checkin-btn-small {
  padding: 0.5rem 1rem;
  background: #4ecdc4;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.checkin-btn-small:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.task-status {
  font-size: 0.875rem;
  color: #00b894;
}

.task-reward {
  font-size: 0.875rem;
  color: #f39c12;
  font-weight: 500;
}

.role-info {
  padding: 1rem;
  text-align: center;
}

.role-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
}

.role-badge.parent {
  background: #e3f2fd;
  color: #1976d2;
}

.role-badge.child {
  background: #e8f5e9;
  color: #388e3c;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  background: white;
  padding: 0.5rem 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  color: #909399;
  text-decoration: none;
}

.tab-item.active {
  color: #4ecdc4;
}

.tab-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.tab-text {
  font-size: 0.75rem;
}
</style>
