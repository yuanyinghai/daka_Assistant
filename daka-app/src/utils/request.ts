// 请求基地址
const BASE_URL = 'http://localhost:3000/api/v1';

// 请求拦截
const request = (options: UniApp.RequestOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    // 获取token
    const token = uni.getStorageSync('accessToken');

    uni.request({
      ...options,
      url: `${BASE_URL}${options.url}`,
      header: {
        ...options.header,
        Authorization: token ? `Bearer ${token}` : '',
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          // token过期，清除登录状态
          uni.removeStorageSync('accessToken');
          uni.removeStorageSync('userInfo');
          uni.navigateTo({ url: '/pages/login/index' });
          reject(new Error('登录已过期'));
        } else {
          const errorMsg = (res.data as any)?.message || '请求失败';
          uni.showToast({
            title: errorMsg,
            icon: 'none',
          });
          reject(new Error(errorMsg));
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none',
        });
        reject(err);
      },
    });
  });
};

// HTTP方法封装
export const http = {
  get: (url: string, params?: any) =>
    request({
      url,
      method: 'GET',
      data: params,
    }),

  post: (url: string, data?: any) =>
    request({
      url,
      method: 'POST',
      data,
    }),

  put: (url: string, data?: any) =>
    request({
      url,
      method: 'PUT',
      data,
    }),

  delete: (url: string) =>
    request({
      url,
      method: 'DELETE',
    }),
};

export default request;
