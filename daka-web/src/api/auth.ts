import { http } from '@/utils/request'

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

export const login = (data: LoginParams) => {
  return http.post<AuthResponse>('/auth/login', data)
}

export const register = (data: RegisterParams) => {
  return http.post<AuthResponse>('/auth/register', data)
}
