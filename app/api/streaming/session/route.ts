/**
 * HLS 스트리밍 세션 발급 Route Handler
 * - 수강 권한을 확인하고, 백엔드로부터 서명 URL 또는 서명 쿠키를 발급받는다
 * - 서명값/manifest URL은 응답 본문으로만 전달하며 저장하지 않는다
 * - CLAUDE.md 스트리밍 규격을 준수한다
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/cookies';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

interface SessionRequestBody {
  courseSlug: string;
  lessonSlug: string;
}

interface BackendStreamingResponse {
  data: {
    manifestUrl: string;
    expiresAt: string;
    type: 'PRESIGNED_URL' | 'SIGNED_COOKIE';
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'AUTH_REQUIRED' },
        { status: 401 }
      );
    }

    const body: SessionRequestBody = await request.json();

    if (!body.courseSlug || !body.lessonSlug) {
      return NextResponse.json(
        { error: 'INVALID_PARAMS' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_BASE}/api/streaming/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const status = backendRes.status;
      const errorMap: Record<number, string> = {
        401: 'AUTH_REQUIRED',
        403: 'NO_ENROLLMENT',
        410: 'SESSION_EXPIRED',
        429: 'TOO_MANY_REQUESTS',
      };

      return NextResponse.json(
        { error: errorMap[status] || 'STREAMING_ERROR' },
        { status }
      );
    }

    const data: BackendStreamingResponse = await backendRes.json();

    const response = NextResponse.json({ data: data.data });

    if (data.data.type === 'SIGNED_COOKIE') {
      const setCookieHeaders = backendRes.headers.getSetCookie?.() || [];
      for (const cookie of setCookieHeaders) {
        response.headers.append('Set-Cookie', cookie);
      }
    }

    return response;
  } catch {
    return NextResponse.json(
      { error: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
