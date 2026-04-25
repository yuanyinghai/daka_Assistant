import { http } from '@/utils/request';

// 获取用户资料
export const getUserProfile = () => {
  return http.get('/users/profile');
};

// 更新用户资料
export const updateUserProfile = (data: { nickname?: string; avatarUrl?: string }) => {
  return http.put('/users/profile', data);
};

// 获取用户统计
export const getUserStatistics = () => {
  return http.get('/users/statistics');
};
