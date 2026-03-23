/**
 * 소셜 로그인 프록시 Route Handler
 * - 클라이언트에서 받은 OAuth authorization code를 백엔드로 전달한다
 * - 백엔드가 code → 토큰 교환 → 유저 생성/조회를 처리하고, accessToken/user를 응답한다
 * - 프론트는 토큰을 httpOnly 쿠키로 설정하여 클라이언트 JS에 노출하지 않는다
 */

import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/cookies';
import type { SocialLoginRequest, SocialLoginResponse } from '@/types';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: SocialLoginRequest = await request.json();
    const { provider, code, redirectUri } = body;

    if (!provider || !code || !redirectUri) {
      return NextResponse.json(
        { error: 'MISSING_PARAMS' },
        { status: 400 }
      );
    }

    /** 백엔드 소셜 로그인 엔드포인트로 code를 전달한다 */
    const backendRes = await fetch(`${BACKEND_BASE}/api/auth/social/${provider}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
    });

    if (!backendRes.ok) {
      const status = backendRes.status;

      if (status === 401) {
        return NextResponse.json(
          { error: 'SOCIAL_AUTH_FAILED' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'SOCIAL_LOGIN_FAILED' },
        { status }
      );
    }

    const data: SocialLoginResponse = await backendRes.json();

    const response = NextResponse.json({
      user: data.user,
      isNewUser: data.isNewUser,
    });

    setAuthCookies(response, data.accessToken, data.refreshToken);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
