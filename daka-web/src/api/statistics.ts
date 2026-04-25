import { http } from '@/utils/request'

export interface OverviewStatistics {
  totalStudyHours: number
  totalStudyMinutes: number
  totalCompletedPlans: number
  continuousDays: number
  maxContinuousDays: number
  totalEarnedStars: number
  currentStars: number
  todayTotal: number
  todayCompleted: number
  todayCompletionRate: number
  weekTotal: number
  weekCompleted: number
  weekCompletionRate: number
  monthTotal: number
  monthCompleted: number
  monthCompletionRate: number
}

export interface CompletionTrendItem {
  date: string
  total: number
  completed: number
  completionRate: number
}

export interface CategoryDistributionItem {
  category: string
  count: number
  completed: number
}

export interface DurationTrendItem {
  date: string
  durationMinutes: number
  taskCount: number
}

// 获取概览统计
export const getOverview = () => {
  return http.get<OverviewStatistics>('/statistics/overview')
}

// 获取完成率趋势
export const getCompletionTrend = (days?: number) => {
  const params: Record<string, string> = {}
  if (days) params.days = days.toString()
  return http.get<CompletionTrendItem[]>('/statistics/completion-trend', params)
}

// 获取科目分布
export const getCategoryDistribution = () => {
  return http.get<CategoryDistributionItem[]>('/statistics/category-distribution')
}

// 获取学习时长趋势
export const getDurationTrend = (days?: number) => {
  const params: Record<string, string> = {}
  if (days) params.days = days.toString()
  return http.get<DurationTrendItem[]>('/statistics/duration-trend', params)
}

// 获取详细报告
export const getDetailedReport = (startDate: string, endDate: string) => {
  return http.get('/statistics/detailed-report', { startDate, endDate })
}
