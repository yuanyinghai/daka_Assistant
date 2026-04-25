<template>
  <view class="home-page">
    <!-- Header -->
    <view class="header">
      <view class="user-info">
        <u-avatar :text="userInfo?.nickname?.charAt(0)" size="40" />
        <text class="greeting">你好，{{ userInfo?.nickname || '同学' }}！</text>
      </view>
      <view class="star-balance" @click="goToRewards">
        <u-icon name="star-fill" color="#FFD93D" size="20" />
        <text class="star-count">{{ starBalance }}</text>
      </view>
    </view>

    <!-- 连续打卡卡片 -->
    <view class="streak-card">
      <view class="streak-info">
        <text class="flame">🔥</text>
        <text class="days">{{ userInfo?.continuousDays || 0 }}</text>
        <text class="label">天连续打卡</text>
      </view>
      <view class="stats">
        <text>累计完成 {{ userInfo?.totalCompletedPlans || 0 }} 个计划</text>
      </view>
    </view>

    <!-- 今日任务列表 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">今日任务</text>
        <text class="view-all" @click="goToPlans">查看全部 ></text>
      </view>

      <view v-if="todayPlans.length === 0" class="empty-state">
        <u-icon name="list" size="60" color="#ddd" />
        <text>今天还没有计划哦</text>
        <u-button type="primary" size="small" @click="goToPlans">添加计划</u-button>
      </view>

      <view v-else class="plan-list">
        <view
          v-for="plan in todayPlans"
          :key="plan.id"
          class="plan-item"
          :class="{ completed: plan.isCompleted }"
        >
          <view class="plan-icon">{{ getCategoryIcon(plan.category) }}</view>
          <view class="plan-info">
            <text class="plan-title">{{ plan.title }}</text>
            <text class="plan-time">{{ plan.startTime || '全天' }}</text>
          </view>
          <view class="plan-action">
            <text v-if="plan.isCompleted" class="completed-text">已完成</text>
            <u-button
              v-else
              type="primary"
              size="mini"
              @click="completePlan(plan.id)"
            >
              打卡
            </u-button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const starBalance = computed(() => userStore.starBalance);

const todayPlans = ref<any[]>([]);

// 分类图标映射
const categoryIcons: Record<number, string> = {
  1: '📖', // 语文
  2: '📐', // 数学
  3: '🔤', // 英语
  4: '🔬', // 科学
  5: '🎨', // 艺术
  6: '🎵', // 音乐
  7: '⚽', // 体育
  8: '📚', // 阅读
  9: '💻', // 编程
  10: '✏️', // 写作
  11: '🧠', // 背诵
  12: '✍️', // 练习
  13: '📋', // 其他
};

const getCategoryIcon = (category: number) => {
  return categoryIcons[category] || '📋';
};

const completePlan = (planId: string) => {
  uni.showToast({ title: '打卡成功！', icon: 'success' });
  // TODO: 调用API完成打卡
};

const goToPlans = () => {
  uni.switchTab({ url: '/pages/plans/index' });
};

const goToRewards = () => {
  uni.navigateTo({ url: '/pages/rewards/index' });
};

onMounted(() => {
  userStore.initFromStorage();
  // TODO: 加载今日计划
});
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20rpx;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;

  .user-info {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .greeting {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d3436;
    }
  }

  .star-balance {
    display: flex;
    align-items: center;
    gap: 10rpx;
    background: #fff9e6;
    padding: 12rpx 24rpx;
    border-radius: 30rpx;

    .star-count {
      font-size: 32rpx;
      font-weight: bold;
      color: #f4c430;
    }
  }
}

.streak-card {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  color: #ffffff;

  .streak-info {
    display: flex;
    align-items: baseline;
    gap: 10rpx;
    margin-bottom: 20rpx;

    .flame {
      font-size: 48rpx;
    }

    .days {
      font-size: 72rpx;
      font-weight: bold;
    }

    .label {
      font-size: 28rpx;
      opacity: 0.9;
    }
  }

  .stats {
    font-size: 26rpx;
    opacity: 0.8;
  }
}

.section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d3436;
    }

    .view-all {
      font-size: 26rpx;
      color: #4ecdc4;
    }
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
  gap: 20rpx;

  text {
    font-size: 28rpx;
    color: #909399;
  }
}

.plan-list {
  .plan-item {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    margin-bottom: 20rpx;

    &.completed {
      opacity: 0.6;
      background: #e8f8f5;
    }

    .plan-icon {
      font-size: 48rpx;
      margin-right: 20rpx;
    }

    .plan-info {
      flex: 1;

      .plan-title {
        display: block;
        font-size: 30rpx;
        font-weight: 500;
        color: #2d3436;
        margin-bottom: 8rpx;
      }

      .plan-time {
        font-size: 24rpx;
        color: #909399;
      }
    }

    .plan-action {
      .completed-text {
        font-size: 26rpx;
        color: #00b894;
      }
    }
  }
}
</style>
