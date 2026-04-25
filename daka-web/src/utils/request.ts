import { useUserStore } from '@/stores/user'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

interface RequestOptions extends RequestInit {
  params?: Record<string, string>
}

async function request<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const userStore = useUserStore()
  
  // 构建完整 URL
  let fullUrl = `${BASE_URL}${url}`
  
  // 添加查询参数
  if (options.params) {
    const params = new URLSearchParams(options.params)
    fullUrl += `?${params.toString()}`
  }

  // 设置默认 headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {})
  }

  // 添加认证 token
  if (userStore.token) {
    headers['Authorization'] = `Bearer ${userStore.token}`
  }

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers
    })

    // 处理 401 未授权
    if (response.status === 401) {
      userStore.logout()
      window.location.href = '/login'
      throw new Error('登录已过期，请重新登录')
    }

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('网络错误，请检查网络连接')
  }
}

export const http = {
  get<T>(url: string, params?: Record<string, string>) {
    return request<T>(url, { method: 'GET', params })
  },

  post<T>(url: string, body?: unknown) {
    return request<T>(url, {
      method: 'POST',
      body: JSON.stringify(body)
    })
  },

  put<T>(url: string, body?: unknown) {
    return request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(body)
    })
  },

  delete<T>(url: string) {
    return request<T>(url, { method: 'DELETE' })
  }
}
