/**
 * 메인 페이지 데이터 Provider (MainPageProvider)
 * - 백엔드 `GET /api/v1/main` 통합 API 호출 (Redis 5분 캐시)
 * - 홈의 모든 동적 섹션이 한 번의 fetch 결과를 공유한다
 * - useMainPage() 훅으로 자식 컴포넌트들이 데이터/로딩/에러 상태를 구독
 */

'use client';

import { createContext, useContext, useEffect, useState, type JSX, type ReactNode } from 'react';
import { fetchMainPage, UserApiError, type MainPageResponse } from '@/lib/userApi';

interface MainPageContextValue {
  data: MainPageResponse | null;
  loading: boolean;
  error: string | null;
}

const MainPageContext = createContext<MainPageContextValue | null>(null);

export function MainPageProvider({ children }: { children: ReactNode }): JSX.Element {
  const [data, setData] = useState<MainPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchMainPage()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg = err instanceof UserApiError ? err.message : '메인 데이터를 불러오지 못했습니다.';
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MainPageContext.Provider value={{ data, loading, error }}>
      {children}
    </MainPageContext.Provider>
  );
}

/** 메인 페이지 데이터 구독. Provider 외부에서 호출하면 throw. */
export function useMainPage(): MainPageContextValue {
  const ctx = useContext(MainPageContext);
  if (!ctx) {
    throw new Error('useMainPage must be used within <MainPageProvider>');
  }
  return ctx;
}
