/**
 * 고객센터 컨테이너 (SupportContainer)
 * - 자주 묻는 질문(FAQ) 페이지의 조립 레이어
 * - 카테고리 칩 필터 + 아코디언 구조로 FAQ를 렌더링한다
 * - 모든 텍스트는 supportData에서 가져온다
 */

import { supportData } from '@/data';
import FaqChipFilter from '@/components/support/FaqChipFilter';
import type { SupportFaqData } from '@/types';

const faq = (supportData as { faq: SupportFaqData }).faq;

export default function SupportContainer() {
  return (
    <section className="faq-page" aria-label={faq.ariaLabel}>
      <div className="faq-page__header">
        <h1 className="faq-page__title">{faq.title}</h1>
      </div>

      <FaqChipFilter
        categories={faq.categories}
        items={faq.items}
        chipAriaLabel={faq.chipAriaLabel}
        questionPrefix={faq.questionPrefix}
        answerPrefix={faq.answerPrefix}
      />
    </section>
  );
}
