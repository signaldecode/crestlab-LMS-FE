/**
 * 소셜 로그인 콜백 페이지 (선택)
 * - OAuth 소셜 로그인(카카오/네이버/구글 등) 인증 후 리다이렉트되는 중간 페이지
 * - 인증 토큰을 처리하고, 성공 시 메인 또는 이전 페이지로 이동한다
 */

'use client';

export default function AuthCallbackPage() {
  return (
    <div className="auth-callback-page">
      {/* 소셜 인증 처리 중 로딩 표시가 렌더링된다 */}
    </div>
  );
}
