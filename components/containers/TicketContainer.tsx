/**
 * 1:1 문의 컨테이너 (TicketContainer)
 * - 1:1 문의 작성/목록 페이지의 조립 레이어
 * - 문의 카테고리 선택, 제목/내용 입력, 첨부 파일, 제출 버튼을 구성한다
 * - 문의 목록에서는 상태(대기/답변완료)를 표시한다
 */

import type { JSX } from 'react';

interface TicketContainerProps {
  mode?: 'list' | 'create';
}

export default function TicketContainer({ mode = 'list' }: TicketContainerProps): JSX.Element {
  return (
    <section className="ticket-container">
      {/* mode에 따라 문의 목록 또는 작성 폼이 렌더링된다 */}
    </section>
  );
}
