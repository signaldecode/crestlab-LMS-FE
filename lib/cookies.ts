/**
 * 쿠키 유틸 (cookies.ts)
 * - 서버 사이드(Route Handler)에서 httpOnly 쿠키를 안전하게 설정/삭제한다
 * - Safari SameSite/Secure 이슈를 처리한다
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const TOKEN_COOKIE_NAME = 'auth_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

/** 쿠키 공통 옵션 */
function getCookieOptions(maxAge: number) {
  const isProd = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

/** 인증 토큰을 httpOnly 쿠키로 설정 (Response에 Set-Cookie 추가) */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string
): NextResponse {
  response.cookies.set(
    TOKEN_COOKIE_NAME,
    accessToken,
    getCookieOptions(60 * 60) // 1시간
  );

  if (refreshToken) {
    response.cookies.set(
      REFRESH_COOKIE_NAME,
      refreshToken,
      getCookieOptions(60 * 60 * 24 * 7) // 7일
    );
  }

  return response;
}

/** 인증 쿠키 삭제 (로그아웃 시) */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(TOKEN_COOKIE_NAME, '', { ...getCookieOptions(0), maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE_NAME, '', { ...getCookieOptions(0), maxAge: 0 });
  return response;
}

/** 요청에서 액세스 토큰 읽기 */
export async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value;
}

/** 요청에서 리프레시 토큰 읽기 */
export async function getRefreshToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(REFRESH_COOKIE_NAME)?.value;
}

/** User-Agent에서 Safari 여부 판별 (SameSite 호환성) */
export function isSafari(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return /Safari/i.test(userAgent) && !/Chrome|Chromium|Edg/i.test(userAgent);
}
