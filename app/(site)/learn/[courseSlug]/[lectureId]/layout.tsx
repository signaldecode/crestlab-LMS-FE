/**
 * 강의 플레이어 전용 레이아웃
 * - AppHeader / AppFooter를 숨기고 전체 화면 플레이어 레이아웃을 사용한다
 * - (site) 레이아웃의 main 래퍼 안에서 렌더되므로 헤더/푸터만 CSS로 숨긴다
 */

import type { JSX, ReactNode } from 'react';

interface LecturePlayerLayoutProps {
  children: ReactNode;
}

export default function LecturePlayerLayout({ children }: LecturePlayerLayoutProps): JSX.Element {
  return (
    <div className="lecture-player-layout">
      {children}
    </div>
  );
}
