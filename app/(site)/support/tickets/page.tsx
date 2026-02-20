/**
 * 1:1 문의 목록 페이지
 * - 사용자가 등록한 1:1 문의 내역을 목록으로 보여준다
 * - 상태(대기중/답변완료)별 필터를 지원한다
 * - TicketContainer를 list 모드로 조립한다
 */

import TicketContainer from '@/components/containers/TicketContainer';

export default function TicketListPage() {
  return (
    <section className="ticket-list-page">
      <TicketContainer mode="list" />
    </section>
  );
}
