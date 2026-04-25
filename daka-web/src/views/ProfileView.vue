<template>
  <div class="profile-page">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="user-avatar">
        {{ userStore.userInfo?.nickname?.charAt(0) || '?' }}
      </div>
      <div class="user-info">
        <h2 class="nickname">{{ userStore.userInfo?.nickname || '未设置昵称' }}</h2>
        <span class="role-badge">{{ userRoleText }}</span>
      </div>
      <div class="star-info">
        <span class="star-icon">⭐</span>
        <span class="star-count">{{ userStore.starBalance }}</span>
      </div>
    </div>

    <!-- 统计数据 -->
    <div class="stats-card">
      <div class="stat-item">
        <span class="stat-value">{{ stats.continuousDays || 0 }}</span>
        <span class="stat-label">连续打卡</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.totalCompletedPlans || 0 }}</span>
        <span class="stat-label">完成计划</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ formatTime(stats.totalStudySeconds || 0) }}</span>
        <span class="stat-label">学习时长</span>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-list">
      <div class="menu-item" @click="editProfile">
        <span class="menu-icon">✏️</span>
        <span class="menu-text">编辑资料</span>
        <span class="arrow">→</span>
      </div>

      <div class="menu-item" @click="manageFamily">
        <span class="menu-icon">🏠</span>
        <span class="menu-text">家庭管理</span>
        <span class="arrow">→</span>
      </div>

      <div class="menu-item" @click="goToSettings">
        <span class="menu-icon">⚙️</span>
        <span class="menu-text">设置</span>
        <span class="arrow">→</span>
      </div>

      <div class="menu-item logout" @click="confirmLogout">
        <span class="menu-icon">🚪</span>
        <span class="menu-text logout-text">退出登录</span>
        <span class="arrow">→</span>
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
      <router-link to="/profile" class="tab-item active">
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

const router = useRouter()
const userStore = useUserStore()

const userRoleText = computed(() => {
  return userStore.userRole === 'parent' ? '家长' : '孩子'
})

const stats = ref({
  continuousDays: 0,
  totalCompletedPlans: 0,
  totalStudySeconds: 0
})

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  return `${hours}h`
}

const editProfile = () => {
  alert('编辑资料功能开发中...')
}

const manageFamily = () => {
  alert('家庭管理功能开发中...')
}

const goToSettings = () => {
  alert('设置功能开发中...')
}

const confirmLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.replace('/login')
  }
}

onMounted(() => {
  userStore.initFromStorage()
  getUserStatistics().then((data) => {
    stats.value = data
  }).catch(() => {
    // 使用默认值
  })
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 5rem;
}

.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border-radius: 0 0 1.5rem 1.5rem;
  padding: 2rem 1.5rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 4rem;
  height: 4rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #ffffff;
  margin-right: 1rem;
}

.user-info {
  flex: 1;
}

.nickname {
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.role-badge {
  display: inline-block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.star-info {
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
  color: #ffffff;
}

.stats-card {
  display: flex;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1.5rem;
  margin: 0 1rem 1rem;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3436;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #909399;
}

.menu-list {
  background: #ffffff;
  border-radius: 1rem;
  margin: 0 1rem;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f5f7fa;
}

.menu-item.logout {
  margin-top: 0.75rem;
  border-top: 0.75rem solid #f8f9fa;
}

.menu-icon {
  width: 2.25rem;
  height: 2.25rem;
  background: #e8f8f5;
  border-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-right: 0.875rem;
}

.menu-item.logout .menu-icon {
  background: #ffebee;
}

.menu-text {
  flex: 1;
  font-size: 1rem;
  color: #2d3436;
}

.menu-text.logout-text {
  color: #ff6b6b;
}

.arrow {
  font-size: 1.25rem;
  color: #c0c4cc;
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
