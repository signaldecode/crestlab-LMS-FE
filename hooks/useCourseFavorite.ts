/**
 * useCourseFavorite — 강의 찜 토글 훅
 * - 로그인 상태면 백엔드 `POST/DELETE /v1/courses/{id}/favorite` 호출 후 로컬 스토어도 동기화
 * - 비로그인 상태면 로컬 스토어(localStorage)만 토글
 */

'use client';

import { useCallback } from 'react';
import useAuth from '@/hooks/useAuth';
import useWishlistStore from '@/stores/useWishlistStore';
import { addFavorite, removeFavorite } from '@/lib/userApi';

export default function useCourseFavorite(courseId: number, slug: string) {
  const { isLoggedIn } = useAuth();
  const wished = useWishlistStore((s) => s.slugs.includes(slug));
  const toggleLocal = useWishlistStore((s) => s.toggleWish);

  const toggle = useCallback(async () => {
    const nextWished = !wished;
    toggleLocal(slug);
    if (!isLoggedIn) return;
    try {
      if (nextWished) await addFavorite(courseId);
      else await removeFavorite(courseId);
    } catch {
      // 실패 시 로컬 상태 원복
      toggleLocal(slug);
    }
  }, [wished, slug, courseId, isLoggedIn, toggleLocal]);

  return { wished, toggle };
}
