/**
 * 로그인 페이지
 * - 이메일/비밀번호 로그인 폼과 소셜 로그인 버튼을 제공한다
 * - LoginContainer로 조립한다
 */

import LoginContainer from '@/components/containers/LoginContainer';

export default function LoginPage() {
  return (
    <section className="login-page">
      <LoginContainer />
    </section>
  );
}
