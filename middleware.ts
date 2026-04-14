/**
 * Next.js Middleware
 *
 * 백엔드가 access_token 쿠키를 `Path=/api` 로 발급하므로,
 * `/admin`, `/mypage` 등 일반 경로에서는 미들웨어에서 쿠키를 읽을 수 없다.
 * 따라서 서버 레벨 인증 가드는 실효성이 없어 활성화하지 않는다.
 *
 * 인증/인가는 다음 두 레이어에서 처리한다.
 *   1) 프론트: AdminAccessGuard / 로그인 모달 (클라이언트 상태 기반)
 *   2) 백엔드: @PreAuthorize + JWT 필터 (API 호출 시 차단)
 */

import { NextResponse } from 'next/server';

export function middleware(): NextResponse {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};

