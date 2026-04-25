import { http } from '@/utils/request'

export interface StarRecord {
  id: string
  amount: number
  type: 'earn' | 'spend'
  source: string
  description: string
  balanceAfter: number
  createdAt: string
}

export interface StarStatistics {
  currentBalance: number
  totalEarned: number
  totalSpent: number
  weekEarned: number
  todayEarned: number
}

// 获取积分明细
export const getStarRecords = (type?: 'earn' | 'spend') => {
  const params: Record<string, string> = {}
  if (type) params.type = type
  return http.get<StarRecord[]>('/stars/records', params)
}

// 获取积分统计
export const getStarStatistics = () => {
  return http.get<StarStatistics>('/stars/statistics')
}

// 兑换星星
export const redeemStars = (amount: number, item: string, note?: string) => {
  return http.post('/stars/redeem', { amount, item, note })
}
