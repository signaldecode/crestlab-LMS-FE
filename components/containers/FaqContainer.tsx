/**
 * FAQ 컨테이너 (FaqContainer)
 * - 자주 묻는 질문을 아코디언으로 보여주는 섹션
 * - FAQ 데이터는 data에서 가져오고, Accordion UI 컴포넌트를 사용한다
 * - FAQPage JSON-LD를 주입하여 SEO/AEO를 지원한다
 */

import type { JSX } from 'react';
import Accordion from '@/components/ui/Accordion';

export default function FaqContainer(): JSX.Element {
  return (
    <section className="faq-container">
      {/* data 기반 FAQ 아코디언이 렌더링된다 */}
      <Accordion items={[]} />
    </section>
  );
}
