/**
 * 관리자 데이터 조회 공통 훅 (useAdminQuery)
 * - fetcher를 받아 loading/error/data 상태를 관리한다
 * - deps 변경 시 자동 재조회
 * - mutation 후 외부에서 refetch를 호출할 수 있도록 반환
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface AdminQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAdminQuery<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): AdminQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // fetcher는 매 렌더마다 새 함수일 수 있으므로 ref로 고정
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void run(); }, deps);

  return { data, loading, error, refetch: run };
}

/**
 * mutation(생성/수정/삭제) 실행 훅
 * - submitting/error 상태 제공, 성공 시 onSuccess 콜백 호출
 */
export interface AdminMutationResult<TArgs extends unknown[], TResult> {
  submitting: boolean;
  error: Error | null;
  run: (...args: TArgs) => Promise<TResult | null>;
}

export function useAdminMutation<TArgs extends unknown[], TResult>(
  mutator: (...args: TArgs) => Promise<TResult>,
  onSuccess?: (result: TResult) => void,
): AdminMutationResult<TArgs, TResult> {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const run = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      setSubmitting(true);
      setError(null);
      try {
        const result = await mutator(...args);
        onSuccess?.(result);
        return result;
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [mutator, onSuccess],
  );

  return { submitting, error, run };
}
