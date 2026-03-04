/**
 * 인증/유저 Zustand 스토어 (useAuthStore.ts)
 * - 로그인 상태, 유저 정보, 토큰 등을 전역 관리한다
 * - 로그인/로그아웃/유저 정보 설정 액션을 제공한다
 */

import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const defaultUser: User = {
  id: 'user-001',
  name: '김회원',
  nickname: '김회원',
  bio: '',
  email: 'kim@example.com',
  profileImage: undefined,
  featuredPostIds: [],
};

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: true,
  user: defaultUser,
  token: 'mock-token',

  login: (user, token) => set({ isLoggedIn: true, user, token }),
  logout: () => set({ isLoggedIn: false, user: null, token: null }),
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
