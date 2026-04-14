/**
 * 전역 Provider
 * - 테마 초기화, 인증 상태 복원 등 클라이언트 초기화 로직을 담당한다
 * - signal-web-code-front의 plugin 패턴처럼 초기화 흐름을 명확히 분리한다
 */

'use client';

import type { JSX, ReactNode } from 'react';
import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import { useWishlistStoreBase } from '@/stores/useWishlistStore';
import { fetchMyProfile, fetchMyFavorites } from '@/lib/userApi';
import type { User } from '@/types';
import ToastContainer from '@/components/ui/ToastContainer';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * 인증 상태 초기화 — 페이지 로드 시 /v1/users/me 호출해서 세션 복구
 * - httpOnly 쿠키가 살아있으면 프로필을 받아와 useAuthStore에 채운다
 * - 쿠키가 없거나 만료되면 401이 반환되어 조용히 비로그인 상태로 둠
 */
function AuthInitializer({ children }: { children: ReactNode }): JSX.Element {
  const login = useAuthStore((s) => s.login);
  const setAuthReady = useAuthStore((s) => s.setAuthReady);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const profile = await fetchMyProfile();
        if (cancelled) return;
        const user: User = {
          id: String(profile.id),
          username: profile.email,
          name: profile.name,
          nickname: profile.nickname,
          email: profile.email,
          profileImage: profile.profileImageUrl ?? undefined,
          role: profile.role,
          phone: profile.phone ?? undefined,
        };
        login(user, '');
        // 로그인 복구 성공 시 서버 찜 목록 동기화
        try {
          const favorites = await fetchMyFavorites({ page: 1, size: 200 });
          if (cancelled) return;
          useWishlistStoreBase.getState().setWishSlugs(
            favorites.content.map((f) => String(f.courseId)),
          );
        } catch {
          // 찜 동기화 실패는 무시
        }
      } catch {
        // 401 등은 정상적인 비로그인 상태로 간주 — authReady 만 true 로
        if (!cancelled) setAuthReady(true);
      }
    })();
    return () => { cancelled = true; };
  }, [login, setAuthReady]);

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
        <ToastContainer />
      </AuthInitializer>
    </ThemeInitializer>
  );
}
