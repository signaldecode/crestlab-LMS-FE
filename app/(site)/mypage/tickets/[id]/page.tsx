/**
 * 마이페이지 1:1 문의 상세 (/mypage/tickets/[id])
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

export default async function MyPageTicketDetailPage({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params;
  const ticketId = Number(id);
  if (!Number.isFinite(ticketId) || ticketId <= 0) notFound();

  return (
    <section className="ticket-page">
      <TicketDetail ticketId={ticketId} />
    </section>
  );
}
