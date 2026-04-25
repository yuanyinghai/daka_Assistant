<template>
  <view class="login-page">
    <view class="login-header">
      <text class="title">欢迎回来</text>
      <text class="subtitle">登录后继续学习之旅</text>
    </view>

    <view class="login-form">
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
        placeholder="请输入密码"
        :maxlength="20"
        type="password"
        clearable
        class="mt-20"
      >
        <template #prefix>
          <u-icon name="lock" size="20" color="#909399" />
        </template>
      </u-input>

      <u-button
        type="primary"
        size="large"
        :loading="loading"
        @click="handleLogin"
        class="mt-40"
      >
        登录
      </u-button>

      <view class="register-link" @click="goRegister">
        <text>还没有账号？</text>
        <text class="link">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { login } from '@/api/auth';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const loading = ref(false);

const form = reactive({
  phone: '',
  password: '',
});

const handleLogin = async () => {
  if (!form.phone || form.phone.length !== 11) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (!form.password || form.password.length < 6) {
    uni.showToast({ title: '密码长度不能少于6位', icon: 'none' });
    return;
  }

  loading.value = true;
  try {
    const res: any = await login(form);
    userStore.setToken(res.accessToken);
    userStore.setUserInfo(res.user);
    uni.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' });
    }, 1500);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const goRegister = () => {
  uni.navigateTo({ url: '/pages/register/index' });
};
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
}

.login-header {
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

.login-form {
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

.register-link {
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
