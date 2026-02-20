/**
 * 아코디언 (Accordion) — FAQ용 A11y 필수 컴포넌트
 * - FAQ 질문-답변을 접고 펼 수 있는 아코디언 UI
 * - aria-expanded, aria-controls, id 매칭을 필수로 준수한다
 * - 키보드(Enter/Space) 토글을 지원한다
 */

'use client';

import { useState } from 'react';

export default function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const headingId = `accordion-heading-${index}`;
        const panelId = `accordion-panel-${index}`;

        return (
          <div key={index} className="accordion__item">
            <button
              id={headingId}
              className="accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
            >
              {item.question}
            </button>
            <div
              id={panelId}
              className="accordion__panel"
              role="region"
              aria-labelledby={headingId}
              hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
