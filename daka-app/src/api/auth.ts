import { http } from '@/utils/request';

// 注册
export const register = (data: {
  phone: string;
  password: string;
  nickname: string;
  role?: string;
}) => {
  return http.post('/auth/register', data);
};

// 登录
export const login = (data: { phone: string; password: string }) => {
  return http.post('/auth/login', data);
};

// 获取用户信息
export const getUserInfo = () => {
  return http.get('/auth/profile');
};
