/**
 * 강의 Zustand 스토어 (useCourseStore.js)
 * - 강의 목록 필터(카테고리/레벨), 정렬, 검색어, 페이지네이션 등
 *   클라이언트 상태를 전역으로 관리한다
 * - 컴포넌트에서 import하여 상태를 공유한다
 */

import { create } from 'zustand';

const useCourseStore = create((set) => ({
  category: '',
  level: '',
  sort: 'latest',
  query: '',
  page: 1,
  pageSize: 12,

  setCategory: (category) => set({ category, page: 1 }),
  setLevel: (level) => set({ level, page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setQuery: (query) => set({ query, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () => set({ category: '', level: '', sort: 'latest', query: '', page: 1 }),
}));

export default useCourseStore;
