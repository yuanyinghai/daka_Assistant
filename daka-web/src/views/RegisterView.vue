<template>
  <div class="register-page">
    <div class="register-header">
      <h1 class="title">创建账号</h1>
      <p class="subtitle">开启学习之旅</p>
    </div>

    <div class="register-form">
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
          placeholder="请输入密码（6-20位）"
          class="input-field"
        />
      </div>

      <div class="input-group">
        <span class="input-icon">👤</span>
        <input
          v-model="form.nickname"
          type="text"
          placeholder="请输入昵称"
          class="input-field"
        />
      </div>

      <div class="role-select">
        <p class="label">选择角色：</p>
        <div class="role-options">
          <div
            class="role-option"
            :class="{ active: form.role === 'child' }"
            @click="form.role = 'child'"
          >
            <span class="role-icon">👦</span>
            <span class="role-text">我是孩子</span>
          </div>
          <div
            class="role-option"
            :class="{ active: form.role === 'parent' }"
            @click="form.role = 'parent'"
          >
            <span class="role-icon">👨</span>
            <span class="role-text">我是家长</span>
          </div>
        </div>
      </div>

      <button 
        class="register-btn" 
        :disabled="loading"
        @click="handleRegister"
      >
        {{ loading ? '注册中...' : '注册' }}
      </button>

      <div class="login-link">
        <span>已有账号？</span>
        <router-link to="/login" class="link">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { register } from '@/api/auth'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const form = reactive({
  phone: '',
  password: '',
  nickname: '',
  role: 'child' as 'child' | 'parent'
})

const handleRegister = async () => {
  if (!form.phone || form.phone.length !== 11) {
    alert('请输入正确的手机号')
    return
  }
  if (!form.password || form.password.length < 6) {
    alert('密码长度不能少于6位')
    return
  }
  if (!form.nickname) {
    alert('请输入昵称')
    return
  }

  loading.value = true
  try {
    const res = await register(form)
    userStore.setToken(res.accessToken)
    userStore.setUserInfo(res.user)
    alert('注册成功！')
    router.replace('/')
  } catch (error: any) {
    alert(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.register-header {
  padding-top: 3rem;
  margin-bottom: 2rem;
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

.register-form {
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 2rem;
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

.role-select {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 0.9rem;
  color: #606266;
  margin-bottom: 0.75rem;
}

.role-options {
  display: flex;
  gap: 1rem;
}

.role-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  background: #f5f7fa;
  border-radius: 1rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.role-option.active {
  background: #e8f8f5;
  border-color: #4ecdc4;
}

.role-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.role-text {
  font-size: 0.9rem;
  color: #606266;
}

.register-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
  color: #ffffff;
  border: none;
  border-radius: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link {
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
</style>
