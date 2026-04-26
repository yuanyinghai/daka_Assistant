import { authApi } from '@/utils/supabase'

export interface LoginParams {
  phone: string
  password: string
}

export interface RegisterParams {
  phone: string
  password: string
  nickname: string
  role: 'child' | 'parent'
}

export interface AuthResponse {
  accessToken: string
  user: {
    id: string
    phone: string
    nickname: string
    role: 'child' | 'parent'
    avatarUrl?: string
    starBalance: number
  }
}

export const login = async (data: LoginParams) => {
  // 使用 email 字段存储 phone
  const user = await authApi.login(data.phone, data.password)
  return {
    accessToken: user.id, // 使用用户ID作为token
    user: {
      id: user.id,
      phone: user.email, // email字段存储的是phone
      nickname: user.nickname,
      role: user.role || 'parent',
      avatarUrl: user.avatar_url,
      starBalance: 0
    }
  }
}

export const register = async (data: RegisterParams) => {
  const user = await authApi.register(data.phone, data.password, data.nickname)
  return {
    accessToken: user.id,
    user: {
      id: user.id,
      phone: user.email,
      nickname: user.nickname,
      role: data.role,
      avatarUrl: user.avatar_url,
      starBalance: 0
    }
  }
}
