import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (userData, token) => set({
        user: userData,
        token: token,
        isAuthenticated: true,
      }),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
      }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAuthStore;
