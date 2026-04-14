/**
 * 로그인 프록시 Route Handler
 * - 클라이언트 → Next.js 서버 → 백엔드로 로그인 요청을 중계한다
 * - 백엔드는 자체적으로 Set-Cookie 헤더로 access_token/refresh_token httpOnly 쿠키를 내려준다
 * - 우리는 이 Set-Cookie 헤더를 그대로 클라이언트에 전달한다
 * - 백엔드 응답은 CommonResponse 래퍼: { success, data: { id, nickname } }
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

interface LoginBody {
  email: string;
  password: string;
}

interface BackendCommonResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface BackendLoginData {
  id: number;
  nickname: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: LoginBody = await request.json();

    const backendRes = await fetch(`${BACKEND_BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const status = backendRes.status;
      if (status === 401) {
        return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
      }
      return NextResponse.json({ error: 'LOGIN_FAILED' }, { status });
    }

    const wrapper: BackendCommonResponse<BackendLoginData> = await backendRes.json();
    const data = wrapper?.data ?? null;

    const response = NextResponse.json({ user: data });

    // 백엔드가 발급한 Set-Cookie 헤더를 그대로 전달
    // (Next.js Headers API: getSetCookie 가능한 환경에서 동작)
    const setCookies = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 });
  }
}
