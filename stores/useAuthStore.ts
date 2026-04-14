/**
 * 인증/유저 Zustand 스토어 (useAuthStore.ts)
 * - 로그인 상태, 유저 정보, 토큰 등을 전역 관리한다
 * - 로그인/로그아웃/유저 정보 설정 액션을 제공한다
 */

import { create } from 'zustand';
import type { User, UserRole } from '@/types';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoginModalOpen: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  /** 목 데이터 환경에서 역할 전환 (백엔드 연동 후 제거 예정) */
  mockSwitchRole: (role: UserRole) => void;
}

const defaultUser: User = {
  id: 'user-001',
  username: 'ttsalstj422',
  name: '신민석',
  nickname: '신민석',
  bio: '',
  email: 'ttsalstj422@naver.com',
  profileImage: undefined,
  featuredPostIds: [],
  phone: '010-7558-9904',
  birthday: '1991-01-01',
  gender: 'male',
  joinDate: '2026-03-06',
  grade: '사원',
  role: 'STUDENT',
  socialAccounts: [
    { provider: 'naver', connected: true },
    { provider: 'kakao', connected: false },
    { provider: 'apple', connected: false },
    { provider: 'google', connected: false },
  ],
  marketingConsent: {
    personalInfo: true,
    sms: false,
    email: false,
    nightAd: false,
  },
};

const useAuthStore = create<AuthState>((set, get) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  isLoginModalOpen: false,

  login: (user, token) => set({ isLoggedIn: true, user, token }),
  logout: () => set({ isLoggedIn: false, user: null, token: null }),
  setUser: (user) => set({ user }),
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  mockSwitchRole: (role) => {
    const current = get().user ?? defaultUser;
    set({ isLoggedIn: true, user: { ...current, role }, token: get().token ?? 'mock-token' });
  },
}));

/** 현재 로그인한 유저가 ADMIN 역할인지 판별 */
export const selectIsAdmin = (state: AuthState): boolean =>
  state.isLoggedIn && state.user?.role === 'ADMIN';

export default useAuthStore;
