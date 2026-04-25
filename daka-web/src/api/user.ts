import { http } from '@/utils/request'

export interface UserProfile {
  id: string
  phone: string
  nickname: string
  role: 'child' | 'parent'
  avatarUrl?: string
  starBalance: number
  totalStudySeconds: number
  totalCompletedPlans: number
  continuousDays: number
  maxContinuousDays: number
}

export interface UserStatistics {
  totalStudySeconds: number
  totalCompletedPlans: number
  continuousDays: number
  maxContinuousDays: number
  starBalance: number
  totalEarnedStars: number
  totalSpentStars: number
}

export const getUserProfile = () => {
  return http.get<UserProfile>('/users/profile')
}

export const updateUserProfile = (data: { nickname?: string; avatarUrl?: string }) => {
  return http.put<UserProfile>('/users/profile', data)
}

export const getUserStatistics = () => {
  return http.get<UserStatistics>('/users/statistics')
}
