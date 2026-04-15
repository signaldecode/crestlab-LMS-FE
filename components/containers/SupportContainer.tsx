/**
 * 고객지원 허브 컨테이너 (SupportContainer)
 * - 빠른 도움말(1:1 문의 / FAQ) + 공지사항
 * - FAQ 본문은 /support/faq 별도 페이지로 분리됨
 * - 모든 텍스트는 supportData에서 가져온다 (하드코딩 금지)
 */

import Link from 'next/link';
import { supportData } from '@/data';
import SupportNotices, { type SupportNoticesCopy } from '@/components/support/SupportNotices';

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

const data = supportData as { hub: SupportHub };
const hub = data.hub;

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
    </>
  );
}
