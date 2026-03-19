/**
 * 고객센터 FAQ 페이지
 * - 자주 묻는 질문(FAQ)을 카테고리별로 제공한다
 * - SupportContainer로 조립한다
 */

import type { Metadata } from 'next';
import { supportData } from '@/data';
import SupportContainer from '@/components/containers/SupportContainer';

const seo = (supportData as { seo: { faq: { title: string; description: string } } }).seo.faq;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
};

export default function SupportPage() {
  return (
    <main className="support-page">
      <SupportContainer />
    </main>
  );
}
