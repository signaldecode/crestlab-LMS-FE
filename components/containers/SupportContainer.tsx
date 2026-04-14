/**
 * 고객지원 허브 컨테이너 (SupportContainer)
 * - 빠른 도움말(1:1 문의 / 내 문의내역) + 공지사항 + FAQ 통합 페이지
 * - 모든 텍스트는 supportData에서 가져온다 (하드코딩 금지)
 */

import Link from 'next/link';
import { supportData } from '@/data';
import FaqApiContainer, { type FaqApiCopy } from '@/components/support/FaqApiContainer';
import SupportNotices, { type SupportNoticesCopy } from '@/components/support/SupportNotices';
import type { SupportFaqData } from '@/types';

interface QuickAction {
  label: string;
  description: string;
  href: string;
  ariaLabel: string;
}

interface SupportHub {
  pageTitle: string;
  pageSubtitle: string;
  quickActions: { title: string; actions: QuickAction[] };
  notices: SupportNoticesCopy;
}

const data = supportData as { hub: SupportHub; faq: SupportFaqData };
const hub = data.hub;
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

export default function SupportContainer() {
  return (
    <>
      <header className="support-page__header">
        <h1 className="support-page__title">{hub.pageTitle}</h1>
        <p className="support-page__subtitle">{hub.pageSubtitle}</p>
      </header>

      <section className="support-page__quick" aria-label={hub.quickActions.title}>
        <h2 className="support-page__section-title">{hub.quickActions.title}</h2>
        <div className="support-page__quick-grid">
          {hub.quickActions.actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="support-page__quick-card"
              aria-label={action.ariaLabel}
            >
              <span className="support-page__quick-label">{action.label}</span>
              <span className="support-page__quick-desc">{action.description}</span>
              <span className="support-page__quick-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      <SupportNotices copy={hub.notices} />

      <section className="faq-page" aria-label={faq.ariaLabel}>
        <div className="faq-page__header">
          <h2 className="faq-page__title">{faq.title}</h2>
        </div>

        <FaqApiContainer copy={faqApiCopy} />
      </section>
    </>
  );
}
