<template>
  <view class="plans-page">
    <!-- 周视图 -->
    <view class="week-view">
      <view
        v-for="(day, index) in weekDays"
        :key="index"
        class="day-item"
        :class="{ active: selectedDay === index }"
        @click="selectDay(index)"
      >
        <text class="day-label">{{ day.label }}</text>
        <text class="day-date">{{ day.date }}</text>
        <text v-if="day.count > 0" class="day-count">{{ day.count }}</text>
      </view>
    </view>

    <!-- 计划列表 -->
    <view class="plan-list">
      <view v-if="plans.length === 0" class="empty-state">
        <u-icon name="list" size="60" color="#ddd" />
        <text>这一天还没有计划</text>
        <u-button type="primary" size="small" @click="showAddModal = true">
          添加计划
        </u-button>
      </view>

      <view
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        :class="{ completed: plan.isCompleted }"
      >
        <view class="plan-icon">{{ getCategoryIcon(plan.category) }}</view>
        <view class="plan-content">
          <text class="plan-title">{{ plan.title }}</text>
          <text class="plan-time">{{ plan.startTime }} - {{ plan.endTime }}</text>
          <view class="plan-tags">
            <text class="tag reward">+{{ plan.rewardStars }}⭐</text>
            <text v-if="plan.needReview" class="tag review">需审核</text>
          </view>
        </view>
        <view class="plan-action">
          <u-button
            v-if="!plan.isCompleted"
            type="primary"
            size="mini"
            @click="completePlan(plan.id)"
          >
            打卡
          </u-button>
          <text v-else class="completed-text">已完成</text>
        </view>
      </view>
    </view>

    <!-- 添加按钮 -->
    <view class="fab-button" @click="showAddModal = true">
      <u-icon name="plus" color="#fff" size="24" />
    </view>

    <!-- 添加计划弹窗 -->
    <u-popup v-model:show="showAddModal" mode="bottom" round="20">
      <view class="add-modal">
        <view class="modal-header">
          <text class="modal-title">添加学习计划</text>
          <u-icon name="close" size="20" @click="showAddModal = false" />
        </view>

        <view class="modal-body">
          <u-input
            v-model="newPlan.title"
            placeholder="计划名称"
            border="bottom"
            class="mb-20"
          />

          <view class="category-select mb-20">
            <text class="label">选择分类：</text>
            <scroll-view scroll-x class="category-scroll">
              <view
                v-for="cat in categories"
                :key="cat.id"
                class="category-item"
                :class="{ active: newPlan.category === cat.id }"
                @click="newPlan.category = cat.id"
              >
                <text class="icon">{{ cat.icon }}</text>
                <text class="name">{{ cat.name }}</text>
              </view>
            </scroll-view>
          </view>

          <u-input
            v-model="newPlan.startTime"
            placeholder="开始时间（如：16:00）"
            border="bottom"
            class="mb-20"
          />

          <u-input
            v-model="newPlan.endTime"
            placeholder="结束时间（如：17:00）"
            border="bottom"
            class="mb-20"
          />

          <view class="reward-setting">
            <text class="label">奖励星星：</text>
            <u-slider v-model="newPlan.rewardStars" :min="1" :max="10" show-value />
          </view>
        </view>

        <view class="modal-footer">
          <u-button type="primary" size="large" @click="addPlan">确认添加</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

const selectedDay = ref(0);
const showAddModal = ref(false);
const plans = ref<any[]>([]);

// 周数据
const weekDays = ref([
  { label: '一', date: '24', count: 3 },
  { label: '二', date: '25', count: 2 },
  { label: '三', date: '26', count: 4 },
  { label: '四', date: '27', count: 0 },
  { label: '五', date: '28', count: 2 },
  { label: '六', date: '29', count: 1 },
  { label: '日', date: '30', count: 0 },
]);

// 分类
const categories = [
  { id: 1, name: '语文', icon: '📖' },
  { id: 2, name: '数学', icon: '📐' },
  { id: 3, name: '英语', icon: '🔤' },
  { id: 4, name: '科学', icon: '🔬' },
  { id: 5, name: '艺术', icon: '🎨' },
  { id: 6, name: '音乐', icon: '🎵' },
  { id: 7, name: '体育', icon: '⚽' },
  { id: 8, name: '阅读', icon: '📚' },
];

// 新计划
const newPlan = reactive({
  title: '',
  category: 1,
  startTime: '',
  endTime: '',
  rewardStars: 3,
});

const selectDay = (index: number) => {
  selectedDay.value = index;
  // TODO: 加载当天的计划
};

const getCategoryIcon = (category: number) => {
  const cat = categories.find((c) => c.id === category);
  return cat?.icon || '📋';
};

const completePlan = (planId: string) => {
  uni.showToast({ title: '打卡成功！', icon: 'success' });
};

const addPlan = () => {
  if (!newPlan.title) {
    uni.showToast({ title: '请输入计划名称', icon: 'none' });
    return;
  }
  uni.showToast({ title: '添加成功', icon: 'success' });
  showAddModal.value = false;
  // TODO: 调用API添加计划
};
</script>

<style scoped lang="scss">
.plans-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.week-view {
  display: flex;
  background: #ffffff;
  padding: 20rpx;
  gap: 10rpx;

  .day-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 10rpx;
    border-radius: 16rpx;
    background: #f5f7fa;

    &.active {
      background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);

      .day-label,
      .day-date {
        color: #ffffff;
      }
    }

    .day-label {
      font-size: 24rpx;
      color: #909399;
      margin-bottom: 8rpx;
    }

    .day-date {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d3436;
      margin-bottom: 8rpx;
    }

    .day-count {
      font-size: 20rpx;
      color: #4ecdc4;
      background: #e8f8f5;
      padding: 4rpx 12rpx;
      border-radius: 10rpx;
    }
  }
}

.plan-list {
  padding: 20rpx;

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 100rpx 0;
    gap: 20rpx;

    text {
      font-size: 28rpx;
      color: #909399;
    }
  }
}

.plan-card {
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-left: 8rpx solid #4ecdc4;

  &.completed {
    border-left-color: #00b894;
    opacity: 0.7;
    background: #e8f8f5;
  }

  .plan-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
  }

  .plan-content {
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
      margin-bottom: 10rpx;
      display: block;
    }

    .plan-tags {
      display: flex;
      gap: 10rpx;

      .tag {
        font-size: 22rpx;
        padding: 4rpx 12rpx;
        border-radius: 8rpx;

        &.reward {
          background: #fff9e6;
          color: #f4c430;
        }

        &.review {
          background: #fce4ec;
          color: #e91e63;
        }
      }
    }
  }

  .plan-action {
    .completed-text {
      font-size: 26rpx;
      color: #00b894;
    }
  }
}

.fab-button {
  position: fixed;
  right: 40rpx;
  bottom: 140rpx;
  width: 100rpx;
  height: 100rpx;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(78, 205, 196, 0.4);
}

.add-modal {
  padding: 30rpx;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;

    .modal-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #2d3436;
    }
  }

  .modal-body {
    .mb-20 {
      margin-bottom: 20rpx;
    }

    .label {
      font-size: 28rpx;
      color: #606266;
      margin-bottom: 15rpx;
      display: block;
    }

    .category-select {
      .category-scroll {
        white-space: nowrap;

        .category-item {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          padding: 20rpx;
          margin-right: 20rpx;
          background: #f5f7fa;
          border-radius: 16rpx;
          border: 2rpx solid transparent;

          &.active {
            background: #e8f8f5;
            border-color: #4ecdc4;
          }

          .icon {
            font-size: 40rpx;
            margin-bottom: 8rpx;
          }

          .name {
            font-size: 24rpx;
            color: #606266;
          }
        }
      }
    }

    .reward-setting {
      margin-top: 30rpx;
    }
  }

  .modal-footer {
    margin-top: 40rpx;
  }
}
</style>
