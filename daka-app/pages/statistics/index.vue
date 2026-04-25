<template>
  <view class="statistics-page">
    <!-- 时间维度切换 -->
    <view class="time-tabs">
      <view
        v-for="tab in timeTabs"
        :key="tab.value"
        class="tab-item"
        :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value"
      >
        {{ tab.label }}
      </view>
    </view>

    <!-- 核心数据卡片 -->
    <view class="stats-grid">
      <view class="stat-card">
        <view class="stat-icon blue">📋</view>
        <text class="stat-label">总任务</text>
        <text class="stat-value">{{ summary.totalTasks || 0 }}</text>
      </view>
      <view class="stat-card">
        <view class="stat-icon green">✅</view>
        <text class="stat-label">已完成</text>
        <text class="stat-value">{{ summary.completedTasks || 0 }}</text>
      </view>
      <view class="stat-card">
        <view class="stat-icon orange">📊</view>
        <text class="stat-label">完成率</text>
        <text class="stat-value">{{ summary.completionRate || 0 }}%</text>
      </view>
    </view>

    <!-- 学习时长 -->
    <view class="duration-card">
      <view class="duration-header">
        <text class="duration-title">⏱️ 累计学习时长</text>
      </view>
      <view class="duration-value">{{ formatDuration(summary.totalStudySeconds || 0) }}</view>
      <view class="duration-detail">
        <text>日均 {{ formatDuration(summary.averageDailySeconds || 0) }}</text>
      </view>
    </view>

    <!-- 完成率趋势 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">完成率趋势</text>
      </view>
      <view class="chart-placeholder">
        <text>📈 图表区域</text>
        <text class="sub">（后续接入图表组件）</text>
      </view>
    </view>

    <!-- 科目分布 -->
    <view class="chart-card">
      <view class="chart-header">
        <text class="chart-title">科目分布</text>
      </view>
      <view class="chart-placeholder">
        <text>🥧 饼图区域</text>
        <text class="sub">（后续接入图表组件）</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const currentTab = ref('7days');

const timeTabs = [
  { label: '最近7天', value: '7days' },
  { label: '最近30天', value: '30days' },
  { label: '本学期', value: 'semester' },
];

const summary = reactive({
  totalTasks: 45,
  completedTasks: 38,
  completionRate: 84,
  totalStudySeconds: 462600, // 128.5小时
  averageDailySeconds: 15120, // 4.2小时
});

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? minutes + '分钟' : ''}`;
  }
  return `${minutes}分钟`;
};
</script>

<style scoped lang="scss">
.statistics-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20rpx;
}

.time-tabs {
  display: flex;
  background: #f1f3f4;
  border-radius: 12rpx;
  padding: 8rpx;
  margin-bottom: 20rpx;

  .tab-item {
    flex: 1;
    text-align: center;
    padding: 20rpx;
    border-radius: 10rpx;
    font-size: 28rpx;
    color: #636e72;
    transition: all 0.3s;

    &.active {
      background: #ffffff;
      color: #2d3436;
      font-weight: 600;
      box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    }
  }
}

.stats-grid {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;

  .stat-card {
    flex: 1;
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx 20rpx;
    text-align: center;

    .stat-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      margin: 0 auto 16rpx;

      &.blue {
        background: #e3f2fd;
      }

      &.green {
        background: #e8f5e9;
      }

      &.orange {
        background: #fff3e0;
      }
    }

    .stat-label {
      display: block;
      font-size: 24rpx;
      color: #636e72;
      margin-bottom: 10rpx;
    }

    .stat-value {
      display: block;
      font-size: 40rpx;
      font-weight: bold;
      color: #2d3436;
    }
  }
}

.duration-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 20rpx;
  color: #ffffff;

  .duration-header {
    margin-bottom: 20rpx;

    .duration-title {
      font-size: 28rpx;
      opacity: 0.9;
    }
  }

  .duration-value {
    font-size: 56rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
  }

  .duration-detail {
    font-size: 26rpx;
    opacity: 0.8;
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.3);
  }
}

.chart-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .chart-header {
    margin-bottom: 30rpx;

    .chart-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d3436;
    }
  }

  .chart-placeholder {
    height: 300rpx;
    background: #f8f9fa;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10rpx;

    text {
      font-size: 32rpx;
      color: #909399;

      &.sub {
        font-size: 24rpx;
      }
    }
  }
}
</style>
