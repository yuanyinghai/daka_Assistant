<template>
  <div class="login-page">
    <div class="login-header">
      <h1 class="title">欢迎回来</h1>
      <p class="subtitle">继续你的学习之旅</p>
    </div>

    <div class="login-form">
      <div class="input-group">
        <span class="input-icon">📱</span>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="请输入手机号"
          maxlength="11"
          class="input-field"
        />
      </div>

      <div class="input-group">
        <span class="input-icon">🔒</span>
        <input
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          class="input-field"
        />
      </div>

      <button 
        class="login-btn" 
        :disabled="loading"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>

      <div class="register-link">
        <span>还没有账号？</span>
        <router-link to="/register" class="link">立即注册</router-link>
      </div>
    </div>

    <!-- 底部装饰 -->
    <div class="decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  phone: '',
  password: ''
})

const handleLogin = async () => {
  if (!form.phone || form.phone.length !== 11) {
    alert('请输入正确的手机号')
    return
  }
  if (!form.password) {
    alert('请输入密码')
    return
  }

  loading.value = true
  try {
    const res = await login(form)
    userStore.setToken(res.accessToken)
    userStore.setUserInfo(res.user)
    router.replace('/')
  } catch (error: any) {
    alert(error.message || '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.login-header {
  padding-top: 4rem;
  margin-bottom: 3rem;
  z-index: 1;
}

.title {
  font-size: 2rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.login-form {
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2rem;
  z-index: 1;
}

.input-group {
  display: flex;
  align-items: center;
  background: #f5f7fa;
  border-radius: 1rem;
  padding: 0 1rem;
  margin-bottom: 1rem;
}

.input-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.input-field {
  flex: 1;
  border: none;
  background: transparent;
  padding: 1rem 0;
  font-size: 1rem;
  outline: none;
}

.input-field::placeholder {
  color: #909399;
}

.login-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: opacity 0.3s;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: #909399;
}

.link {
  color: #4ecdc4;
  text-decoration: none;
  margin-left: 0.25rem;
}

.decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
}

.circle-2 {
  width: 150px;
  height: 150px;
  bottom: 50px;
  left: -30px;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 150px;
  right: 50px;
}
</style>
