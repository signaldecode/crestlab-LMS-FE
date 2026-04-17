/**
 * 1:1 문의 작성 (/support/tickets/new)
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

export default function TicketNewPage(): JSX.Element {
  return (
    <section className="ticket-page">
      <TicketContainer mode="create" />
    </section>
  );
}
