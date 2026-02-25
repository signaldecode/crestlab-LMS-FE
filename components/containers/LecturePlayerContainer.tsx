/**
 * 강의 플레이어 컨테이너 (LecturePlayerContainer)
 * - 강의 영상 재생 페이지의 메인 조립 레이어
 * - 비디오 영역 + VideoControls 오버레이 + LectureNavFooter를 조립한다
 * - usePlayerStore에서 이어보기/진행률 상태를 관리한다
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import VideoControls from '@/components/ui/VideoControls';
import LectureNavFooter from '@/components/ui/LectureNavFooter';
import LectureSidebar from '@/components/ui/LectureSidebar';
import usePlayerStore from '@/stores/usePlayerStore';

interface LecturePlayerContainerProps {
  courseSlug: string;
  lectureId: string;
}

export default function LecturePlayerContainer({ courseSlug, lectureId }: LecturePlayerContainerProps): JSX.Element {
  const { isCompleted, updateProgress, markCompleted } = usePlayerStore();

  // 임시 상태 (추후 실제 비디오 엘리먼트와 연동)
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(1620); // 27:00 예시
  const [volume, setVolume] = useState(100);
  const [playbackRate, setPlaybackRate] = useState(1);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    updateProgress((time / duration) * 100);
  }, [duration, updateProgress]);
  const handleVolumeChange = useCallback((v: number) => setVolume(v), []);
  const handlePlaybackRateChange = useCallback((rate: number) => setPlaybackRate(rate), []);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // 임시 이전/다음 강의 데이터 (추후 실제 커리큘럼 데이터와 연동)
  const prevLecture = { id: 'prev-001', title: '이전 강의 제목' };
  const nextLecture = { id: 'next-001', title: '다음 강의 제목' };

  return (
    <div className="lecture-player-container">
      {/* 상단 헤더바 */}
      <header className="lecture-player-header">
        <div className="lecture-player-header__left">
          <Link
            href={`/courses/${courseSlug}?tab=커리큘럼`}
            className="lecture-player-header__back"
            aria-label="강의 상세 페이지로 돌아가기"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </Link>
          <span className="lecture-player-header__title">타입스크립트 컴파일러 옵션 설정하기</span>
        </div>
      </header>

      {/* 메인 영역 (비디오 + 사이드바) */}
      <div className="lecture-player-container__body">
        {/* 비디오 영역 + 컨트롤 오버레이 */}
        <div className="lecture-player-container__video-wrap">
          <div className="lecture-player-container__video">
            {/* 추후 실제 video 엘리먼트 삽입 */}
          </div>
          <VideoControls
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            volume={volume}
            playbackRate={playbackRate}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onPlaybackRateChange={handlePlaybackRateChange}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>

        {/* 오른쪽 사이드바 */}
        <LectureSidebar
          currentLectureId={lectureId}
          onSelectLecture={(id) => console.log('강의 선택:', id)}
        />
      </div>

      {/* 하단 이전/다음 네비게이션 */}
      <LectureNavFooter
        prevLecture={prevLecture}
        nextLecture={nextLecture}
        isCompleted={isCompleted}
        onPrev={() => console.log('이전 강의로 이동')}
        onNext={() => console.log('다음 강의로 이동')}
        onMarkComplete={markCompleted}
      />
    </div>
  );
}
