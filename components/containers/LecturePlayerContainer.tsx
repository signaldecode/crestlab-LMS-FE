/**
 * 강의 플레이어 컨테이너 (LecturePlayerContainer)
 * - 강의 영상 재생 페이지의 메인 조립 레이어
 * - useStreamingSession으로 세션 발급 → VidstackPlayer에 manifestUrl 전달
 * - usePlayer 훅으로 이어보기/진행률 상태를 관리한다
 * - coursesData 기반 커리큘럼 데이터를 사이드바/네비게이션에 전달한다
 */

'use client';

import { useEffect, useCallback, useMemo, type JSX } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import VidstackPlayer from '@/components/player/VidstackPlayer';
import VideoControls from '@/components/ui/VideoControls';
import LectureNavFooter from '@/components/ui/LectureNavFooter';
import LectureSidebar from '@/components/ui/LectureSidebar';
import usePlayer from '@/hooks/usePlayer';
import useStreamingSession from '@/hooks/useStreamingSession';
import { uiData } from '@/data';
import { getCurriculumForSidebar, findLessonNav } from '@/lib/data';
import type { PlayerError } from '@/types';

interface LecturePlayerContainerProps {
  courseSlug: string;
  lectureId: string;
}

/**
 * 개발용 테스트 HLS URL (백엔드 미구축 시 폴백)
 * useStreamingSession에서 manifestUrl을 받지 못하면 이 URL을 사용한다
 */
const DEV_MANIFEST_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export default function LecturePlayerContainer({ courseSlug, lectureId }: LecturePlayerContainerProps): JSX.Element {
  const router = useRouter();

  const {
    isCompleted,
    lastPosition,
    startLecture,
    onTimeUpdate,
    onPause,
    markCompleted,
  } = usePlayer();

  // 스트리밍 세션 발급
  const {
    manifestUrl: sessionManifestUrl,
    isLoading: isSessionLoading,
    error: sessionError,
    refresh: refreshSession,
  } = useStreamingSession(courseSlug, lectureId);

  // 세션 URL이 있으면 사용, 없으면 개발용 폴백
  const manifestUrl = sessionManifestUrl ?? DEV_MANIFEST_URL;

  // 커리큘럼 데이터 로딩 (coursesData.json 기반)
  const sidebarSections = useMemo(
    () => getCurriculumForSidebar(courseSlug) ?? [],
    [courseSlug]
  );

  const lessonNav = useMemo(
    () => findLessonNav(courseSlug, lectureId),
    [courseSlug, lectureId]
  );

  // 현재 강의 제목 (data 기반)
  const lectureTitle = lessonNav?.current.title ?? '';

  /** 컴포넌트 마운트 시 강의 시작 + 이어보기 위치 복원 */
  useEffect(() => {
    startLecture(courseSlug, lectureId);
  }, [courseSlug, lectureId, startLecture]);

  /** VidstackPlayer → usePlayer 진행률 동기화 */
  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      onTimeUpdate(currentTime, duration);
    },
    [onTimeUpdate]
  );

  /** 재생 완료 시 수료 처리 */
  const handleComplete = useCallback(() => {
    markCompleted();
  }, [markCompleted]);

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
        router.push(`/learn/${courseSlug}/${selectedLectureId}`);
      }
    },
    [courseSlug, lectureId, router]
  );

  /** 이전 강의로 이동 */
  const handlePrev = useCallback(() => {
    if (lessonNav?.prev) {
      router.push(`/learn/${courseSlug}/${lessonNav.prev.id}`);
    }
  }, [courseSlug, lessonNav, router]);

  /** 다음 강의로 이동 */
  const handleNext = useCallback(() => {
    if (lessonNav?.next) {
      router.push(`/learn/${courseSlug}/${lessonNav.next.id}`);
    }
  }, [courseSlug, lessonNav, router]);

  return (
    <div className="lecture-player-container">
      {/* 상단 헤더바 */}
      <header className="lecture-player-header">
        <div className="lecture-player-header__left">
          <Link
            href={`/courses/${courseSlug}?tab=커리큘럼`}
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
              startPosition={lastPosition}
              title={lectureTitle}
              onTimeUpdate={handleTimeUpdate}
              onPause={onPause}
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
