/**
 * 소셜 로그인 콜백 페이지
 * - OAuth 인증 후 provider가 리다이렉트하는 중간 페이지
 * - URL에서 code/state/provider를 파싱하여 백엔드 프록시(/api/auth/social)로 전달한다
 * - 성공 시 로그인 처리 후 홈으로 이동, 실패 시 에러 안내를 표시한다
 */

'use client';

import { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { consumeState } from '@/lib/oauth';
import config from '@/config';
import pagesData from '@/data/pagesData.json';
import type { OAuthProvider } from '@/types';

const callbackData = (pagesData as unknown as Record<string, Record<string, Record<string, string>>>).auth.callback;

const VALID_PROVIDERS: OAuthProvider[] = ['google', 'kakao'];

function isValidProvider(value: string | null): value is OAuthProvider {
  return VALID_PROVIDERS.includes(value as OAuthProvider);
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="auth-callback-page">
          <p className="auth-callback-page__loading" aria-live="polite">
            {callbackData.loadingMessage}
          </p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const [error, setError] = useState<string | null>(null);

  const handleCallback = useCallback(async () => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const provider = searchParams.get('provider');
    const errorParam = searchParams.get('error');

    /** provider에서 에러를 반환한 경우 */
    if (errorParam) {
      setError(callbackData.errorMessage);
      return;
    }

    if (!code || !isValidProvider(provider)) {
      setError(callbackData.errorMessage);
      return;
    }

    /** CSRF state 검증 */
    const savedState = consumeState();
    if (savedState && savedState !== state) {
      setError(callbackData.stateMismatchError);
      return;
    }

    /** 해당 provider의 redirectUri를 가져온다 */
    const redirectUri = config.oauth[provider].redirectUri;

    try {
      const res = await fetch(`${config.apiBase}/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, code, redirectUri }),
      });

      if (!res.ok) {
        setError(callbackData.errorMessage);
        return;
      }

      const data = await res.json();
      login(data.user, '');
      router.replace('/');
    } catch {
      setError(callbackData.errorMessage);
    }
  }, [searchParams, login, router]);

  useEffect(() => {
    handleCallback();
  }, [handleCallback]);

  if (error) {
    return (
      <div className="auth-callback-page">
        <div className="auth-callback-page__error">
          <h2 className="auth-callback-page__error-title">{callbackData.errorTitle}</h2>
          <p className="auth-callback-page__error-message">{error}</p>
          <button
            type="button"
            className="auth-callback-page__retry-btn"
            aria-label={callbackData.retryAriaLabel}
            onClick={() => router.replace('/auth/login')}
          >
            {callbackData.retryLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-callback-page">
      <p className="auth-callback-page__loading" aria-live="polite">
        {callbackData.loadingMessage}
      </p>
    </div>
  );
}
