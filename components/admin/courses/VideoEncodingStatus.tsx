/**
 * 영상 인코딩 상태 배지/진행률 (VideoEncodingStatus)
 * - fetchVideoEncodingStatus(videoId)를 polling한다 (5s)
 * - COMPLETED / FAILED 상태가 되면 polling 중지
 * - 해상도별 진행률 바 + 실패 시 재시도 버튼 노출
 * - 문구는 props로 주입 (data/*.json에서 관리)
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import type { JSX } from 'react';
import {
  fetchVideoEncodingStatus,
  reEncodeVideo,
  type EncodingStatus,
  type EncodingStatusResult,
} from '@/lib/adminApi';

export interface VideoEncodingStatusCopy {
  statusLabels: Record<EncodingStatus, string>;
  retryLabel: string;
  retryFailedLabel: string;
  loadErrorLabel: string;
}

interface Props {
  videoId: number;
  copy: VideoEncodingStatusCopy;
  /** polling 간격(ms) 기본 5000 */
  intervalMs?: number;
}

const TERMINAL: EncodingStatus[] = ['COMPLETED', 'FAILED'];

export default function VideoEncodingStatus({
  videoId,
  copy,
  intervalMs = 5000,
}: Props): JSX.Element {
  const [state, setState] = useState<EncodingStatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const tick = async () => {
      try {
        const result = await fetchVideoEncodingStatus(videoId);
        if (cancelledRef.current) return;
        setState(result);
        setError(null);
        if (!TERMINAL.includes(result.encodingStatus)) {
          timerRef.current = setTimeout(tick, intervalMs);
        }
      } catch {
        if (cancelledRef.current) return;
        setError(copy.loadErrorLabel);
        timerRef.current = setTimeout(tick, intervalMs);
      }
    };

    void tick();

    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [videoId, intervalMs, copy.loadErrorLabel]);

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await reEncodeVideo(videoId);
      setState((prev) => (prev ? { ...prev, encodingStatus: 'PENDING' } : prev));
      // polling 재개
      if (timerRef.current) clearTimeout(timerRef.current);
      const result = await fetchVideoEncodingStatus(videoId);
      if (!cancelledRef.current) setState(result);
    } catch {
      setError(copy.loadErrorLabel);
    } finally {
      setRetrying(false);
    }
  };

  if (!state) {
    return (
      <span className="video-encoding-status video-encoding-status--loading">
        {error ?? '…'}
      </span>
    );
  }

  const { encodingStatus, jobs } = state;
  const modifier = encodingStatus.toLowerCase();

  return (
    <div className={`video-encoding-status video-encoding-status--${modifier}`}>
      <span className="video-encoding-status__badge">
        {copy.statusLabels[encodingStatus]}
      </span>

      {jobs.length > 0 && encodingStatus !== 'COMPLETED' && (
        <ul className="video-encoding-status__jobs">
          {jobs.map((job) => (
            <li key={job.resolution} className="video-encoding-status__job">
              <span className="video-encoding-status__job-label">
                {job.resolution} — {copy.statusLabels[job.status]}
              </span>
              <div className="video-encoding-status__track" aria-hidden="true">
                <div
                  className="video-encoding-status__fill"
                  style={{ width: `${job.progressPercent}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      {encodingStatus === 'FAILED' && (
        <button
          type="button"
          className="video-encoding-status__retry"
          onClick={() => void handleRetry()}
          disabled={retrying}
        >
          {retrying ? copy.retryLabel : copy.retryFailedLabel}
        </button>
      )}

      {error && <span className="video-encoding-status__error">{error}</span>}
    </div>
  );
}
