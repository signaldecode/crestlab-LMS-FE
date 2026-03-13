/**
 * 비디오 컨트롤 오버레이 (VideoControls)
 * - 동영상 위에 마우스를 올리면 나타나는 재생 컨트롤 바
 * - vidstack <MediaPlayer> 하위에서 사용 — useMediaState/useMediaRemote로 미디어 상태를 직접 구독
 * - 프로그레스 바, 재생/일시정지, 볼륨, 재생속도, 자막, PiP, 품질, 전체화면
 * - 배속은 localStorage에 기억하여 다음 재생 시 자동 복원
 * - 마우스 활동이 없으면 자동으로 숨겨진다
 */

'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useMediaState, useMediaRemote, useMediaPlayer } from '@vidstack/react';

import { uiData } from '@/data';
import { savePlaybackRate, getPlaybackRate } from '@/lib/player';

const labels = uiData.player.labels;
const ariaLabels = uiData.player.ariaLabels;

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoControls() {
  const remote = useMediaRemote();
  const player = useMediaPlayer();

  // vidstack 미디어 상태 직접 구독
  const paused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const volume = useMediaState('volume');
  const muted = useMediaState('muted');
  const playbackRate = useMediaState('playbackRate');
  const fullscreen = useMediaState('fullscreen');
  const pictureInPicture = useMediaState('pictureInPicture');
  const canPictureInPicture = useMediaState('canPictureInPicture');
  const textTrack = useMediaState('textTrack');

  // UI 로컬 상태 (메뉴 토글 등)
  const [visible, setVisible] = useState(false);
  const [showVolume, setShowVolume] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showQuality, setShowQuality] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRestoredRate = useRef(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const isMuted = muted || volume === 0;
  const hasCaptions = !!textTrack;

  // 품질 목록 (HLS adaptive bitrate에서 제공)
  const qualities = player?.qualities;
  const qualityList = qualities?.toArray() ?? [];
  const hasQualities = qualityList.length > 1;
  const selectedQuality = qualityList.find((q) => q.selected);
  const isAutoQuality = !selectedQuality || (qualities?.auto ?? true);
  const qualityLabel = isAutoQuality
    ? labels.autoQuality
    : selectedQuality ? `${selectedQuality.height}p` : labels.autoQuality;

  /** 저장된 배속 복원 (최초 1회) */
  useEffect(() => {
    if (hasRestoredRate.current) return;
    const savedRate = getPlaybackRate();
    if (savedRate !== 1) {
      remote.changePlaybackRate(savedRate);
    }
    hasRestoredRate.current = true;
  }, [remote]);

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setVisible(true);
    hideTimerRef.current = setTimeout(() => {
      setVisible(false);
      setShowVolume(false);
      setShowSpeed(false);
      setShowQuality(false);
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
    setShowQuality(false);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  // ── 미디어 제어 핸들러 ──
  const handleTogglePlay = () => {
    if (paused) {
      remote.play();
    } else {
      remote.pause();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    remote.seek(ratio * duration);
  };

  const handleVolumeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value) / 100;
    remote.changeVolume(v);
    if (v > 0 && muted) {
      remote.unmute();
    }
  };

  const handleToggleMute = () => {
    if (isMuted) {
      remote.unmute();
      if (volume === 0) remote.changeVolume(1);
    } else {
      remote.mute();
    }
  };

  const handleChangeSpeed = (rate: number) => {
    remote.changePlaybackRate(rate);
    savePlaybackRate(rate);
    setShowSpeed(false);
  };

  const handleToggleFullscreen = () => {
    if (fullscreen) {
      remote.exitFullscreen();
    } else {
      remote.enterFullscreen();
    }
  };

  const handleTogglePiP = () => {
    if (pictureInPicture) {
      remote.exitPictureInPicture();
    } else {
      remote.enterPictureInPicture();
    }
  };

  const handleToggleCaptions = () => {
    remote.toggleCaptions();
  };

  const handleChangeQuality = (index: number) => {
    remote.changeQuality(index);
    setShowQuality(false);
  };

  const handleAutoQuality = () => {
    remote.requestAutoQuality();
    setShowQuality(false);
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
        aria-label={paused ? ariaLabels.playButton : ariaLabels.pauseButton}
      >
        {paused ? (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
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
          aria-label={ariaLabels.progressBar}
          aria-valuemin={0}
          aria-valuemax={Math.floor(duration)}
          aria-valuenow={Math.floor(currentTime)}
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
              aria-label={paused ? ariaLabels.playButton : ariaLabels.pauseButton}
            >
              {paused ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
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
                onClick={handleToggleMute}
                aria-label={ariaLabels.muteButton}
              >
                {isMuted ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                    value={Math.round(muted ? 0 : volume * 100)}
                    onChange={handleVolumeInput}
                    aria-label={ariaLabels.volumeSlider}
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

          {/* 오른쪽: 재생속도, 자막, PiP, 설정, 전체화면 */}
          <div className="video-controls__right">
            {/* 재생속도 */}
            <div
              className="video-controls__speed-wrap"
              onMouseEnter={() => setShowSpeed(true)}
              onMouseLeave={() => setShowSpeed(false)}
            >
              <button
                className="video-controls__btn video-controls__btn--text"
                aria-label={ariaLabels.speedMenu}
              >
                {playbackRate}x
              </button>
              {showSpeed && (
                <ul className="video-controls__speed-menu" role="listbox" aria-label={ariaLabels.speedMenu}>
                  {PLAYBACK_RATES.map((rate) => (
                    <li key={rate}>
                      <button
                        className={`video-controls__speed-option ${rate === playbackRate ? 'video-controls__speed-option--active' : ''}`}
                        onClick={() => handleChangeSpeed(rate)}
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

            {/* 자막 토글 */}
            <button
              className={`video-controls__btn ${hasCaptions ? 'video-controls__btn--active' : ''}`}
              onClick={handleToggleCaptions}
              aria-label={ariaLabels.captionButton}
              title={hasCaptions ? labels.captionOff : labels.captionOn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm10 0h2v2h-2zm-6-4h8v2h-8z" />
              </svg>
            </button>

            {/* PiP (Picture-in-Picture) */}
            {canPictureInPicture && (
              <button
                className={`video-controls__btn ${pictureInPicture ? 'video-controls__btn--active' : ''}`}
                onClick={handleTogglePiP}
                aria-label={ariaLabels.pipButton}
                title={pictureInPicture ? labels.exitPip : labels.pip}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                </svg>
              </button>
            )}

            {/* 품질 선택 (배속 메뉴와 동일한 hover 드롭다운) */}
            {hasQualities && (
              <div
                className="video-controls__speed-wrap"
                onMouseEnter={() => setShowQuality(true)}
                onMouseLeave={() => setShowQuality(false)}
              >
                <button
                  className="video-controls__btn video-controls__btn--text"
                  aria-label={ariaLabels.qualityMenu}
                >
                  {qualityLabel}
                </button>
                {showQuality && (
                  <ul className="video-controls__speed-menu" role="listbox" aria-label={ariaLabels.qualityMenu}>
                    <li>
                      <button
                        className={`video-controls__speed-option ${isAutoQuality ? 'video-controls__speed-option--active' : ''}`}
                        onClick={handleAutoQuality}
                        role="option"
                        aria-selected={isAutoQuality}
                      >
                        {labels.autoQuality}
                        {isAutoQuality && selectedQuality ? ` (${selectedQuality.height}p)` : ''}
                      </button>
                    </li>
                    {qualityList
                      .slice()
                      .sort((a, b) => b.height - a.height)
                      .map((q, idx) => {
                        const originalIdx = qualityList.indexOf(q);
                        return (
                          <li key={idx}>
                            <button
                              className={`video-controls__speed-option ${!isAutoQuality && q.selected ? 'video-controls__speed-option--active' : ''}`}
                              onClick={() => handleChangeQuality(originalIdx)}
                              role="option"
                              aria-selected={!isAutoQuality && q.selected}
                            >
                              {q.height}p
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            )}

            {/* 전체화면 */}
            <button
              className="video-controls__btn"
              onClick={handleToggleFullscreen}
              aria-label={ariaLabels.fullscreenButton}
            >
              {fullscreen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
