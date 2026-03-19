/**
 * FAQ 칩 필터 (FaqChipFilter)
 * - 카테고리 칩 버튼으로 FAQ 항목을 필터링한다
 * - 첫 번째 카테고리가 기본 선택된다
 * - 아코디언으로 질문-답변을 렌더링한다
 * - aria-expanded, aria-controls, role="tablist" A11y 준수
 */

'use client';

import { useState } from 'react';
import type { SupportFaqCategory, SupportFaqItem } from '@/types';

interface FaqChipFilterProps {
  categories: SupportFaqCategory[];
  items: SupportFaqItem[];
  chipAriaLabel: string;
  questionPrefix: string;
  answerPrefix: string;
}

export default function FaqChipFilter({
  categories,
  items,
  chipAriaLabel,
  questionPrefix,
  answerPrefix,
}: FaqChipFilterProps) {
  const [activeChip, setActiveChip] = useState(categories[0]?.value ?? '');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredItems = items.filter((item) => item.category === activeChip);

  const handleChipClick = (value: string) => {
    setActiveChip(value);
    setOpenIndex(null);
  };

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <div className="faq-page__chips" role="tablist" aria-label={chipAriaLabel}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            className={`faq-page__chip ${activeChip === cat.value ? 'faq-page__chip--active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeChip === cat.value}
            onClick={() => handleChipClick(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="accordion" role="list">
        {filteredItems.map((item, index) => {
          const isOpen = openIndex === index;
          const headingId = `faq-heading-${activeChip}-${index}`;
          const panelId = `faq-panel-${activeChip}-${index}`;

          return (
            <div key={`${activeChip}-${index}`} className="accordion__item" role="listitem">
              <h3 className="accordion__heading">
                <button
                  id={headingId}
                  className="accordion__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="accordion__question-text">
                    <span className="accordion__prefix">{questionPrefix}</span>
                    {item.question}
                  </span>
                  <svg
                    className={`accordion__icon ${isOpen ? 'accordion__icon--open' : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </h3>
              <div
                id={panelId}
                className={`accordion__panel ${isOpen ? 'accordion__panel--open' : ''}`}
                role="region"
                aria-labelledby={headingId}
                hidden={!isOpen}
              >
                <p className="accordion__answer">
                  <span className="accordion__prefix">{answerPrefix}</span>
                  {item.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
