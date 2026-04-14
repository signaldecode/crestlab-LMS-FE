/**
 * 로그아웃 Route Handler
 * - httpOnly 인증 쿠키를 삭제한다
 * - 필요 시 백엔드에 로그아웃(토큰 무효화)을 요청한다
 */

import { NextResponse } from 'next/server';
import { clearAuthCookies, getAccessToken } from '@/lib/cookies';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

export async function POST(): Promise<NextResponse> {
  try {
    const accessToken = await getAccessToken();

    if (accessToken) {
      await fetch(`${BACKEND_BASE}/api/v1/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      }).catch(() => {
        // 백엔드 로그아웃 실패해도 쿠키는 삭제한다
      });
    }

    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);

    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    return response;
  }
}
