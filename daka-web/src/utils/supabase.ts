import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

console.log('Supabase URL:', supabaseUrl ? '已设置' : '未设置')
console.log('Supabase Key:', supabaseKey ? '已设置' : '未设置')

if (!supabaseUrl || !supabaseKey) {
  console.error('错误：Supabase 环境变量未设置！')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// 用户相关操作
export const authApi = {
  // 注册
  async register(email: string, password: string, nickname: string) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password, nickname }])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // 登录
  async login(email: string, password: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single()
    
    if (error || !data) throw new Error('邮箱或密码错误')
    return data
  },

  // 获取当前用户
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }
}

// 学习计划相关
export const studyPlanApi = {
  // 获取用户的所有计划
  async getPlans(userId: string) {
    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
    
    if (error) throw new Error(error.message)
    return data || []
  },

  // 创建计划
  async createPlan(plan: any) {
    const { data, error } = await supabase
      .from('study_plans')
      .insert([plan])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // 更新计划
  async updatePlan(planId: string, updates: any) {
    const { data, error } = await supabase
      .from('study_plans')
      .update(updates)
      .eq('id', planId)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }
}

// 打卡记录相关
export const planRecordApi = {
  // 获取某天的打卡记录
  async getRecords(userId: string, date: string) {
    const { data, error } = await supabase
      .from('plan_records')
      .select(`
        *,
        study_plans (*)
      `)
      .eq('user_id', userId)
      .eq('record_date', date)
    
    if (error) throw new Error(error.message)
    return data || []
  },

  // 打卡
  async checkIn(recordId: string, updates: any) {
    const { data, error } = await supabase
      .from('plan_records')
      .update({
        ...updates,
        status: 'completed',
        check_in_time: new Date().toISOString()
      })
      .eq('id', recordId)
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // 创建打卡记录
  async createRecord(record: any) {
    const { data, error } = await supabase
      .from('plan_records')
      .insert([record])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  }
}

// 积分相关
export const starsApi = {
  // 获取积分记录
  async getRecords(userId: string) {
    const { data, error } = await supabase
      .from('star_records')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw new Error(error.message)
    return data || []
  },

  // 创建积分记录
  async createRecord(record: any) {
    const { data, error } = await supabase
      .from('star_records')
      .insert([record])
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    return data
  },

  // 获取总积分
  async getTotal(userId: string) {
    const { data, error } = await supabase
      .from('star_records')
      .select('amount')
      .eq('user_id', userId)
    
    if (error) throw new Error(error.message)
    return data?.reduce((sum, r) => sum + r.amount, 0) || 0
  }
}
