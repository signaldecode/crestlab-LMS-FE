/**
 * 백엔드 API catch-all 프록시 Route Handler
 * - 브라우저 요청을 백엔드로 중계
 * - 브라우저 Cookie 헤더를 백엔드로 그대로 포워딩 → 백엔드 JWT 필터가 쿠키에서 access_token 추출
 * - 백엔드 Set-Cookie(리프레시/재발급 등)도 클라이언트에 그대로 전달
 */

import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  try {
    const { path } = await params;
    const backendPath = `/api/${path.join('/')}`;
    const url = new URL(backendPath, BACKEND_BASE);
    url.search = request.nextUrl.search;

    const headers: Record<string, string> = {};

    // Content-Type 전달
    const contentType = request.headers.get('content-type');
    if (contentType) headers['Content-Type'] = contentType;

    // 브라우저 쿠키를 그대로 백엔드로 포워딩
    // 백엔드 JWT 필터는 access_token 쿠키를 기본적으로 사용한다
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) headers['cookie'] = cookieHeader;

    // Authorization 헤더가 명시적으로 있으면 함께 전달 (API 클라이언트 호환)
    const authHeader = request.headers.get('authorization');
    if (authHeader) headers['Authorization'] = authHeader;

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.text();
    }

    const backendRes = await fetch(url.toString(), fetchOptions);
    const responseBody = await backendRes.text();

    const response = new NextResponse(responseBody, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
      },
    });

    // 백엔드가 내려준 Set-Cookie 도 그대로 전달 (토큰 재발급 등)
    const setCookies = backendRes.headers.getSetCookie?.() ?? [];
    for (const cookie of setCookies) {
      response.headers.append('set-cookie', cookie);
    }

    return response;
  } catch {
    return NextResponse.json({ error: 'PROXY_ERROR' }, { status: 502 });
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
