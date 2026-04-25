<template>
  <div class="rewards-page">
    <!-- 顶部星星卡片 -->
    <div class="stars-header">
      <div class="stars-display">
        <span class="stars-icon">⭐</span>
        <span class="stars-count">{{ statistics.currentBalance }}</span>
      </div>
      <p class="stars-label">我的星星</p>
      <div class="stars-stats">
        <div class="stat-item">
          <span class="stat-value">+{{ statistics.todayEarned }}</span>
          <span class="stat-label">今日获得</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">+{{ statistics.weekEarned }}</span>
          <span class="stat-label">本周获得</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ statistics.totalEarned }}</span>
          <span class="stat-label">累计获得</span>
        </div>
      </div>
    </div>

    <!-- 兑换区域 -->
    <div class="redeem-section">
      <h3 class="section-title">🎁 兑换奖励</h3>
      <div class="redeem-grid">
        <div
          v-for="item in redeemItems"
          :key="item.id"
          class="redeem-card"
          :class="{ disabled: statistics.currentBalance < item.cost }"
          @click="selectRedeem(item)"
        >
          <span class="redeem-icon">{{ item.icon }}</span>
          <span class="redeem-name">{{ item.name }}</span>
          <span class="redeem-cost">{{ item.cost }}⭐</span>
        </div>
      </div>
    </div>

    <!-- 积分明细 -->
    <div class="records-section">
      <div class="records-header">
        <h3 class="section-title">📋 积分明细</h3>
        <div class="filter-tabs">
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            class="filter-tab"
            :class="{ active: currentFilter === tab.value }"
            @click="currentFilter = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div class="records-list">
        <div
          v-for="record in filteredRecords"
          :key="record.id"
          class="record-item"
        >
          <div class="record-info">
            <span class="record-title">{{ record.description || getSourceLabel(record.source) }}</span>
            <span class="record-time">{{ formatTime(record.createdAt) }}</span>
          </div>
          <span
            class="record-amount"
            :class="record.type"
          >
            {{ record.type === 'earn' ? '+' : '-' }}{{ record.amount }}
          </span>
        </div>

        <div v-if="filteredRecords.length === 0" class="empty-records">
          暂无记录
        </div>
      </div>
    </div>

    <!-- 兑换弹窗 -->
    <div v-if="showRedeemModal" class="modal-overlay" @click.self="showRedeemModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>确认兑换</h3>
          <button class="close-btn" @click="showRedeemModal = false">×</button>
        </div>
        <div class="modal-body">
          <div class="redeem-preview">
            <span class="preview-icon">{{ selectedItem?.icon }}</span>
            <span class="preview-name">{{ selectedItem?.name }}</span>
            <span class="preview-cost">消耗 {{ selectedItem?.cost }} ⭐</span>
          </div>
          <div class="form-group">
            <label>备注（可选）</label>
            <input
              v-model="redeemNote"
              type="text"
              placeholder="例如：周末使用"
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-primary" @click="confirmRedeem">确认兑换</button>
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
      <router-link to="/statistics" class="tab-item">
        <span class="tab-icon">📊</span>
        <span class="tab-text">统计</span>
      </router-link>
      <router-link to="/rewards" class="tab-item active">
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
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getStarRecords, getStarStatistics, redeemStars } from '@/api/stars'
import type { StarRecord, StarStatistics } from '@/api/stars'

const userStore = useUserStore()
const statistics = ref<StarStatistics>({
  currentBalance: 0,
  totalEarned: 0,
  totalSpent: 0,
  weekEarned: 0,
  todayEarned: 0,
})

const records = ref<StarRecord[]>([])
const currentFilter = ref<'all' | 'earn' | 'spend'>('all')
const showRedeemModal = ref(false)
const selectedItem = ref<{ id: number; name: string; icon: string; cost: number } | null>(null)
const redeemNote = ref('')

const filterTabs = [
  { label: '全部', value: 'all' as const },
  { label: '获得', value: 'earn' as const },
  { label: '消耗', value: 'spend' as const },
]

const redeemItems = [
  { id: 1, name: '30分钟游戏', icon: '🎮', cost: 10 },
  { id: 2, name: '1小时电视', icon: '📺', cost: 15 },
  { id: 3, name: '外出游玩', icon: '🎢', cost: 50 },
  { id: 4, name: '购买玩具', icon: '🧸', cost: 100 },
  { id: 5, name: '吃大餐', icon: '🍔', cost: 80 },
  { id: 6, name: '延迟睡觉', icon: '🌙', cost: 20 },
]

const filteredRecords = computed(() => {
  if (currentFilter.value === 'all') return records.value
  return records.value.filter(r => r.type === currentFilter.value)
})

const getSourceLabel = (source: string) => {
  const labels: Record<string, string> = {
    plan_complete: '完成任务',
    check_in: '打卡奖励',
    redeem: '兑换奖励',
    bonus: '额外奖励',
  }
  return labels[source] || source
}

const formatTime = (time: string) => {
  const date = new Date(time)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const selectRedeem = (item: typeof redeemItems[0]) => {
  if (statistics.value.currentBalance < item.cost) {
    alert('星星余额不足，继续加油学习吧！')
    return
  }
  selectedItem.value = item
  redeemNote.value = ''
  showRedeemModal.value = true
}

const confirmRedeem = async () => {
  if (!selectedItem.value) return

  try {
    await redeemStars(selectedItem.value.cost, selectedItem.value.name, redeemNote.value)
    alert(`成功兑换：${selectedItem.value.name}！`)
    showRedeemModal.value = false
    // 刷新数据
    await loadData()
    // 更新用户store中的星星数量
    userStore.setUserInfo({ ...userStore.userInfo!, starBalance: statistics.value.currentBalance - selectedItem.value.cost })
  } catch (error: any) {
    alert(error.message || '兑换失败')
  }
}

const loadData = async () => {
  try {
    const [statsData, recordsData] = await Promise.all([
      getStarStatistics(),
      getStarRecords(),
    ])
    statistics.value = statsData
    records.value = recordsData
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.rewards-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 5rem;
}

.stars-header {
  background: linear-gradient(135deg, #f4c430 0%, #f39c12 100%);
  padding: 2rem 1.5rem;
  text-align: center;
  color: #fff;
}

.stars-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.stars-icon {
  font-size: 3rem;
}

.stars-count {
  font-size: 3.5rem;
  font-weight: bold;
}

.stars-label {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 1.5rem;
}

.stars-stats {
  display: flex;
  justify-content: space-around;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.redeem-section {
  padding: 1.5rem 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 1rem;
}

.redeem-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.redeem-card {
  background: #fff;
  border-radius: 1rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid transparent;
}

.redeem-card:active {
  transform: scale(0.95);
}

.redeem-card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.redeem-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.redeem-name {
  display: block;
  font-size: 0.8rem;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.redeem-cost {
  font-size: 0.875rem;
  color: #f4c430;
  font-weight: 600;
}

.records-section {
  padding: 0 1rem 1rem;
}

.records-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
}

.filter-tab {
  padding: 0.375rem 0.75rem;
  border: none;
  background: #f1f3f4;
  border-radius: 1rem;
  font-size: 0.8rem;
  color: #636e72;
  cursor: pointer;
}

.filter-tab.active {
  background: #4ecdc4;
  color: #fff;
}

.records-list {
  background: #fff;
  border-radius: 1rem;
  overflow: hidden;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-info {
  flex: 1;
}

.record-title {
  display: block;
  font-size: 0.9rem;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.record-time {
  font-size: 0.75rem;
  color: #909399;
}

.record-amount {
  font-size: 1.1rem;
  font-weight: 600;
}

.record-amount.earn {
  color: #00b894;
}

.record-amount.spend {
  color: #ff6b6b;
}

.empty-records {
  text-align: center;
  padding: 3rem;
  color: #909399;
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
  z-index: 200;
}

.modal-content {
  background: #fff;
  width: 100%;
  max-width: 480px;
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
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
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.75rem;
  color: #909399;
  cursor: pointer;
}

.redeem-preview {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.preview-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.preview-name {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.preview-cost {
  color: #f4c430;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
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
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #fff;
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
