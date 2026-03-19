/**
 * 1:1 문의 작성 페이지
 * - 서비스/분야 선택, 담당자/연락처/회사/이메일 입력, 문의 내용, 파일 첨부를 처리한다
 * - TicketContainer를 create 모드로 조립한다
 * - SEO metadata는 supportData에서 로드한다
 */

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

export default function TicketNewPage() {
  return (
    <main className="ticket-page">
      <TicketContainer mode="create" />
    </main>
  );
}
