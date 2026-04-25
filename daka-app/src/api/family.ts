import { http } from '@/utils/request';

// 创建家庭
export const createFamily = (data: { name: string }) => {
  return http.post('/families', data);
};

// 获取我的家庭列表
export const getMyFamilies = () => {
  return http.get('/families/my');
};

// 获取家庭详情
export const getFamilyDetail = (id: string) => {
  return http.get(`/families/${id}`);
};

// 获取家庭的孩子列表
export const getFamilyChildren = (id: string) => {
  return http.get(`/families/${id}/children`);
};

// 加入家庭
export const joinFamily = (data: { inviteCode: string }) => {
  return http.post('/families/join', data);
};
