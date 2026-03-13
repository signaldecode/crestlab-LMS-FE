/**
 * usePlayer — 강의 플레이어 상태 + 진행률/이어보기 유틸 통합 Hook
 *
 * - usePlayerStore 상태와 lib/player.ts 유틸 함수를 하나로 묶는다
 * - throttle 기반으로 localStorage 저장 빈도를 최적화한다 (10초 간격)
 * - pause / beforeunload 시 즉시 저장한다
 * - 90% 이상 진행 시 자동 수료 처리한다
 */

'use client';

import { useCallback, useRef, useEffect } from 'react';
import usePlayerStore from '@/stores/usePlayerStore';
import {
  saveProgress as saveProgressToStorage,
  getLastPosition,
  calcProgress,
  formatTime,
} from '@/lib/player';

/** localStorage 저장 간격 (ms) */
const STORAGE_THROTTLE_MS = 10_000;

/** 자동 수료 판정 임계값 (%) */
const COMPLETION_THRESHOLD = 90;

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

  /** throttle용 마지막 저장 시각 */
  const lastSavedAtRef = useRef(0);

  /** 최신 위치 (beforeunload 저장용) */
  const latestPositionRef = useRef({ time: 0, slug: '', id: '' });

  /** localStorage에 저장 (throttle 적용) */
  const persistToStorage = useCallback(
    (courseSlug: string, lectureId: string, position: number, force: boolean = false) => {
      const now = Date.now();
      if (!force && now - lastSavedAtRef.current < STORAGE_THROTTLE_MS) return;

      saveProgressToStorage(courseSlug, lectureId, position);
      lastSavedAtRef.current = now;
    },
    []
  );

  /** 강의 시작: store 상태 설정 + localStorage에서 이어보기 위치 복원 */
  const startLecture = useCallback(
    (courseSlug: string, lectureId: string) => {
      setCurrentLecture(courseSlug, lectureId);
      const position = getLastPosition(courseSlug, lectureId);
      if (position > 0) {
        savePosition(position);
      }
      latestPositionRef.current = { time: position, slug: courseSlug, id: lectureId };
      return position;
    },
    [setCurrentLecture, savePosition]
  );

  /** 진행률 업데이트 (timeupdate 이벤트에서 호출) — store는 매번, localStorage는 throttle */
  const onTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      if (!currentCourseSlug || !currentLectureId) return;

      const percent = calcProgress(currentTime, duration);
      updateProgress(percent);
      savePosition(currentTime);

      // 최신 위치 갱신 (beforeunload용)
      latestPositionRef.current = { time: currentTime, slug: currentCourseSlug, id: currentLectureId };

      // localStorage 저장 (10초 throttle)
      persistToStorage(currentCourseSlug, currentLectureId, currentTime);

      // 자동 수료 판정
      if (!isCompleted && percent >= COMPLETION_THRESHOLD) {
        markCompleted();
      }
    },
    [currentCourseSlug, currentLectureId, updateProgress, savePosition, persistToStorage, isCompleted, markCompleted]
  );

  /** 일시정지 시 즉시 저장 */
  const onPause = useCallback(
    (currentTime: number) => {
      if (!currentCourseSlug || !currentLectureId) return;
      savePosition(currentTime);
      persistToStorage(currentCourseSlug, currentLectureId, currentTime, true);
    },
    [currentCourseSlug, currentLectureId, savePosition, persistToStorage]
  );

  /** 페이지 이탈 시 마지막 위치 즉시 저장 */
  useEffect(() => {
    const handleBeforeUnload = () => {
      const { time, slug, id } = latestPositionRef.current;
      if (slug && id && time > 0) {
        saveProgressToStorage(slug, id, time);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      // 클린업 시에도 저장
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

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
    onPause,
    markCompleted,
    resetPlayer,

    /** 유틸 */
    formatTime,
    calcProgress,
  };
}
