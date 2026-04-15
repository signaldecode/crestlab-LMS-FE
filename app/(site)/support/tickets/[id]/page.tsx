/**
 * 1:1 문의 상세 페이지 (/support/tickets/[id])
 * - 본인이 작성한 문의의 상세 정보와 답변을 표시한다
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supportData } from '@/data';
import TicketDetail from '@/components/support/TicketDetail';

const seo = supportData.seo.ticket;

export const metadata: Metadata = {
  title: `${seo.title} 상세`,
  description: seo.description,
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params;
  const ticketId = Number(id);
  if (!Number.isFinite(ticketId) || ticketId <= 0) notFound();

  return (
    <main className="ticket-page">
      <TicketDetail ticketId={ticketId} />
    </main>
  );
}
