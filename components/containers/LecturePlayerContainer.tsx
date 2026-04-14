/**
 * 강의 플레이어 컨테이너 (LecturePlayerContainer)
 * - 강의 영상 재생 페이지의 메인 조립 레이어
 * - useStreamingSession으로 세션 발급 → VidstackPlayer에 manifestUrl 전달
 * - usePlayer 훅으로 이어보기/진행률 상태를 관리한다
 * - coursesData 기반 커리큘럼 데이터를 사이드바/네비게이션에 전달한다
 */

'use client';

import { useEffect, useCallback, useMemo, useRef, useState, type JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VidstackPlayer from '@/components/player/VidstackPlayer';
import VideoControls from '@/components/ui/VideoControls';
import LectureNavFooter from '@/components/ui/LectureNavFooter';
import LectureSidebar from '@/components/ui/LectureSidebar';
import usePlayer from '@/hooks/usePlayer';
import useStreamingSession from '@/hooks/useStreamingSession';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { uiData } from '@/data';
import {
  fetchEnrollmentDetail,
  fetchMyEnrollments,
  fetchPlaybackPosition,
  fetchUserCourseById,
  markLectureProgress,
  savePlaybackPosition,
} from '@/lib/userApi';
import type { PlayerError } from '@/types';
import type { CurriculumSection as SidebarSection } from '@/components/ui/LectureSidebar';

/** 진도율 서버 저장 최소 간격 (ms) */
const PROGRESS_SAVE_INTERVAL_MS = 10_000;
/** 재생 위치(초) 서버 저장 최소 간격 (ms) */
const POSITION_SAVE_INTERVAL_MS = 10_000;

interface LecturePlayerContainerProps {
  courseId: number;
  lectureId: string;
}

/**
 * 개발용 테스트 HLS URL (백엔드 미구축 시 폴백)
 * useStreamingSession에서 manifestUrl을 받지 못하면 이 URL을 사용한다
 */
const DEV_MANIFEST_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

/** 초 단위 영상 길이 포맷 */
function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}시간 ${m}분`;
  if (m > 0) return `${m}분 ${s ? `${s}초` : ''}`.trim();
  return `${s}초`;
}

export default function LecturePlayerContainer({ courseId, lectureId }: LecturePlayerContainerProps): JSX.Element {
  const router = useRouter();

  // 강의 상세로부터 커리큘럼/네비게이션 구성
  const { data: courseDetail } = useAdminQuery(
    () => fetchUserCourseById(courseId),
    [courseId],
  );

  const {
    isCompleted,
    lastPosition,
    startLecture,
    onTimeUpdate,
    onPause,
    markCompleted,
  } = usePlayer();

  // 스트리밍 세션 발급 — courseSlug 는 레거시 파라미터이므로 courseId 문자열로 대체
  const {
    manifestUrl: sessionManifestUrl,
    isLoading: isSessionLoading,
    error: sessionError,
    refresh: refreshSession,
  } = useStreamingSession(String(courseId), lectureId);

  // 세션 URL이 있으면 사용, 없으면 개발용 폴백
  const manifestUrl = sessionManifestUrl ?? DEV_MANIFEST_URL;

  // 현재 course 의 enrollment 조회 (진도율 저장용)
  const { data: enrollments } = useAdminQuery(() => fetchMyEnrollments(), []);
  const enrollmentId = useMemo(
    () => enrollments?.find((e) => e.courseId === courseId)?.id ?? null,
    [enrollments, courseId],
  );

  /** 진도율 서버 저장: 10초 간격 디바운싱 + 마지막 저장 진도 추적 */
  const lastSentAtRef = useRef(0);
  const lastSentProgressRef = useRef(-1);
  const lectureIdNum = Number(lectureId);

  const saveProgress = useCallback(
    (progressPercent: number, { force = false } = {}) => {
      if (!enrollmentId || !Number.isFinite(lectureIdNum)) return;
      const clamped = Math.max(0, Math.min(100, Math.round(progressPercent)));
      const now = Date.now();
      const progressChanged = clamped !== lastSentProgressRef.current;
      const intervalPassed = now - lastSentAtRef.current >= PROGRESS_SAVE_INTERVAL_MS;
      if (!force && (!progressChanged || !intervalPassed)) return;
      lastSentAtRef.current = now;
      lastSentProgressRef.current = clamped;
      void markLectureProgress(enrollmentId, lectureIdNum, clamped).catch(() => {});
    },
    [enrollmentId, lectureIdNum],
  );

  /** 재생 위치(초) 서버 저장: 10초 간격 디바운싱 */
  const lastPositionSentAtRef = useRef(0);

  const savePosition = useCallback(
    (positionSeconds: number, { force = false } = {}) => {
      if (!Number.isFinite(lectureIdNum)) return;
      const now = Date.now();
      if (!force && now - lastPositionSentAtRef.current < POSITION_SAVE_INTERVAL_MS) return;
      lastPositionSentAtRef.current = now;
      void savePlaybackPosition(lectureIdNum, positionSeconds).catch(() => {});
    },
    [lectureIdNum],
  );

  /** 서버에서 이어보기 위치 조회 → usePlayer에 반영 */
  const [resumePosition, setResumePosition] = useState(0);
  useEffect(() => {
    if (!Number.isFinite(lectureIdNum)) return;
    let cancelled = false;
    void fetchPlaybackPosition(lectureIdNum)
      .then((pos) => { if (!cancelled) setResumePosition(pos.lastPositionSeconds); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [lectureIdNum]);

  // 완료 여부는 enrollment detail 에서 lectureId → isCompleted 매핑으로 조회
  const { data: enrollmentDetail } = useAdminQuery(
    () => (enrollmentId != null ? fetchEnrollmentDetail(enrollmentId) : Promise.resolve(null)),
    [enrollmentId],
  );
  const completionMap = useMemo(() => {
    const map = new Map<string, boolean>();
    for (const p of enrollmentDetail?.progresses ?? []) {
      map.set(String(p.lectureId), !!p.isCompleted);
    }
    return map;
  }, [enrollmentDetail]);

  const sidebarSections = useMemo<SidebarSection[]>(() => {
    const sections = courseDetail?.curriculum.sections ?? [];
    return sections.map((s) => ({
      title: s.title,
      items: s.lectures.map((lec) => ({
        id: String(lec.id),
        title: lec.title,
        duration: formatDuration(lec.durationSeconds),
        isCompleted: completionMap.get(String(lec.id)) ?? false,
      })),
    }));
  }, [courseDetail, completionMap]);

  // 이전/현재/다음 강의 — 모든 섹션을 순회해서 평면화된 lectures 기준으로 계산
  const lessonNav = useMemo(() => {
    const flat: { id: string; title: string }[] = [];
    for (const s of courseDetail?.curriculum.sections ?? []) {
      for (const lec of s.lectures) {
        flat.push({ id: String(lec.id), title: lec.title });
      }
    }
    const idx = flat.findIndex((l) => l.id === lectureId);
    if (idx < 0) return null;
    return {
      prev: idx > 0 ? flat[idx - 1] : null,
      current: flat[idx],
      next: idx < flat.length - 1 ? flat[idx + 1] : null,
    };
  }, [courseDetail, lectureId]);

  const lectureTitle = lessonNav?.current.title ?? '';

  /** 컴포넌트 마운트 시 강의 시작 + 이어보기 위치 복원 */
  useEffect(() => {
    startLecture(String(courseId), lectureId);
  }, [courseId, lectureId, startLecture]);

  /** 일시정지 시점에 최근 duration을 참조하기 위한 ref */
  const lastDurationRef = useRef(0);

  /** VidstackPlayer → usePlayer 진행률 동기화 + 서버 저장 (진도/위치) */
  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      lastDurationRef.current = duration;
      onTimeUpdate(currentTime, duration);
      if (duration > 0) saveProgress((currentTime / duration) * 100);
      savePosition(currentTime);
    },
    [onTimeUpdate, saveProgress, savePosition]
  );

  /** 일시정지 시 현재 진도/위치 즉시 저장 */
  const handlePause = useCallback(
    (currentTime: number) => {
      onPause(currentTime);
      const duration = lastDurationRef.current;
      if (duration > 0) saveProgress((currentTime / duration) * 100, { force: true });
      savePosition(currentTime, { force: true });
    },
    [onPause, saveProgress, savePosition],
  );

  /** 재생 완료 시 수료 처리 + 100% 저장 + 위치 0 으로 리셋 */
  const handleComplete = useCallback(() => {
    markCompleted();
    saveProgress(100, { force: true });
    savePosition(0, { force: true });
  }, [markCompleted, saveProgress, savePosition]);

  /** 플레이어 에러 처리 */
  const handleError = useCallback((_error: PlayerError) => {
    // 미디어 에러는 PlayerOverlay에서 자체 처리
    // 스트리밍 세션 에러는 sessionError로 별도 표시
  }, []);

  /** 세션 에러 재시도 */
  const handleRetry = useCallback(() => {
    refreshSession();
  }, [refreshSession]);

  /** 사이드바에서 강의 선택 → 라우트 전환 */
  const handleSelectLecture = useCallback(
    (selectedLectureId: string) => {
      if (selectedLectureId !== lectureId) {
        router.push(`/learn/${courseId}/${selectedLectureId}`);
      }
    },
    [lectureId, courseId, router]
  );

  /** 이전 강의로 이동 */
  const handlePrev = useCallback(() => {
    if (lessonNav?.prev) {
      router.push(`/learn/${courseId}/${lessonNav.prev.id}`);
    }
  }, [lessonNav, courseId, router]);

  /** 다음 강의로 이동 */
  const handleNext = useCallback(() => {
    if (lessonNav?.next) {
      router.push(`/learn/${courseId}/${lessonNav.next.id}`);
    }
  }, [lessonNav, courseId, router]);

  return (
    <div className="lecture-player-container">
      {/* 상단 헤더바 */}
      <header className="lecture-player-header">
        <div className="lecture-player-header__left">
          <Link
            href={`/courses/${courseId}?tab=커리큘럼`}
            className="lecture-player-header__back"
            aria-label={uiData.lectureNav.backAriaLabel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <span className="lecture-player-header__title">{lectureTitle}</span>
        </div>
      </header>

      {/* 메인 영역 (비디오 + 사이드바) */}
      <div className="lecture-player-container__body">
        {/* 비디오 영역 */}
        <div className="lecture-player-container__video-wrap">
          {/* 로딩 오버레이 */}
          {isSessionLoading && (
            <div className="vidstack-player__buffering vidstack-player__buffering--active">
              <div className="vidstack-player__spinner" />
            </div>
          )}

          {/* 세션 에러 오버레이 */}
          {!isSessionLoading && sessionError && !sessionManifestUrl && (
            <div className="vidstack-player__error" role="alert">
              <svg
                className="vidstack-player__error-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="vidstack-player__error-title">{sessionError.message}</p>
              {sessionError.retryable && (
                <button
                  className="vidstack-player__error-btn vidstack-player__error-btn--primary"
                  onClick={handleRetry}
                  type="button"
                >
                  {uiData.player.labels.retry}
                </button>
              )}
            </div>
          )}

          {/* 플레이어 — 항상 마운트 (vidstack 내부 초기화 보장), 로딩/에러 시 숨김 */}
          <div
            className="lecture-player-container__player"
            hidden={isSessionLoading || (!!sessionError && !sessionManifestUrl)}
          >
            <VidstackPlayer
              manifestUrl={manifestUrl}
              startPosition={resumePosition || lastPosition}
              title={lectureTitle}
              onTimeUpdate={handleTimeUpdate}
              onPause={handlePause}
              onComplete={handleComplete}
              onError={handleError}
            >
              <VideoControls />
            </VidstackPlayer>
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <LectureSidebar
          sections={sidebarSections}
          currentLectureId={lectureId}
          onSelectLecture={handleSelectLecture}
        />
      </div>

      {/* 하단 이전/다음 네비게이션 */}
      <LectureNavFooter
        prevLecture={lessonNav?.prev ?? null}
        nextLecture={lessonNav?.next ?? null}
        isCompleted={isCompleted}
        onPrev={handlePrev}
        onNext={handleNext}
        onMarkComplete={markCompleted}
      />
    </div>
  );
}
