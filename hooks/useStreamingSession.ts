/**
 * useStreamingSession — 스트리밍 signed URL 발급/재발급 훅
 *
 * - 백엔드: `GET /v1/streaming/lectures/{lectureId}/signed-url` → `{ signedUrl, expiresIn }`
 * - 만료 5분 전 자동 재발급 (최대 3회)
 * - lectureId가 숫자가 아닌 경우(mock slug) 세션 없이 null 반환 → 상위에서 DEV 폴백 URL로 재생
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { uiData } from '@/data';
import { fetchLectureSignedUrl, UserApiError } from '@/lib/userApi';
import type {
  StreamingSessionType,
  PlayerError,
  PlayerErrorType,
} from '@/types';

/** 개발 모드에서 무시할 인증/권한 에러 코드 (테스트용 — 에러만 무시) */
const DEV_IGNORED_STATUSES = [401, 403];

/** 만료 전 자동 재발급 여유 시간 (ms) */
const REFRESH_BEFORE_EXPIRY_MS = 5 * 60 * 1000;

/** 최대 자동 재발급 횟수 */
const MAX_AUTO_REFRESH = 3;

interface UseStreamingSessionReturn {
  manifestUrl: string | null;
  isLoading: boolean;
  error: PlayerError | null;
  sessionType: StreamingSessionType | null;
  expiresAt: Date | null;
  refresh: () => Promise<void>;
}

function mapStatusToPlayerError(status: number): PlayerError {
  const errors = uiData.player.errors;
  const mapping: Record<number, { type: PlayerErrorType; message: string; retryable: boolean }> = {
    401: { type: 'STREAMING_AUTH', message: errors.authRequired, retryable: false },
    403: { type: 'STREAMING_FORBIDDEN', message: errors.noEnrollment, retryable: false },
    410: { type: 'STREAMING_EXPIRED', message: errors.sessionExpired, retryable: true },
    429: { type: 'STREAMING_RATE_LIMIT', message: errors.tooManyRequests, retryable: true },
  };
  return mapping[status] ?? { type: 'MEDIA_NETWORK', message: errors.unknown, retryable: true };
}

export default function useStreamingSession(
  _courseSlug: string,
  lessonSlug: string,
): UseStreamingSessionReturn {
  const [manifestUrl, setManifestUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PlayerError | null>(null);
  const [sessionType, setSessionType] = useState<StreamingSessionType | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  const autoRefreshCountRef = useRef(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

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
    [clearRefreshTimer],
  );

  const fetchSession = useCallback(async () => {
    const lectureIdNum = Number(lessonSlug);
    if (!lessonSlug || !Number.isFinite(lectureIdNum)) {
      // lectureId가 숫자가 아니면 백엔드 호출 불가 → mock 폴백
      setManifestUrl(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchLectureSignedUrl(lectureIdNum);
      setManifestUrl(data.signedUrl);
      setSessionType('PRESIGNED_URL');
      const expiry = new Date(Date.now() + data.expiresIn * 1000);
      setExpiresAt(expiry);
      scheduleAutoRefresh(expiry, fetchSession);
    } catch (e) {
      const status = e instanceof UserApiError ? e.status : 0;

      // 개발 모드에서는 인증/권한 에러는 무시하고 mock 폴백
      if (process.env.NODE_ENV !== 'production' && DEV_IGNORED_STATUSES.includes(status)) {
        setManifestUrl(null);
        return;
      }

      setError(mapStatusToPlayerError(status));
      setManifestUrl(null);
    } finally {
      setIsLoading(false);
    }
  }, [lessonSlug, scheduleAutoRefresh]);

  const refresh = useCallback(async () => {
    autoRefreshCountRef.current = 0;
    await fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    autoRefreshCountRef.current = 0;
    void fetchSession();
    return () => { clearRefreshTimer(); };
  }, [fetchSession, clearRefreshTimer]);

  return { manifestUrl, isLoading, error, sessionType, expiresAt, refresh };
}
