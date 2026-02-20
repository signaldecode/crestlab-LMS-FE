/**
 * 루트 레이아웃 (Root Layout)
 * - Next.js App Router가 요구하는 최상위 레이아웃
 * - 반드시 <html>과 <body> 태그를 포함해야 한다
 * - 전역 메타데이터, 폰트, Provider 등을 설정한다
 */

import '@/assets/styles/main.scss';

export const metadata = {
  title: '강의 플랫폼',
  description: '실무 중심의 온라인 강의 플랫폼',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
