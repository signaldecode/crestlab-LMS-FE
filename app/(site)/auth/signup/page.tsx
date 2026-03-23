/**
 * 회원가입 페이지
 * - 이메일/비밀번호/이름/약관동의 폼을 제공한다
 * - SignupContainer로 조립한다
 */

import type { Metadata } from 'next';
import SignupContainer from '@/components/containers/SignupContainer';
import pagesData from '@/data/pagesData.json';

const signupSeo = pagesData.auth.signup.seo;

export const metadata: Metadata = {
  title: signupSeo.title,
};

export default function SignupPage() {
  return (
    <main className="signup-page">
      <SignupContainer />
    </main>
  );
}
