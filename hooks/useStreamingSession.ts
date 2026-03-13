/**
 * useStreamingSession — 스트리밍 세션 발급/만료 감지/자동 재발급 훅
 *
 * - POST /api/streaming/session 으로 HLS manifest URL을 발급받는다
 * - 만료 5분 전 자동 재발급 (최대 3회)
 * - 에러 상태를 PlayerError 타입으로 변환하여 UI에서 사용
 * - manifestUrl은 메모리(state)에만 보관, 절대 localStorage/data에 저장하지 않는다
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { uiData } from '@/data';
import type {
  StreamingSessionData,
  StreamingSessionType,
  PlayerError,
  PlayerErrorType,
} from '@/types';

const API_ENDPOINT = '/api/streaming/session';

/** 개발 모드에서 무시할 인증/권한 에러 코드 (테스트용 — 코드는 유지, 에러만 무시) */
const DEV_IGNORED_ERROR_CODES = ['AUTH_REQUIRED', 'NO_ENROLLMENT'];

/** 만료 전 자동 재발급 여유 시간 (ms) */
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

/** 최대 자동 재발급 횟수 */
const MAX_AUTO_REFRESH = 3;

interface UseStreamingSessionReturn {
  /** 발급된 HLS manifest URL (null이면 미발급/로딩/에러) */
  manifestUrl: string | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 (UI에서 PlayerOverlay에 전달) */
  error: PlayerError | null;
  /** 세션 타입 */
  sessionType: StreamingSessionType | null;
  /** 만료 시각 */
  expiresAt: Date | null;
  /** 수동 재발급 */
  refresh: () => Promise<void>;
}

/** 백엔드 에러 코드 → PlayerError 변환 */
function mapErrorToPlayerError(status: number, errorCode?: string): PlayerError {
  const errors = uiData.player.errors;

  const mapping: Record<string, { type: PlayerErrorType; message: string; retryable: boolean }> = {
    AUTH_REQUIRED: { type: 'STREAMING_AUTH', message: errors.authRequired, retryable: false },
    NO_ENROLLMENT: { type: 'STREAMING_FORBIDDEN', message: errors.noEnrollment, retryable: false },
    SESSION_EXPIRED: { type: 'STREAMING_EXPIRED', message: errors.sessionExpired, retryable: true },
    TOO_MANY_REQUESTS: { type: 'STREAMING_RATE_LIMIT', message: errors.tooManyRequests, retryable: true },
  };

  if (errorCode && mapping[errorCode]) {
    return mapping[errorCode];
  }

  // status 기반 폴백
  if (status === 401) return mapping.AUTH_REQUIRED;
  if (status === 403) return mapping.NO_ENROLLMENT;
  if (status === 410) return mapping.SESSION_EXPIRED;
  if (status === 429) return mapping.TOO_MANY_REQUESTS;

  return { type: 'MEDIA_NETWORK', message: errors.unknown, retryable: true };
}

export default function useStreamingSession(
  courseSlug: string,
  lessonSlug: string
): UseStreamingSessionReturn {
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PlayerError | null>(null);
  const [sessionType, setSessionType] = useState<StreamingSessionType | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const autoRefreshCountRef = useRef(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 재발급 타이머 정리 */
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  /** 만료 전 자동 재발급 타이머 설정 */
  const scheduleAutoRefresh = useCallback(
    (expiry: Date, fetchSession: () => Promise<void>) => {
      clearRefreshTimer();

      const msUntilExpiry = expiry.getTime() - Date.now();
      const refreshIn = Math.max(msUntilExpiry - REFRESH_BEFORE_EXPIRY_MS, 0);

      refreshTimerRef.current = setTimeout(async () => {
        if (autoRefreshCountRef.current >= MAX_AUTO_REFRESH) return;
        autoRefreshCountRef.current += 1;
        await fetchSession();
      }, refreshIn);
    },
    [clearRefreshTimer]
  );

  /** 세션 발급 요청 */
  const fetchSession = useCallback(async () => {
    if (!courseSlug || !lessonSlug) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ courseSlug, lessonSlug }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const errorCode = body?.error as string | undefined;

        // 개발 모드: 인증/권한 에러는 무시하고 폴백 URL로 재생 (코드는 유지)
        if (process.env.NODE_ENV !== 'production' && errorCode && DEV_IGNORED_ERROR_CODES.includes(errorCode)) {
          setManifestUrl(null);
          return;
        }

        const playerError = mapErrorToPlayerError(res.status, errorCode);
        setError(playerError);
        setManifestUrl(null);
        return;
      }

      const { data }: { data: StreamingSessionData } = await res.json();
      setManifestUrl(data.manifestUrl);
      setSessionType(data.type);

      const expiry = new Date(data.expiresAt);
      setExpiresAt(expiry);

      // 자동 재발급 타이머 설정
      scheduleAutoRefresh(expiry, fetchSession);
    } catch {
      setError({
        type: 'MEDIA_NETWORK',
        message: uiData.player.errors.mediaNetwork,
        retryable: true,
      });
      setManifestUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [courseSlug, lessonSlug, scheduleAutoRefresh]);

  /** 수동 재발급 (에러 UI에서 "다시 시도" 클릭 시) */
  const refresh = useCallback(async () => {
    autoRefreshCountRef.current = 0;
    await fetchSession();
  }, [fetchSession]);

  /** courseSlug/lessonSlug 변경 시 세션 발급 */
  useEffect(() => {
    autoRefreshCountRef.current = 0;
    fetchSession();

    return () => {
      clearRefreshTimer();
    };
  }, [fetchSession, clearRefreshTimer]);

  return {
    manifestUrl,
    isLoading,
    error,
    sessionType,
    expiresAt,
    refresh,
  };
}
