/**
 * usePlayer — 강의 플레이어 상태 + 진행률/이어보기 유틸 통합 Hook
 *
 * usePlayerStore 상태와 lib/player.ts 유틸 함수를 하나로 묶어
 * 컴포넌트에서 한 줄 호출로 플레이어 기능을 모두 사용할 수 있게 한다.
 */

'use client';

import { useCallback } from 'react';
import usePlayerStore from '@/stores/usePlayerStore';
import {
  saveProgress as saveProgressToStorage,
  getLastPosition,
  calcProgress,
  formatTime,
} from '@/lib/player';

export default function usePlayer() {
  const currentCourseSlug = usePlayerStore((s) => s.currentCourseSlug);
  const currentLectureId = usePlayerStore((s) => s.currentLectureId);
  const progress = usePlayerStore((s) => s.progress);
  const lastPosition = usePlayerStore((s) => s.lastPosition);
  const isCompleted = usePlayerStore((s) => s.isCompleted);
  const setCurrentLecture = usePlayerStore((s) => s.setCurrentLecture);
  const updateProgress = usePlayerStore((s) => s.updateProgress);
  const savePosition = usePlayerStore((s) => s.savePosition);
  const markCompleted = usePlayerStore((s) => s.markCompleted);
  const resetPlayer = usePlayerStore((s) => s.resetPlayer);

  /** 강의 시작: store 상태 설정 + localStorage에서 이어보기 위치 복원 */
  const startLecture = useCallback(
    (courseSlug: string, lectureId: string) => {
      setCurrentLecture(courseSlug, lectureId);
      const position = getLastPosition(courseSlug, lectureId);
      if (position > 0) {
        savePosition(position);
      }
      return position;
    },
    [setCurrentLecture, savePosition]
  );

  /** 진행률 업데이트: store + localStorage 동시 저장 */
  const onTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      if (!currentCourseSlug || !currentLectureId) return;

      const percent = calcProgress(currentTime, duration);
      updateProgress(percent);
      savePosition(currentTime);
      saveProgressToStorage(currentCourseSlug, currentLectureId, currentTime);
    },
    [currentCourseSlug, currentLectureId, updateProgress, savePosition]
  );

  return {
    /** 현재 재생 상태 */
    currentCourseSlug,
    currentLectureId,
    progress,
    lastPosition,
    isCompleted,

    /** 액션 */
    startLecture,
    onTimeUpdate,
    markCompleted,
    resetPlayer,

    /** 유틸 */
    formatTime,
    calcProgress,
  };
}
