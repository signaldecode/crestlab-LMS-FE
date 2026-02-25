/**
 * 비디오 컨트롤 오버레이 (VideoControls)
 * - 동영상 위에 마우스를 올리면 나타나는 재생 컨트롤 바
 * - 프로그레스 바, 재생/일시정지, 볼륨, 재생속도, 자막, 설정, 전체화면
 * - 마우스 활동이 없으면 자동으로 숨겨진다
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface VideoControlsProps {
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  volume?: number;
  playbackRate?: number;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  onPlaybackRateChange?: (rate: number) => void;
  onToggleSubtitle?: () => void;
  onToggleFullscreen?: () => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoControls({
  currentTime = 0,
  duration = 0,
  isPlaying = false,
  volume = 100,
  playbackRate = 1,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onPlaybackRateChange,
  onToggleSubtitle,
  onToggleFullscreen,
}: VideoControlsProps) {
  const [visible, setVisible] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isMuted = volume === 0;

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setVisible(true);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setShowVolume(false);
      setShowSpeed(false);
      setShowSettings(false);
    }, 3000);
  }, []);

  const handleMouseMove = useCallback(() => {
    resetHideTimer();
  }, [resetHideTimer]);

  const handleMouseLeave = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setVisible(false);
    setShowVolume(false);
    setShowSpeed(false);
    setShowSettings(false);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek?.(ratio * duration);
  };

  const handleVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange?.(Number(e.target.value));
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`video-controls ${visible ? 'video-controls--visible' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 중앙 재생 버튼 (큰 사이즈) */}
      <button
        className="video-controls__center-play"
        onClick={handleTogglePlay}
        aria-label={isPlaying ? '일시정지' : '재생'}
      >
        {isPlaying ? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* 하단 컨트롤 바 */}
      <div className="video-controls__bar">
        {/* 프로그레스 바 */}
        <div
          className="video-controls__progress"
          onClick={handleProgressClick}
          role="slider"
          aria-label="영상 구간 탐색"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          tabIndex={0}
        >
          <div className="video-controls__progress-bg" />
          <div
            className="video-controls__progress-fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="video-controls__progress-handle"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* 컨트롤 버튼 영역 */}
        <div className="video-controls__buttons">
          {/* 왼쪽: 재생, 볼륨, 시간 */}
          <div className="video-controls__left">
            <button
              className="video-controls__btn"
              onClick={handleTogglePlay}
              aria-label={isPlaying ? '일시정지' : '재생'}
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* 볼륨 */}
            <div
              className="video-controls__volume-wrap"
              onMouseEnter={() => setShowVolume(true)}
              onMouseLeave={() => setShowVolume(false)}
            >
              <button
                className="video-controls__btn"
                onClick={() => onVolumeChange?.(isMuted ? 100 : 0)}
                aria-label={isMuted ? '음소거 해제' : '음소거'}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              {showVolume && (
                <div className="video-controls__volume-slider">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleVolumeInput}
                    aria-label="볼륨 조절"
                    className="video-controls__volume-input"
                  />
                </div>
              )}
            </div>

            {/* 시간 표시 */}
            <span className="video-controls__time">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* 오른쪽: 재생속도, 자막, 설정, 전체화면 */}
          <div className="video-controls__right">
            {/* 재생속도 */}
            <div
              className="video-controls__speed-wrap"
              onMouseEnter={() => setShowSpeed(true)}
              onMouseLeave={() => setShowSpeed(false)}
            >
              <button className="video-controls__btn video-controls__btn--text" aria-label="재생 속도">
                {playbackRate}x
              </button>
              {showSpeed && (
                <ul className="video-controls__speed-menu" role="listbox" aria-label="재생 속도 선택">
                  {PLAYBACK_RATES.map((rate) => (
                    <li key={rate}>
                      <button
                        className={`video-controls__speed-option ${rate === playbackRate ? 'video-controls__speed-option--active' : ''}`}
                        onClick={() => onPlaybackRateChange?.(rate)}
                        role="option"
                        aria-selected={rate === playbackRate}
                      >
                        {rate}x
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 자막 */}
            <button
              className="video-controls__btn"
              onClick={onToggleSubtitle}
              aria-label="자막"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z" />
              </svg>
            </button>

            {/* 설정 */}
            <div
              className="video-controls__settings-wrap"
              onMouseEnter={() => setShowSettings(true)}
              onMouseLeave={() => setShowSettings(false)}
            >
              <button className="video-controls__btn" aria-label="설정">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>
              {showSettings && (
                <div className="video-controls__settings-menu">
                  <div className="video-controls__settings-item">
                    <span>화질</span>
                    <span>자동 (720p)</span>
                  </div>
                  <div className="video-controls__settings-item">
                    <span>재생 속도</span>
                    <span>{playbackRate}x</span>
                  </div>
                </div>
              )}
            </div>

            {/* 전체화면 */}
            <button
              className="video-controls__btn"
              onClick={onToggleFullscreen}
              aria-label="전체화면"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
