/**
 * useAuth — 인증 상태 + 토큰 관리 통합 Hook
 *
 * useAuthStore 상태와 lib/auth.ts 유틸 함수를 하나로 묶어
 * 컴포넌트에서 한 줄 호출로 인증 관련 기능을 모두 사용할 수 있게 한다.
 */

'use client';

import { useCallback } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import {
  setToken,
  removeToken,
  getAuthHeader,
} from '@/lib/auth';
import { logoutApi } from '@/lib/userApi';
import { useWishlistStoreBase } from '@/stores/useWishlistStore';
import type { User } from '@/types';

export default function useAuth() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const storeLogin = useAuthStore((s) => s.login);
  const storeLogout = useAuthStore((s) => s.logout);
  const setUser = useAuthStore((s) => s.setUser);

  /** 로그인: store 상태 + localStorage 토큰 동시 저장 */
  const login = useCallback(
    (userData: User, authToken: string) => {
      setToken(authToken);
      storeLogin(userData, authToken);
    },
    [storeLogin]
  );

  /** 로그아웃: 서버 쿠키 무효화 + 클라이언트 상태 초기화 */
  const logout = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 호출 실패해도 클라이언트는 로그아웃 처리
    }
    removeToken();
    storeLogout();
    useWishlistStoreBase.getState().setWishSlugs([]);
  }, [storeLogout]);

  return {
    /** 인증 상태 */
    isLoggedIn,
    user,
    token,

    /** 액션 */
    login,
    logout,
    setUser,

    /** Authorization 헤더 생성 */
    getAuthHeader,
  };
}
