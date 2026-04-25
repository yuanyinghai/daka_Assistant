import { http } from '@/utils/request'

export interface CreatePlanData {
  title: string
  category: string
  description?: string
  startTime: string
  endTime: string
  rewardStars: number
  penaltyStars?: number
  needReview?: boolean
  repeatType?: string
  repeatDays?: number[]
  startDate?: string
  endDate?: string
}

export interface StudyPlan {
  id: string
  title: string
  category: string
  description: string
  startTime: string
  endTime: string
  rewardStars: number
  penaltyStars: number
  needReview: boolean
  repeatType: string
  status: string
  recordStatus?: string
  recordId?: string
}

// 创建学习计划
export const createPlan = (data: CreatePlanData) => {
  return http.post<StudyPlan>('/study-plans', data)
}

// 获取所有学习计划
export const getPlans = () => {
  return http.get<StudyPlan[]>('/study-plans')
}

// 获取今日计划
export const getTodayPlans = () => {
  return http.get<StudyPlan[]>('/study-plans/today')
}

// 获取计划详情
export const getPlanDetail = (id: string) => {
  return http.get<StudyPlan>(`/study-plans/${id}`)
}

// 更新计划
export const updatePlan = (id: string, data: Partial<CreatePlanData>) => {
  return http.put<StudyPlan>(`/study-plans/${id}`, data)
}

// 删除/暂停计划
export const deletePlan = (id: string) => {
  return http.delete(`/study-plans/${id}`)
}
