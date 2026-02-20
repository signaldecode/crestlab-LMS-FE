/**
 * API Route Handler (기본 엔트리)
 * - 백엔드 /api/... 프록시, 헬퍼 API, 토큰/쿠키 정책 안정화 등에 사용한다
 * - 필요에 따라 하위 경로별 route.ts를 추가한다
 */

import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'ok' });
}
