/**
 * 토큰 갱신 Route Handler
 * - httpOnly 쿠키의 refresh_token으로 새 access_token을 발급받는다
 * - 클라이언트는 토큰 값을 몰라도 쿠키 기반으로 자동 갱신된다
 */

import { NextResponse } from 'next/server';
import { getRefreshToken, setAuthCookies } from '@/lib/cookies';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

interface BackendRefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

export async function POST(): Promise<NextResponse> {
  try {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'NO_REFRESH_TOKEN' },
        { status: 401 }
      );
    }

    const backendRes = await fetch(`${BACKEND_BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: 'REFRESH_FAILED' },
        { status: backendRes.status }
      );
    }

    const data: BackendRefreshResponse = await backendRes.json();

    const response = NextResponse.json({ success: true });

    setAuthCookies(response, data.accessToken, data.refreshToken);

    return response;
  } catch {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
