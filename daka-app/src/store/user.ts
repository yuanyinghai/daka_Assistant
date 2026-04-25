import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const accessToken = ref<string>('');
  const userInfo = ref<any>(null);

  // Getters
  const isLoggedIn = computed(() => !!accessToken.value);
  const userId = computed(() => userInfo.value?.id);
  const userRole = computed(() => userInfo.value?.role);
  const starBalance = computed(() => userInfo.value?.starBalance || 0);

  // Actions
  const setToken = (token: string) => {
    accessToken.value = token;
    uni.setStorageSync('accessToken', token);
  };

  const setUserInfo = (info: any) => {
    userInfo.value = info;
    uni.setStorageSync('userInfo', info);
  };

  const initFromStorage = () => {
    const token = uni.getStorageSync('accessToken');
    const info = uni.getStorageSync('userInfo');
    if (token) accessToken.value = token;
    if (info) userInfo.value = info;
  };

  const logout = () => {
    accessToken.value = '';
    userInfo.value = null;
    uni.removeStorageSync('accessToken');
    uni.removeStorageSync('userInfo');
  };

  const updateStarBalance = (amount: number) => {
    if (userInfo.value) {
      userInfo.value.starBalance = amount;
      uni.setStorageSync('userInfo', userInfo.value);
    }
  };

  return {
    accessToken,
    userInfo,
    isLoggedIn,
    userId,
    userRole,
    starBalance,
    setToken,
    setUserInfo,
    initFromStorage,
    logout,
    updateStarBalance,
  };
});
