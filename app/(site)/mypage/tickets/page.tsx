/**
 * 마이페이지 1:1 문의 목록 (/mypage/tickets)
 * - 마이페이지 레이아웃의 사이드바를 공유한다
 */

import type { JSX } from 'react';
import TicketContainer from '@/components/containers/TicketContainer';

export default function MyPageTicketListPage(): JSX.Element {
  return (
    <section className="ticket-list-page">
      <TicketContainer mode="list" />
    </section>
  );
}
