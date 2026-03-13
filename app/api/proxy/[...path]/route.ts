/**
 * 백엔드 API catch-all 프록시 Route Handler
 * - 클라이언트 요청을 백엔드로 중계하며, httpOnly 쿠키의 토큰을
 *   Authorization 헤더로 변환하여 전달한다
 * - 민감한 토큰이 클라이언트에 노출되지 않도록 보호한다
 * - GET, POST, PUT, PATCH, DELETE 메서드를 지원한다
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/cookies';

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

    const accessToken = await getAccessToken();

    const headers: Record<string, string> = {};
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const fetchOptions: RequestInit = {
      method: request.method,
      headers,
    };

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      fetchOptions.body = await request.text();
    }

    const backendRes = await fetch(url.toString(), fetchOptions);

    const responseBody = await backendRes.text();

    return new NextResponse(responseBody, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch {
    return NextResponse.json(
      { error: 'PROXY_ERROR' },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
