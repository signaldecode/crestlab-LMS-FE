/**
 * 플레이어 Zustand 스토어 (usePlayerStore.ts)
 * - 강의 영상 재생 진행률, 이어보기 위치, 현재 재생 중인 강의 정보를 전역 관리한다
 * - 진행률 업데이트/이어보기 위치 저장/완료 처리 액션을 제공한다
 */

import { create } from 'zustand';

interface PlayerState {
  currentCourseSlug: string | null;
  currentLectureId: string | null;
  progress: number;
  lastPosition: number;
  isCompleted: boolean;
  setCurrentLecture: (courseSlug: string, lectureId: string) => void;
  updateProgress: (progress: number) => void;
  savePosition: (lastPosition: number) => void;
  markCompleted: () => void;
  resetPlayer: () => void;
}

const usePlayerStore = create<PlayerState>((set) => ({
  currentCourseSlug: null,
  currentLectureId: null,
  progress: 0,
  lastPosition: 0,
  isCompleted: false,

  setCurrentLecture: (courseSlug, lectureId) =>
    set({ currentCourseSlug: courseSlug, currentLectureId: lectureId, progress: 0, lastPosition: 0, isCompleted: false }),
  updateProgress: (progress) => set({ progress }),
  savePosition: (lastPosition) => set({ lastPosition }),
  markCompleted: () => set({ isCompleted: true, progress: 100 }),
  resetPlayer: () =>
    set({ currentCourseSlug: null, currentLectureId: null, progress: 0, lastPosition: 0, isCompleted: false }),
}));

export default usePlayerStore;
