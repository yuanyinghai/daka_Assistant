import { http } from '@/utils/request'

export interface CheckInData {
  note?: string
  actualDuration?: number
  attachments?: string[]
}

export interface PlanRecord {
  id: string
  planId: string
  scheduledDate: string
  status: 'pending' | 'completed' | 'missed' | 'reviewing'
  checkInTime?: string
  actualDuration?: number
  note?: string
  earnedStars: number
}

// 打卡
export const checkIn = (recordId: string, data?: CheckInData) => {
  return http.post<PlanRecord>(`/plan-records/${recordId}/check-in`, data)
}

// 获取我的打卡记录
export const getMyRecords = (startDate?: string, endDate?: string) => {
  const params: Record<string, string> = {}
  if (startDate) params.startDate = startDate
  if (endDate) params.endDate = endDate
  return http.get<PlanRecord[]>('/plan-records/my-records', params)
}

// 获取待审核记录（家长）
export const getPendingReviews = () => {
  return http.get<PlanRecord[]>('/plan-records/pending-reviews')
}

// 审核打卡
export const reviewRecord = (recordId: string, approved: boolean, note?: string) => {
  return http.post<PlanRecord>(`/plan-records/${recordId}/review`, {
    approved,
    note
  })
}
