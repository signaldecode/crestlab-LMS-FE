/**
 * VidstackPlayer — vidstack 기반 HLS 강의 플레이어 코어 래퍼
 *
 * - <MediaPlayer> + <MediaProvider>로 HLS/네이티브 자동 선택
 * - 자막 트랙, 이어보기 위치, 에러/버퍼링 상태를 관리한다
 * - 반드시 'use client' 컴포넌트로 사용한다
 */

'use client';

import { useRef, useEffect, useCallback, type JSX, type ReactNode } from 'react';
import {
  MediaPlayer,
  MediaProvider,
  Track,
  isHLSProvider,
  useMediaRemote,
  useMediaState,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';
import Hls, {
  type LoaderContext,
  type LoaderConfiguration,
  type LoaderCallbacks,
} from 'hls.js';
import '@vidstack/react/player/styles/base.css';

import { uiData } from '@/data';
import type { CaptionTrack, PlayerError, PlayerErrorType } from '@/types';
import PlayerOverlay from './PlayerOverlay';

interface VidstackPlayerProps {
  /** HLS manifest URL (스트리밍 세션에서 발급) */
  manifestUrl: string;
  /** 이어보기 시작 위치 (초) */
  startPosition?: number;
  /** 접근성용 강의 제목 */
  title: string;
  /** 자막 트랙 목록 */
  captions?: CaptionTrack[];
  /** 진행률 변경 콜백 (currentTime, duration) */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** 재생 완료 콜백 */
  onComplete?: () => void;
  /** 일시정지 콜백 (즉시 저장용) */
  onPause?: (currentTime: number) => void;
  /** 에러 콜백 */
  onError?: (error: PlayerError) => void;
  /** <MediaPlayer> 컨텍스트 안에 배치할 커스텀 UI (VideoControls 등) */
  children?: ReactNode;
}

const playerLabels = uiData.player.ariaLabels;

export default function VidstackPlayer({
  manifestUrl,
  startPosition = 0,
  title,
  captions = [],
  onTimeUpdate,
  onPause: onPauseCallback,
  onComplete,
  onError,
  children,
}: VidstackPlayerProps): JSX.Element {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const hasRestoredPosition = useRef(false);
  // 커스텀 로더가 항상 최신 manifestUrl의 서명 쿼리를 읽도록 ref에 보관
  const manifestUrlRef = useRef(manifestUrl);
  useEffect(() => {
    manifestUrlRef.current = manifestUrl;
  }, [manifestUrl]);

  /** HLS provider 설정 — hls.js 옵션 커스터마이징 */
  const handleProviderChange = useCallback(
    (provider: MediaProviderAdapter | null, _e: MediaProviderChangeEvent) => {
      if (isHLSProvider(provider)) {
        // 로컬 설치된 hls.js 주입 — 기본 CDN 로더의 구버전(^1.5.0) 사용으로 인한
        // 상태 머신 오류("$state[prop2] is not a function") 방지
        provider.library = Hls;

        // TODO(backend): CloudFront signed cookie 발급으로 전환되면 이 로더는 제거
        // master.m3u8의 서명 쿼리(Policy/Signature/Key-Pair-Id)를
        // 배리언트/세그먼트 요청에도 붙여주는 임시 로더 (Policy가 `.../4/*` 와일드카드라 재사용 가능)
        const DefaultLoader = Hls.DefaultConfig.loader;
        class SignedUrlLoader extends DefaultLoader {
          load(
            context: LoaderContext,
            config: LoaderConfiguration,
            callbacks: LoaderCallbacks<LoaderContext>,
          ) {
            try {
              const signedSearch = new URL(manifestUrlRef.current).search; // "?Policy=..."
              if (
                signedSearch &&
                !/[?&]Signature=/.test(context.url)
              ) {
                const separator = context.url.includes('?') ? '&' : '?';
                context.url = context.url + separator + signedSearch.slice(1);
              }
            } catch {
              // URL 파싱 실패 시 원본 URL 그대로 진행
            }
            super.load(context, config, callbacks);
          }
        }

        provider.config = {
          // 적응형 비트레이트 자동
          startLevel: -1,
          loader: SignedUrlLoader,
        };
      }
    },
    []
  );

  /** 재생 가능 시 이어보기 위치로 seek */
  const handleCanPlay = useCallback(() => {
    if (hasRestoredPosition.current || startPosition <= 0) return;
    const player = playerRef.current;
    if (!player) return;

    player.currentTime = startPosition;
    hasRestoredPosition.current = true;
  }, [startPosition]);

  /** 진행률 업데이트 */
  const handleTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    if (!player || !onTimeUpdate) return;
    onTimeUpdate(player.currentTime, player.duration);
  }, [onTimeUpdate]);

  /** 일시정지 시 즉시 저장 */
  const handlePause = useCallback(() => {
    const player = playerRef.current;
    if (!player || !onPauseCallback) return;
    onPauseCallback(player.currentTime);
  }, [onPauseCallback]);

  /** 재생 완료 */
  const handleEnded = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  /** 미디어 에러 처리 */
  const handleError = useCallback(
    (detail: { message: string; code?: number }) => {
      const errorMessages = uiData.player.errors;
      let type: PlayerErrorType = 'MEDIA_NETWORK';
      let message = errorMessages.unknown;
      let retryable = true;

      if (detail.code === 3) {
        type = 'MEDIA_DECODE';
        message = errorMessages.mediaDecode;
        retryable = false;
      } else if (detail.code === 4) {
        type = 'MEDIA_NOT_SUPPORTED';
        message = errorMessages.mediaNotSupported;
        retryable = false;
      } else {
        type = 'MEDIA_NETWORK';
        message = errorMessages.mediaNetwork;
      }

      onError?.({ type, message, retryable });
    },
    [onError]
  );

  /** manifestUrl 변경 시 이어보기 상태 리셋 */
  useEffect(() => {
    hasRestoredPosition.current = false;
  }, [manifestUrl]);

  return (
    <MediaPlayer
      ref={playerRef}
      className="vidstack-player"
      src={manifestUrl}
      title={title}
      crossOrigin=""
      playsInline
      aria-label={playerLabels.playerRegion}
      onProviderChange={handleProviderChange}
      onCanPlay={handleCanPlay}
      onTimeUpdate={handleTimeUpdate}
      onPause={handlePause}
      onEnded={handleEnded}
      onError={handleError}
    >
      <MediaProvider>
        {captions.map((track) => (
          <Track
            key={`${track.srclang}-${track.src}`}
            src={track.src}
            kind="subtitles"
            language={track.srclang}
            label={track.label}
            default={track.default}
          />
        ))}
      </MediaProvider>

      {/* 센터 플레이 버튼 + 버퍼링 + 에러 오버레이 */}
      <PlayerOverlay />

      {/* 커스텀 UI (VideoControls 등) — MediaPlayer 컨텍스트 공유 */}
      {children}
    </MediaPlayer>
  );
}
