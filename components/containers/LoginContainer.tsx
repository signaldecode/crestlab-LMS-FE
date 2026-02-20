/**
 * 로그인 컨테이너 (LoginContainer)
 * - 로그인 폼(이메일/비밀번호), 소셜 로그인 버튼, 회원가입 링크를 조립한다
 * - useAuthStore에서 인증 상태를 관리한다
 * - 폼 label/placeholder/에러 문구는 data에서 가져온다
 */

import type { JSX } from 'react';

export default function LoginContainer(): JSX.Element {
  return (
    <section className="login-container">
      {/* 로그인 폼 + 소셜 로그인 + 회원가입 링크가 렌더링된다 */}
    </section>
  );
}
