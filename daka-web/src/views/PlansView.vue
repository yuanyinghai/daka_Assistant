<template>
  <div class="plans-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <h1>学习计划</h1>
      <span v-if="userStore.userRole === 'parent'" class="role-badge">家长</span>
      <span v-else class="role-badge">孩子</span>
    </header>

    <!-- 周视图 -->
    <div class="week-view">
      <div
        v-for="(day, index) in weekDays"
        :key="index"
        class="day-item"
        :class="{ active: selectedDay === index }"
        @click="selectDay(index)"
      >
        <span class="day-label">{{ day.label }}</span>
        <span class="day-date">{{ day.date }}</span>
        <span v-if="day.count > 0" class="day-count">{{ day.count }}</span>
      </div>
    </div>

    <!-- 计划列表 -->
    <div class="plan-list">
      <div v-if="plans.length === 0" class="empty-state">
        <span class="empty-icon">📋</span>
        <p>这一天还没有计划</p>
        <button v-if="userStore.userRole === 'parent'" class="add-btn" @click="showAddModal = true">
          添加计划
        </button>
      </div>

      <div
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        :class="{ completed: plan.isCompleted }"
      >
        <div class="plan-icon">{{ plan.icon }}</div>
        <div class="plan-content">
          <h3>{{ plan.title }}</h3>
          <p>{{ plan.time }}</p>
          <div class="plan-tags">
            <span class="tag reward">+{{ plan.stars }}⭐</span>
            <span v-if="plan.needReview" class="tag review">需审核</span>
          </div>
        </div>
        <button
          v-if="!plan.isCompleted && userStore.userRole === 'child'"
          class="checkin-btn-small"
          @click="completePlan(plan)"
          :disabled="loading"
        >
          {{ loading ? '...' : '打卡' }}
        </button>
        <button
          v-else-if="plan.needReview && userStore.userRole === 'parent'"
          class="review-btn-small"
          @click="reviewPlan(plan)"
        >
          审核
        </button>
        <span v-else-if="plan.isCompleted" class="completed-text">已完成</span>
      </div>
    </div>

    <!-- 家长才能看到添加按钮 -->
    <button v-if="userStore.userRole === 'parent'" class="fab-button" @click="showAddModal = true">
      <span class="fab-icon">+</span>
    </button>

    <!-- 添加计划弹窗 - 仅家长 -->
    <div v-if="showAddModal && userStore.userRole === 'parent'" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>添加学习计划</h3>
          <button class="close-btn" @click="showAddModal = false">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label>计划名称</label>
            <input
              v-model="newPlan.title"
              type="text"
              placeholder="例如：数学作业"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>选择分类</label>
            <div class="category-grid">
              <div
                v-for="cat in categories"
                :key="cat.id"
                class="category-item"
                :class="{ active: newPlan.category === cat.id }"
                @click="newPlan.category = cat.id"
              >
                <span class="cat-icon">{{ cat.icon }}</span>
                <span class="cat-name">{{ cat.name }}</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>开始时间</label>
              <input v-model="newPlan.startTime" type="time" class="form-input" />
            </div>
            <div class="form-group">
              <label>结束时间</label>
              <input v-model="newPlan.endTime" type="time" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>奖励星星</label>
            <div class="stars-selector">
              <button
                v-for="n in 10"
                :key="n"
                class="star-btn"
                :class="{ active: newPlan.stars >= n }"
                @click="newPlan.stars = n"
              >
                ⭐
              </button>
              <span class="stars-count">{{ newPlan.stars }} 颗</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showAddModal = false">取消</button>
          <button class="btn-confirm" @click="addPlan" :disabled="loading">
            {{ loading ? '添加中...' : '添加' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 审核弹窗 - 仅家长 -->
    <div v-if="showReviewModal && userStore.userRole === 'parent'" class="modal-overlay" @click.self="showReviewModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>审核打卡</h3>
          <button class="close-btn" @click="showReviewModal = false">×</button>
        </div>
        <div class="modal-body">
          <p>孩子完成了：{{ reviewingPlan?.title }}</p>
          <p>奖励星星：{{ reviewingPlan?.stars }}⭐</p>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="rejectPlan">驳回</button>
          <button class="btn-confirm" @click="approvePlan" :disabled="loading">
            {{ loading ? '处理中...' : '通过并发放奖励' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { studyPlanApi, planRecordApi, starsApi } from '@/utils/supabase'

const userStore = useUserStore()
const selectedDay = ref(0)
const showAddModal = ref(false)
const showReviewModal = ref(false)
const loading = ref(false)
const reviewingPlan = ref<any>(null)

// 获取本周日期
const getWeekDays = () => {
  const days = ['日', '一', '二', '三', '四', '五', '六']
  const today = new Date()
  const weekDays = []
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - today.getDay() + i)
    weekDays.push({
      label: days[date.getDay()],
      date: date.getDate().toString(),
      count: 0,
      fullDate: date.toISOString().split('T')[0]
    })
  }
  return weekDays
}

const weekDays = ref(getWeekDays())

const categories = [
  { id: 1, name: '语文', icon: '📖' },
  { id: 2, name: '数学', icon: '📐' },
  { id: 3, name: '英语', icon: '🔤' },
  { id: 4, name: '科学', icon: '🔬' },
  { id: 5, name: '艺术', icon: '🎨' },
  { id: 6, name: '音乐', icon: '🎵' },
  { id: 7, name: '体育', icon: '⚽' },
  { id: 8, name: '阅读', icon: '📚' }
]

const plans = ref<any[]>([])

const newPlan = reactive({
  title: '',
  category: 1,
  startTime: '16:00',
  endTime: '17:00',
  stars: 3
})

// 加载计划列表
const loadPlans = async () => {
  if (!userStore.userInfo?.id) return
  
  try {
    const data = await studyPlanApi.getPlans(userStore.userInfo.id)
    plans.value = data.map((plan: any) => ({
      id: plan.id,
      title: plan.title,
      time: `${plan.start_time || '16:00'} - ${plan.end_time || '17:00'}`,
      stars: plan.reward_stars,
      icon: categories.find(c => c.name === plan.category)?.icon || '📚',
      isCompleted: false,
      needReview: false
    }))
  } catch (error) {
    console.error('加载计划失败:', error)
  }
}

const selectDay = (index: number) => {
  selectedDay.value = index
  loadPlans()
}

// 孩子打卡
const completePlan = async (plan: any) => {
  if (!userStore.userInfo?.id) return
  
  loading.value = true
  try {
    // 创建打卡记录
    await planRecordApi.createRecord({
      plan_id: plan.id,
      user_id: userStore.userInfo.id,
      record_date: weekDays.value[selectedDay.value].fullDate,
      status: 'pending',
      earned_stars: plan.stars
    })
    
    plan.isCompleted = true
    plan.needReview = true
    alert('打卡成功！等待家长审核')
  } catch (error: any) {
    alert('打卡失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 家长审核
const reviewPlan = (plan: any) => {
  reviewingPlan.value = plan
  showReviewModal.value = true
}

// 通过审核并发放奖励
const approvePlan = async () => {
  if (!reviewingPlan.value || !userStore.userInfo?.id) return
  
  loading.value = true
  try {
    // 更新打卡记录状态
    await planRecordApi.checkIn(reviewingPlan.value.recordId || reviewingPlan.value.id, {
      status: 'completed',
      earned_stars: reviewingPlan.value.stars
    })
    
    // 发放星星奖励
    await starsApi.createRecord({
      user_id: userStore.userInfo.id,
      amount: reviewingPlan.value.stars,
      type: 'earned',
      source: 'plan_complete',
      description: `完成计划：${reviewingPlan.value.title}`
    })
    
    reviewingPlan.value.isCompleted = true
    reviewingPlan.value.needReview = false
    showReviewModal.value = false
    alert(`审核通过！已发放 ${reviewingPlan.value.stars} 颗星星`)
  } catch (error: any) {
    alert('审核失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 驳回审核
const rejectPlan = async () => {
  if (!reviewingPlan.value) return
  
  showReviewModal.value = false
  reviewingPlan.value.isCompleted = false
  reviewingPlan.value.needReview = false
  alert('已驳回')
}

// 家长添加计划
const addPlan = async () => {
  if (!newPlan.title) {
    alert('请输入计划名称')
    return
  }
  
  if (!userStore.userInfo?.id) {
    alert('请先登录')
    return
  }
  
  // 只有家长能创建计划
  if (userStore.userRole !== 'parent') {
    alert('只有家长才能创建学习计划')
    return
  }
  
  loading.value = true
  try {
    const category = categories.find(c => c.id === newPlan.category)
    await studyPlanApi.createPlan({
      user_id: userStore.userInfo.id,
      title: newPlan.title,
      category: category?.name || '其他',
      start_time: newPlan.startTime,
      end_time: newPlan.endTime,
      reward_stars: newPlan.stars,
      is_active: true
    })
    
    alert('添加成功！')
    showAddModal.value = false
    newPlan.title = ''
    await loadPlans()
  } catch (error: any) {
    alert('添加失败：' + error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPlans()
})
</script>

<style scoped>
.plans-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 5rem;
}

.page-header {
  padding: 1rem;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3436;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  background: #4ecdc4;
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
}

.week-view {
  display: flex;
  background: #ffffff;
  padding: 1rem 0.5rem;
  gap: 0.5rem;
  overflow-x: auto;
}

.day-item {
  flex: 1;
  min-width: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-radius: 1rem;
  background: #f5f7fa;
  cursor: pointer;
}

.day-item.active {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.day-item.active .day-label,
.day-item.active .day-date {
  color: #ffffff;
}

.day-label {
  font-size: 0.75rem;
  color: #909399;
  margin-bottom: 0.25rem;
}

.day-date {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.day-count {
  font-size: 0.7rem;
  color: #4ecdc4;
  background: #e8f8f5;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
}

.plan-list {
  padding: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #909399;
  margin-bottom: 1.5rem;
}

.add-btn {
  padding: 0.75rem 2rem;
  background: #4ecdc4;
  color: #ffffff;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
}

.plan-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-left: 4px solid #4ecdc4;
}

.plan-card.completed {
  border-left-color: #00b894;
  opacity: 0.7;
  background: #e8f8f5;
}

.plan-icon {
  font-size: 2rem;
  margin-right: 0.75rem;
}

.plan-content {
  flex: 1;
}

.plan-content h3 {
  font-size: 1rem;
  font-weight: 500;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.plan-content p {
  font-size: 0.8rem;
  color: #909399;
  margin-bottom: 0.5rem;
}

.plan-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.tag.reward {
  background: #fff3cd;
  color: #856404;
}

.tag.review {
  background: #f8d7da;
  color: #721c24;
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

.review-btn-small {
  padding: 0.5rem 1rem;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.completed-text {
  color: #00b894;
  font-size: 0.875rem;
}

.fab-button {
  position: fixed;
  right: 1.5rem;
  bottom: 5rem;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 1.5rem 1.5rem 0 0;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #909399;
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #606266;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #dcdfe6;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  background: #f5f7fa;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.category-item.active {
  background: #4ecdc4;
  color: white;
}

.cat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.cat-name {
  font-size: 0.75rem;
}

.stars-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.2s;
}

.star-btn.active {
  opacity: 1;
}

.stars-count {
  margin-left: 0.5rem;
  font-size: 0.875rem;
  color: #606266;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 0.875rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
}

.btn-cancel {
  background: #f5f7fa;
  border: none;
  color: #606266;
}

.btn-confirm {
  background: #4ecdc4;
  border: none;
  color: white;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.bottom-nav {
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
