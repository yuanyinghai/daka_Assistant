import { http } from '@/utils/request'

export interface LearningAdvice {
  type: 'strength' | 'weakness' | 'suggestion' | 'encouragement'
  title: string
  content: string
  action?: string
}

export interface WeeklyReport {
  period: { start: string; end: string }
  summary: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    totalStudyMinutes: number
    earnedStars: number
  }
  highlights: string[]
  improvements: string[]
  nextWeekGoals: string[]
  aiInsights: string
}

export interface SmartReminder {
  type: 'urgent' | 'suggestion' | 'motivation'
  title: string
  message: string
  action?: string
}

export interface MemoryReminder {
  planId: string
  title: string
  reviewDate: string
  daysSince: number
}

// 获取学习建议
export const getLearningAdvice = () => {
  return http.get<LearningAdvice[]>('/ai/learning-advice')
}

// 获取周报
export const getWeeklyReport = () => {
  return http.get<WeeklyReport>('/ai/weekly-report')
}

// 获取智能提醒
export const getSmartReminders = () => {
  return http.get<SmartReminder[]>('/ai/smart-reminders')
}

// 获取艾宾浩斯复习提醒
export const getMemoryCurveReminders = () => {
  return http.get<MemoryReminder[]>('/ai/memory-curve')
}
