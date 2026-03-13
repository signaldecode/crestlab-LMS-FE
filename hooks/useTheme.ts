/**
 * useTheme — 런타임 테마 전환 Hook
 *
 * document의 data-theme 속성을 변경하여 CSS Custom Properties 기반
 * 라이트/다크 테마를 전환한다. localStorage에 설정을 저장하여 유지한다.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // localStorage 미지원
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export default function useTheme() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    document.documentElement.setAttribute('data-theme', initial);
    setMounted(true);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage 미지원
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return {
    /** 현재 테마 */
    theme,
    /** 마운트 여부 (SSR hydration mismatch 방지용) */
    mounted,
    /** 테마 직접 설정 */
    setTheme,
    /** 라이트/다크 토글 */
    toggleTheme,
    /** 다크 모드 여부 */
    isDark: theme === 'dark',
  };
}
