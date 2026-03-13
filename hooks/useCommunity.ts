/**
 * useCommunity — 커뮤니티 필터/탭/검색/페이지네이션 + 설정 데이터 통합 Hook
 *
 * useCommunityStore 상태와 mainData의 커뮤니티 설정(카테고리/신고사유)을
 * 하나로 묶어 컴포넌트에서 한 줄 호출로 커뮤니티 기능을 사용할 수 있게 한다.
 */

'use client';

import useCommunityStore from '@/stores/useCommunityStore';
import { getMainData } from '@/lib/data';
import type { CommunityData } from '@/types';

export default function useCommunity() {
  const activeTab = useCommunityStore((s) => s.activeTab);
  const activeCategory = useCommunityStore((s) => s.activeCategory);
  const query = useCommunityStore((s) => s.query);
  const sort = useCommunityStore((s) => s.sort);
  const page = useCommunityStore((s) => s.page);
  const pageSize = useCommunityStore((s) => s.pageSize);
  const setActiveTab = useCommunityStore((s) => s.setActiveTab);
  const setActiveCategory = useCommunityStore((s) => s.setActiveCategory);
  const setQuery = useCommunityStore((s) => s.setQuery);
  const setSort = useCommunityStore((s) => s.setSort);
  const setPage = useCommunityStore((s) => s.setPage);
  const resetFilters = useCommunityStore((s) => s.resetFilters);

  const communityConfig: CommunityData = getMainData().community;

  return {
    /** 필터/탭 상태 */
    activeTab,
    activeCategory,
    query,
    sort,
    page,
    pageSize,

    /** 필터 액션 */
    setActiveTab,
    setActiveCategory,
    setQuery,
    setSort,
    setPage,
    resetFilters,

    /** 설정 데이터 (카테고리/신고사유) */
    categories: communityConfig.categories,
    reportReasons: communityConfig.reportReasons,
  };
}
