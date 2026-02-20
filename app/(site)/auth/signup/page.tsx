/**
 * 회원가입 페이지
 * - 이메일/비밀번호/이름/약관동의 폼을 제공한다
 * - SignupContainer로 조립한다
 */

import SignupContainer from '@/components/containers/SignupContainer';

export default function SignupPage() {
  return (
    <section className="signup-page">
      <SignupContainer />
    </section>
  );
}
