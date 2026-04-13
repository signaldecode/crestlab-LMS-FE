/**
 * 마이페이지 레이아웃 (/mypage)
 * - 사이드바 + 콘텐츠 2칸 구조
 * - 모든 서브 라우트에서 사이드바를 공유한다
 */

import type { JSX, ReactNode } from 'react';
import MyPageSidebar from '@/components/mypage/MyPageSidebar';

interface MyPageLayoutProps {
  children: ReactNode;
}

export default function MyPageLayout({ children }: MyPageLayoutProps): JSX.Element {
  return (
    <section className="mypage">
      <div className="mypage__layout">
        <MyPageSidebar />
        <div className="mypage__content">
          {children}
        </div>
      </div>
    </section>
  );
}
