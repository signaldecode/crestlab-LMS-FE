/**
 * 1:1 문의 목록 (/support/tickets)
 * - 사이트 공용 레이아웃(헤더/푸터)에서 독립 페이지로 렌더링
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { supportData } from '@/data';
import TicketContainer from '@/components/containers/TicketContainer';

const seo = supportData.seo.ticket;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  openGraph: {
    title: seo.title,
    description: seo.description,
  },
};

export default function TicketListPage(): JSX.Element {
  return (
    <section className="ticket-list-page">
      <TicketContainer mode="list" />
    </section>
  );
}
