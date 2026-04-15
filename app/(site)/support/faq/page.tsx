/**
 * 자주 묻는 질문(FAQ) 페이지
 * - GET /api/v1/faqs 기반 카테고리 필터 + 아코디언
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supportData } from '@/data';
import FaqApiContainer, { type FaqApiCopy } from '@/components/support/FaqApiContainer';
import type { SupportFaqData } from '@/types';

interface FaqSeo { title: string; description: string }
interface SupportShape {
  faq: SupportFaqData;
  hub: { pageTitle: string };
  seo: { faq: FaqSeo };
}

const data = supportData as SupportShape;
const faq = data.faq;

const faqApiCopy: FaqApiCopy = {
  ariaLabel: faq.ariaLabel,
  chipAriaLabel: faq.chipAriaLabel,
  questionPrefix: faq.questionPrefix,
  answerPrefix: faq.answerPrefix,
  categoryLabels: faq.categoryLabels,
  loadingText: faq.loadingText,
  emptyText: faq.emptyText,
  errorText: faq.errorText,
};

export const metadata: Metadata = {
  title: data.seo.faq.title,
  description: data.seo.faq.description,
};

export default function SupportFaqPage(): JSX.Element {
  return (
    <main className="support-page">
      <header className="support-page__header">
        <Link href="/support" className="support-page__back">
          ← {data.hub.pageTitle}
        </Link>
        <h1 className="support-page__title">{faq.title}</h1>
      </header>

      <section className="faq-page" aria-label={faq.ariaLabel}>
        <FaqApiContainer copy={faqApiCopy} />
      </section>
    </main>
  );
}
