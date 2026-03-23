/**
 * OAuth 유틸 (oauth.ts)
 * - Google, Kakao 소셜 로그인 인증 URL을 생성한다
 * - 프론트에서는 URL 생성 + 리다이렉트만 담당하고, 토큰 교환은 백엔드에서 처리한다
 */

import config from '@/config';
import type { OAuthProvider } from '@/types';

/** CSRF 방지용 state 파라미터 생성 및 sessionStorage 저장 */
function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  const state = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  try {
    sessionStorage.setItem('oauth_state', state);
  } catch {
    // sessionStorage 미지원 환경
  }
  return state;
}

/** sessionStorage에서 state를 꺼내고 삭제한다 */
export function consumeState(): string | null {
  try {
    const state = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return state;
  } catch {
    return null;
  }
}

/** Google OAuth 2.0 인증 URL 생성 */
function buildGoogleAuthUrl(): string {
  const { clientId, redirectUri } = config.oauth.google;
  const state = generateState();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/** Kakao OAuth 2.0 인증 URL 생성 */
function buildKakaoAuthUrl(): string {
  const { clientId, redirectUri } = config.oauth.kakao;
  const state = generateState();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    state,
  });

  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

/** provider에 따른 OAuth 인증 URL을 반환한다 */
export function getOAuthUrl(provider: OAuthProvider): string {
  switch (provider) {
    case 'google':
      return buildGoogleAuthUrl();
    case 'kakao':
      return buildKakaoAuthUrl();
  }
}

/** 현재 창에서 OAuth 인증 페이지로 이동한다 */
export function redirectToOAuth(provider: OAuthProvider): void {
  const url = getOAuthUrl(provider);
  window.location.href = url;
}
