/**
 * PlayerOverlay — 센터 플레이 버튼 + 버퍼링 스피너 + 에러 오버레이
 *
 * - vidstack <MediaPlayer> 하위에서 사용한다
 * - useMediaState로 미디어 상태를 직접 구독한다
 * - 에러/버퍼링 상태는 aria-live로 스크린리더에 전달한다
 */

'use client';

import { type JSX } from 'react';
import { useMediaState, useMediaRemote } from '@vidstack/react';

import { uiData } from '@/data';
import type { PlayerError } from '@/types';

const labels = uiData.player.labels;
const ariaLabels = uiData.player.ariaLabels;

interface PlayerOverlayProps {
  /** 외부 에러 (스트리밍 세션 에러 등) */
  externalError?: PlayerError | null;
  /** 재시도 콜백 */
  onRetry?: () => void;
}

export default function PlayerOverlay({
  externalError,
  onRetry,
}: PlayerOverlayProps = {}): JSX.Element {
  const paused = useMediaState('paused');
  const waiting = useMediaState('waiting');
  const started = useMediaState('started');
  const error = useMediaState('error');
  const remote = useMediaRemote();

  const hasError = !!error || !!externalError;
  const displayError = externalError ?? (error ? { type: 'MEDIA_NETWORK' as const, message: uiData.player.errors.unknown, retryable: true } : null);

  const handleCenterPlay = () => {
    remote.play();
  };

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // 미디어 에러 시 소스 리로드
      remote.play();
    }
  };

  return (
    <>
      {/* 센터 플레이 버튼 (재생 전 또는 일시정지 시) */}
      {paused && !hasError && (
        <button
          className="vidstack-player__center-play"
          onClick={handleCenterPlay}
          aria-label={ariaLabels.playButton}
          type="button"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* 버퍼링 스피너 */}
      <div
        className={`vidstack-player__buffering${waiting && !hasError ? ' vidstack-player__buffering--active' : ''}`}
        role="status"
      >
        <div className="vidstack-player__spinner" />
      </div>

      {/* 에러 오버레이 */}
      {hasError && displayError && (
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
          <p className="vidstack-player__error-title">
            {displayError.message}
          </p>
          {displayError.retryable && (
            <button
              className="vidstack-player__error-btn vidstack-player__error-btn--primary"
              onClick={handleRetry}
              type="button"
            >
              {labels.retry}
            </button>
          )}
        </div>
      )}

      {/* aria-live 상태 공지 (스크린리더 전용) */}
      <div className="vidstack-player__status" aria-live="polite" aria-atomic="true">
        {waiting && !hasError ? labels.buffering : ''}
        {hasError && displayError ? displayError.message : ''}
      </div>
    </>
  );
}
