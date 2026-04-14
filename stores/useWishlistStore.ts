/**
 * 위시리스트(관심 클래스) + 최근 본 강의 Zustand 스토어
 * - 찜한 강의 slug 목록 + 최근 본 강의 slug 목록
 * - localStorage로 새로고침 후에도 유지한다
 * - SSR hydration 불일치를 방지하기 위해 빈 상태로 시작 후 클라이언트에서 복원한다
 */

import { create } from 'zustand';
import { useEffect, useState } from 'react';

const MAX_RECENT = 6;

interface WishlistState {
  slugs: string[];
  recentSlugs: string[];
  _hydrated: boolean;
  _hydrate: () => void;
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  addRecent: (slug: string) => void;
  /** 서버 찜 목록과 동기화 (로그인 복구 시 호출) */
  setWishSlugs: (slugs: string[]) => void;
}

function load(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function save(key: string, slugs: string[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(slugs));
  } catch { /* noop */ }
}

const useWishlistStoreBase = create<WishlistState>((set, get) => ({
  slugs: [],
  recentSlugs: [],
  _hydrated: false,

  _hydrate: () => {
    if (!get()._hydrated) {
      set({
        slugs: load('wishlist'),
        recentSlugs: load('recentCourses'),
        _hydrated: true,
      });
    }
  },

  toggleWish: (slug) => {
    const current = get().slugs;
    const next = current.includes(slug)
      ? current.filter((s) => s !== slug)
      : [slug, ...current];
    save('wishlist', next);
    set({ slugs: next });
  },

  isWished: (slug) => get().slugs.includes(slug),

  setWishSlugs: (slugs) => {
    save('wishlist', slugs);
    set({ slugs });
  },

  addRecent: (slug) => {
    const current = get().recentSlugs;
    const filtered = current.filter((s) => s !== slug);
    const next = [slug, ...filtered].slice(0, MAX_RECENT);
    save('recentCourses', next);
    set({ recentSlugs: next });
  },
}));

/** 클라이언트 hydration을 자동으로 수행하는 래퍼 훅 */
export default function useWishlistStore<T>(selector: (s: WishlistState) => T): T {
  const hydrate = useWishlistStoreBase((s) => s._hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return useWishlistStoreBase(selector);
}

/** 스토어 직접 접근 (컴포넌트 외부에서 사용) */
export { useWishlistStoreBase };
