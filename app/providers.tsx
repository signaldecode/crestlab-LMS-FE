/**
 * 전역 Provider
 * - 테마 초기화, 인증 상태 복원 등 클라이언트 초기화 로직을 담당한다
 * - signal-web-code-front의 plugin 패턴처럼 초기화 흐름을 명확히 분리한다
 */

'use client';

import type { JSX, ReactNode } from 'react';
import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { getToken } from '@/lib/auth';

interface ProvidersProps {
  children: ReactNode;
}

/** 인증 상태 초기화: localStorage 토큰이 있으면 로그인 상태 유지 */
function AuthInitializer({ children }: { children: ReactNode }): JSX.Element {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    const token = getToken();
    if (isLoggedIn && !token) {
      logout();
    }
  }, [isLoggedIn, logout]);

  // 개발 환경에서만 콘솔 디버깅용으로 store를 window에 노출
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      (window as unknown as { useAuthStore: typeof useAuthStore }).useAuthStore = useAuthStore;
    }
  }, []);

  return <>{children}</>;
}

/** 테마 초기화: localStorage/시스템 설정 기반으로 data-theme 속성 설정 */
function ThemeInitializer({ children }: { children: ReactNode }): JSX.Element {
  useEffect(() => {
    const stored = (() => {
      try {
        return localStorage.getItem('theme');
      } catch {
        return null;
      }
    })();

    const theme =
      stored === 'dark' || stored === 'light'
        ? stored
        : window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';

    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps): JSX.Element {
  return (
    <ThemeInitializer>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </ThemeInitializer>
  );
}
