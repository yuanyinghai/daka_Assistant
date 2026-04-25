<template>
  <view class="register-page">
    <view class="register-header">
      <text class="title">创建账号</text>
      <text class="subtitle">开启学习之旅</text>
    </view>

    <view class="register-form">
      <u-input
        v-model="form.phone"
        placeholder="请输入手机号"
        :maxlength="11"
        type="number"
        clearable
      >
        <template #prefix>
          <u-icon name="phone" size="20" color="#909399" />
        </template>
      </u-input>

      <u-input
        v-model="form.password"
        placeholder="请输入密码（6-20位）"
        :maxlength="20"
        type="password"
        clearable
        class="mt-20"
      >
        <template #prefix>
          <u-icon name="lock" size="20" color="#909399" />
        </template>
      </u-input>

      <u-input
        v-model="form.nickname"
        placeholder="请输入昵称"
        :maxlength="50"
        clearable
        class="mt-20"
      >
        <template #prefix>
          <u-icon name="account" size="20" color="#909399" />
        </template>
      </u-input>

      <view class="role-select mt-20">
        <text class="label">选择角色：</text>
        <view class="role-options">
          <view
            class="role-option"
            :class="{ active: form.role === 'child' }"
            @click="form.role = 'child'"
          >
            <text class="icon">👦</text>
            <text class="text">我是孩子</text>
          </view>
          <view
            class="role-option"
            :class="{ active: form.role === 'parent' }"
            @click="form.role = 'parent'"
          >
            <text class="icon">👨</text>
            <text class="text">我是家长</text>
          </view>
        </view>
      </view>

      <u-button
        type="primary"
        size="large"
        :loading="loading"
        @click="handleRegister"
        class="mt-40"
      >
        注册
      </u-button>

      <view class="login-link" @click="goLogin">
        <text>已有账号？</text>
        <text class="link">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { register } from '@/api/auth';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const loading = ref(false);

const form = reactive({
  phone: '',
  password: '',
  nickname: '',
  role: 'child' as 'child' | 'parent',
});

const handleRegister = async () => {
  if (!form.phone || form.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!form.password || form.password.length < 6) {
    uni.showToast({ title: '密码长度不能少于6位', icon: 'none' });
    return;
  }
  if (!form.nickname) {
    uni.showToast({ title: '请输入昵称', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const res: any = await register(form);
    userStore.setToken(res.accessToken);
    userStore.setUserInfo(res.user);
    uni.showToast({ title: '注册成功', icon: 'success' });
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 1500);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  uni.navigateBack();
};
</script>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  padding: 40rpx;
}

.register-header {
  padding-top: 120rpx;
  margin-bottom: 80rpx;

  .title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 20rpx;
  }

  .subtitle {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
  }
}

.register-form {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 60rpx 40rpx;

  .mt-20 {
    margin-top: 20rpx;
  }

  .mt-40 {
    margin-top: 40rpx;
  }
}

.role-select {
  .label {
    font-size: 28rpx;
    color: #606266;
    margin-bottom: 20rpx;
    display: block;
  }

  .role-options {
    display: flex;
    gap: 20rpx;

    .role-option {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 30rpx;
      background: #f5f7fa;
      border-radius: 16rpx;
      border: 2rpx solid transparent;
      transition: all 0.3s;

      &.active {
        background: #e8f8f5;
        border-color: #4ecdc4;
      }

      .icon {
        font-size: 48rpx;
        margin-bottom: 10rpx;
      }

      .text {
        font-size: 26rpx;
        color: #606266;
      }
    }
  }
}

.login-link {
  margin-top: 40rpx;
  text-align: center;
  font-size: 28rpx;
  color: #909399;

  .link {
    color: #4ecdc4;
    margin-left: 10rpx;
  }
}
</style>
