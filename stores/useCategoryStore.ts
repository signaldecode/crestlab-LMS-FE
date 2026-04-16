/**
 * 카테고리 Zustand 스토어 (useCategoryStore.ts)
 * - 전역 카테고리 목록을 1회 로드해 캐시한다
 * - 카테고리 메가메뉴가 열릴 때마다 재요청해서 생기는 깜빡임을 제거하기 위함
 */

import { create } from 'zustand';
import { fetchUserCategories, type UserCategory } from '@/lib/userApi';

interface CategoryState {
  categories: UserCategory[];
  loaded: boolean;
  loading: boolean;
  loadCategories: () => Promise<void>;
}

const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loaded: false,
  loading: false,

  loadCategories: async () => {
    const { loaded, loading } = get();
    if (loaded || loading) return;
    set({ loading: true });
    try {
      const categories = await fetchUserCategories();
      set({ categories, loaded: true, loading: false });
    } catch {
      set({ loading: false });
    }
  },
}));

export default useCategoryStore;
