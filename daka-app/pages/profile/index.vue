<template>
  <view class="profile-page">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-avatar">
        <u-avatar :text="userInfo?.nickname?.charAt(0)" size="80" />
      </view>
      <view class="user-info">
        <text class="nickname">{{ userInfo?.nickname || '未设置昵称' }}</text>
        <text class="role">{{ userRoleText }}</text>
      </view>
      <view class="star-info">
        <u-icon name="star-fill" color="#FFD93D" size="32" />
        <text class="star-count">{{ starBalance }}</text>
      </view>
    </view>

    <!-- 统计数据 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-value">{{ statistics.continuousDays || 0 }}</text>
        <text class="stat-label">连续打卡</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ statistics.totalCompletedPlans || 0 }}</text>
        <text class="stat-label">完成计划</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ formatTime(statistics.totalStudySeconds || 0) }}</text>
        <text class="stat-label">学习时长</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-list">
      <view class="menu-item" @click="editProfile">
        <view class="menu-icon">
          <u-icon name="edit-pen" size="24" color="#4ecdc4" />
        </view>
        <text class="menu-text">编辑资料</text>
        <u-icon name="arrow-right" size="16" color="#c0c4cc" />
      </view>

      <view class="menu-item" @click="manageFamily">
        <view class="menu-icon">
          <u-icon name="home" size="24" color="#4ecdc4" />
        </view>
        <text class="menu-text">家庭管理</text>
        <u-icon name="arrow-right" size="16" color="#c0c4cc" />
      </view>

      <view class="menu-item" @click="goToSettings">
        <view class="menu-icon">
          <u-icon name="setting" size="24" color="#4ecdc4" />
        </view>
        <text class="menu-text">设置</text>
        <u-icon name="arrow-right" size="16" color="#c0c4cc" />
      </view>

      <view class="menu-item logout" @click="confirmLogout">
        <view class="menu-icon">
          <u-icon name="logout" size="24" color="#ff6b6b" />
        </view>
        <text class="menu-text" style="color: #ff6b6b">退出登录</text>
        <u-icon name="arrow-right" size="16" color="#c0c4cc" />
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { getUserStatistics } from '@/api/user';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const starBalance = computed(() => userStore.starBalance);

const userRoleText = computed(() => {
  return userStore.userRole === 'parent' ? '家长' : '孩子';
});

const statistics = ref({
  continuousDays: 0,
  totalCompletedPlans: 0,
  totalStudySeconds: 0,
});

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  return `${hours}h`;
};

const editProfile = () => {
  uni.showToast({ title: '编辑资料', icon: 'none' });
};

const manageFamily = () => {
  uni.showToast({ title: '家庭管理', icon: 'none' });
};

const goToSettings = () => {
  uni.showToast({ title: '设置', icon: 'none' });
};

const confirmLogout = () => {
  uni.showModal({
    title: '确认退出',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout();
        uni.reLaunch({ url: '/pages/login/index' });
      }
    },
  });
};

onMounted(() => {
  userStore.initFromStorage();
  // 加载统计数据
  getUserStatistics().then((res: any) => {
    statistics.value = res;
  }).catch(() => {
    // 使用默认值
  });
});
</script>

<style scoped lang="scss">
.profile-page {
  min-height: : #f8f9fa;
  padding: 20rpx;
}

.user-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;

  .user-avatar {
    margin-right: 30rpx;
  }

  .user-info {
    flex: 1;

    .nickname {
      display: block;
      font-size: 36rpx;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 10rpx;
    }

    .role {
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .star-info {
    display: flex;
    align-items: center;
    gap: 10rpx;
    background: rgba(255, 255, 255, 0.2);
    padding: 16rpx 24rpx;
    border-radius: 30rpx;

    .star-count {
      font-size: 32rpx;
      font-weight: bold;
      color: #ffffff;
    }
  }
}

.stats-card {
  display: flex;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .stat-item {
    flex: 1;
    text-align: center;

    .stat-value {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #2d3436;
      margin-bottom: 10rpx;
    }

    .stat-label {
      font-size: 24rpx;
      color: #909399;
    }
  }
}

.menu-list {
  background: #ffffff;
  border-radius: 20rpx;
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    &.logout {
      margin-top: 20rpx;
      border-top: 20rpx solid #f8f9fa;
    }

    .menu-icon {
      width: 60rpx;
      height: 60rpx;
      background: #e8f8f5;
      border-radius: 16rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 20rpx;
    }

    .menu-text {
      flex: 1;
      font-size: 30rpx;
      color: #2d3436;
    }
  }
}
</style>
