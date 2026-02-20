/**
 * 1:1 문의 작성 페이지
 * - 문의 카테고리 선택, 제목/내용 입력, 첨부 파일 업로드, 제출을 처리한다
 * - TicketContainer를 create 모드로 조립한다
 */

import TicketContainer from '@/components/containers/TicketContainer';

export default function TicketNewPage() {
  return (
    <section className="ticket-new-page">
      <TicketContainer mode="create" />
    </section>
  );
}
