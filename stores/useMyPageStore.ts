/**
 * 마이페이지 Zustand 스토어 (useMyPageStore.ts)
 * - 활성 섹션(탭/서브페이지)을 전역으로 관리한다
 * - 강의실 ↔ 프로필 토글 + 서브 콘텐츠를 단일 상태로 통합
 */

import { create } from 'zustand';
import type { MyPageTab, MyPageSection } from '@/types';

interface MyPageState {
  /** 현재 활성 섹션 (강의실/프로필/서브페이지) */
  activeSection: MyPageSection;
  setActiveSection: (section: MyPageSection) => void;

  /** 토글 탭 (classroom/profile) — 서브 섹션에서도 사이드바 모드를 유지 */
  activeTab: MyPageTab;
  setActiveTab: (tab: MyPageTab) => void;
}

const useMyPageStore = create<MyPageState>((set) => ({
  activeSection: 'classroom',
  setActiveSection: (activeSection) => set({ activeSection }),

  activeTab: 'classroom',
  setActiveTab: (activeTab) => set({ activeTab }),
}));

export default useMyPageStore;
