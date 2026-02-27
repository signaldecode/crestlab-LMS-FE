/**
 * 마이페이지 Zustand 스토어 (useMyPageStore.ts)
 * - 사이드바 메뉴 활성 상태를 전역으로 관리한다
 */

import { create } from 'zustand';

interface MyPageState {
  activeMenu: string;
  setActiveMenu: (activeMenu: string) => void;
}

const useMyPageStore = create<MyPageState>((set) => ({
  activeMenu: '',
  setActiveMenu: (activeMenu) => set({ activeMenu }),
}));

export default useMyPageStore;
