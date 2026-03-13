/**
 * Next.js Middleware — 인증 가드
 * - 보호 경로 접근 시 auth_token 쿠키 존재 여부를 확인한다
 * - 미인증 사용자는 /auth/login으로 리다이렉트하며, 원래 경로를 callbackUrl로 전달한다
 * - 관리자 경로(/admin)는 별도 권한 체크를 수행할 수 있다
 */

import { NextRequest, NextResponse } from 'next/server';

// TODO: 개발 단계에서는 인증 가드 비활성화 — 배포 전 주석 해제할 것
//
// /** 인증이 필요한 경로 패턴 */
// const PROTECTED_PATHS = [
//   '/learn',
//   '/account',
//   '/checkout',
//   '/cart',
// ];
//
// /** 관리자 인증이 필요한 경로 패턴 */
// const ADMIN_PATHS = ['/admin'];
//
// /** 로그인 페이지 경로 */
// const LOGIN_PATH = '/auth/login';
//
// function isProtectedPath(pathname: string): boolean {
//   return PROTECTED_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
// }
//
// function isAdminPath(pathname: string): boolean {
//   return ADMIN_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
// }

export function middleware(_request: NextRequest): NextResponse | undefined {
  // if (isProtectedPath(pathname) || isAdminPath(pathname)) {
  //   if (!token) {
  //     const loginUrl = new URL(LOGIN_PATH, _request.url);
  //     loginUrl.searchParams.set('callbackUrl', pathname);
  //     return NextResponse.redirect(loginUrl);
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/learn/:path*',
    '/account/:path*',
    '/checkout',
    '/cart',
    '/admin/:path*',
  ],
};
