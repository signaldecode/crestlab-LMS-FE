/**
 * 로그인 프록시 Route Handler
 * - 클라이언트 → Next.js 서버 → 백엔드로 로그인 요청을 중계한다
 * - 백엔드에서 받은 토큰을 httpOnly 쿠키로 변환하여 응답한다
 * - 토큰이 클라이언트 JavaScript에 노출되지 않도록 보호한다
 */

import { NextRequest, NextResponse } from 'next/server';
import { setAuthCookies } from '@/lib/cookies';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

interface LoginBody {
  email: string;
  password: string;
}

interface BackendLoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    name: string;
    email: string;
    nickname?: string;
    profileImage?: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginBody = await request.json();

    const backendRes = await fetch(`${BACKEND_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const status = backendRes.status;

      if (status === 401) {
        return NextResponse.json(
          { error: 'INVALID_CREDENTIALS' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'LOGIN_FAILED' },
        { status }
      );
    }

    const data: BackendLoginResponse = await backendRes.json();

    const response = NextResponse.json({
      user: data.user,
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
