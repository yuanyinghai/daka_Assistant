<template>
  <div class="plans-page">
    <!-- 顶部导航 -->
    <header class="page-header">
      <h1>学习计划</h1>
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
        <button class="add-btn" @click="showAddModal = true">添加计划</button>
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
          v-if="!plan.isCompleted"
          class="checkin-btn-small"
          @click="completePlan(plan.id)"
        >
          打卡
        </button>
        <span v-else class="completed-text">已完成</span>
      </div>
    </div>

    <!-- 添加按钮 -->
    <button class="fab-button" @click="showAddModal = true">
      <span class="fab-icon">+</span>
    </button>

    <!-- 添加计划弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
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
            <label>奖励星星：{{ newPlan.stars }}颗</label>
            <input
              v-model.number="newPlan.stars"
              type="range"
              min="1"
              max="10"
              class="form-range"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="submit-btn" @click="addPlan">确认添加</button>
        </div>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="tab-bar safe-area-bottom">
      <router-link to="/" class="tab-item">
        <span class="tab-icon">🏠</span>
        <span class="tab-text">首页</span>
      </router-link>
      <router-link to="/plans" class="tab-item active">
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
import { ref, reactive } from 'vue'

const selectedDay = ref(0)
const showAddModal = ref(false)

const weekDays = ref([
  { label: '一', date: '24', count: 3 },
  { label: '二', date: '25', count: 2 },
  { label: '三', date: '26', count: 4 },
  { label: '四', date: '27', count: 0 },
  { label: '五', date: '28', count: 2 },
  { label: '六', date: '29', count: 1 },
  { label: '日', date: '30', count: 0 }
])

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

const plans = ref([
  { id: 1, title: '数学作业', time: '16:00 - 17:00', stars: 5, icon: '📐', isCompleted: false, needReview: true },
  { id: 2, title: '英语阅读', time: '17:30 - 18:00', stars: 3, icon: '🔤', isCompleted: true, needReview: false },
  { id: 3, title: '钢琴练习', time: '19:00 - 19:30', stars: 4, icon: '🎹', isCompleted: false, needReview: false }
])

const newPlan = reactive({
  title: '',
  category: 1,
  startTime: '16:00',
  endTime: '17:00',
  stars: 3
})

const selectDay = (index: number) => {
  selectedDay.value = index
}

const completePlan = (planId: number) => {
  const plan = plans.value.find(p => p.id === planId)
  if (plan) {
    plan.isCompleted = true
    alert('打卡成功！+' + plan.stars + '⭐')
  }
}

const addPlan = () => {
  if (!newPlan.title) {
    alert('请输入计划名称')
    return
  }
  alert('添加成功！')
  showAddModal.value = false
  newPlan.title = ''
}
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
}

.page-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3436;
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
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.4rem;
}

.tag.reward {
  background: #fff9e6;
  color: #f4c430;
}

.tag.review {
  background: #fce4ec;
  color: #e91e63;
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

.completed-text {
  font-size: 0.875rem;
  color: #00b894;
}

.fab-button {
  position: fixed;
  right: 1.5rem;
  bottom: 5.5rem;
  width: 3.5rem;
  height: 3.5rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
  cursor: pointer;
  z-index: 10;
}

.fab-icon {
  font-size: 1.75rem;
  color: #ffffff;
  font-weight: 300;
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
  background: #ffffff;
  width: 100%;
  max-width: 480px;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3436;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #909399;
  cursor: pointer;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  color: #606266;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid #e4e7ed;
  border-radius: 0.75rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #4ecdc4;
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
  padding: 0.75rem;
  background: #f5f7fa;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.category-item.active {
  background: #e8f8f5;
  border-color: #4ecdc4;
}

.cat-icon {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.cat-name {
  font-size: 0.75rem;
  color: #606266;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-range {
  width: 100%;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: #e4e7ed;
  outline: none;
  -webkit-appearance: none;
}

.form-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background: #4ecdc4;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
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
