/**
 * 커뮤니티 Zustand 스토어 (useCommunityStore.ts)
 * - 커뮤니티 탭, 검색어, 정렬, 페이지네이션 등
 *   클라이언트 상태를 전역으로 관리한다
 * - 컴포넌트에서 import하여 상태를 공유한다
 */

import { create } from 'zustand';

interface CommunityState {
  activeTab: string;
  activeCategory: string;
  query: string;
  sort: string;
  page: number;
  pageSize: number;
  drawerOpen: boolean;
  setActiveTab: (activeTab: string) => void;
  setActiveCategory: (activeCategory: string) => void;
  setQuery: (query: string) => void;
  setSort: (sort: string) => void;
  setPage: (page: number) => void;
  setDrawerOpen: (open: boolean) => void;
  resetFilters: () => void;
}

const useCommunityStore = create<CommunityState>((set) => ({
  activeTab: 'all',
  activeCategory: '커뮤니티홈',
  query: '',
  sort: 'latest',
  page: 1,
  pageSize: 20,
  drawerOpen: false,

  setActiveTab: (activeTab) => set({ activeTab, page: 1 }),
  setActiveCategory: (activeCategory) => set({ activeCategory, page: 1 }),
  setQuery: (query) => set({ query, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  resetFilters: () => set({ activeTab: 'all', activeCategory: '커뮤니티홈', query: '', sort: 'latest', page: 1 }),
}));

export default useCommunityStore;
