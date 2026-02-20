/**
 * 고객센터 컨테이너 (SupportContainer)
 * - 고객센터 메인 페이지의 조립 레이어
 * - 자주 묻는 질문(FAQ), 공지사항, 1:1 문의 링크를 구성한다
 * - FAQ는 Accordion 컴포넌트로 렌더링하고 data에서 가져온다
 */

import type { JSX } from 'react';

export default function SupportContainer(): JSX.Element {
  return (
    <section className="support-container">
      {/* FAQ 아코디언 + 공지사항 리스트 + 1:1 문의 CTA가 렌더링된다 */}
    </section>
  );
}
