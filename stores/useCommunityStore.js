/**
 * 커뮤니티 Zustand 스토어 (useCommunityStore.js)
 * - 커뮤니티 탭, 검색어, 정렬, 페이지네이션 등
 *   클라이언트 상태를 전역으로 관리한다
 * - 컴포넌트에서 import하여 상태를 공유한다
 */

import { create } from 'zustand';

const useCommunityStore = create((set) => ({
  activeTab: 'all',
  query: '',
  sort: 'latest',
  page: 1,
  pageSize: 20,

  setActiveTab: (activeTab) => set({ activeTab, page: 1 }),
  setQuery: (query) => set({ query, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ activeTab: 'all', query: '', sort: 'latest', page: 1 }),
}));

export default useCommunityStore;
