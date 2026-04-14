/**
 * FAQ API 컨테이너 (FaqApiContainer)
 * - GET /api/v1/faqs 호출 → 카테고리/항목을 데이터에서 파생
 * - supportData의 categoryLabels(value→label 맵)로 카테고리명 표시
 * - 로딩 / 빈 / 에러 상태 처리
 * - 렌더링은 FaqChipFilter에 위임한다
 */

'use client';

import { useEffect, useMemo, useState } from 'react';
import type { JSX } from 'react';
import FaqChipFilter from '@/components/support/FaqChipFilter';
import { fetchFaqs, type FaqApiItem } from '@/lib/userApi';
import type { SupportFaqCategory, SupportFaqItem } from '@/types';

export interface FaqApiCopy {
  ariaLabel: string;
  chipAriaLabel: string;
  questionPrefix: string;
  answerPrefix: string;
  /** 카테고리 코드 → 표시 라벨 맵 (예: SERVICE → "서비스") */
  categoryLabels: Record<string, string>;
  loadingText: string;
  emptyText: string;
  errorText: string;
}

interface Props {
  copy: FaqApiCopy;
  /** 첫 로드 시 카테고리 필터를 서버에 적용할지 여부 (기본: 클라이언트 필터링) */
  initialCategory?: string;
}

export default function FaqApiContainer({ copy, initialCategory }: Props): JSX.Element {
  const [items, setItems] = useState<FaqApiItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetchFaqs(initialCategory);
        if (!cancelled) setItems(res);
      } catch {
        if (!cancelled) setError(copy.errorText);
      }
    })();
    return () => { cancelled = true; };
  }, [initialCategory, copy.errorText]);

  const { categories, faqItems } = useMemo(() => {
    if (!items) return { categories: [], faqItems: [] as SupportFaqItem[] };
    const uniqueValues = Array.from(new Set(items.map((i) => i.category)));
    const cats: SupportFaqCategory[] = uniqueValues.map((value) => ({
      value,
      label: copy.categoryLabels[value] ?? value,
    }));
    const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
    const mapped: SupportFaqItem[] = sorted.map((i) => ({
      category: i.category,
      question: i.question,
      answer: i.answer,
    }));
    return { categories: cats, faqItems: mapped };
  }, [items, copy.categoryLabels]);

  if (items === null && !error) {
    return <p className="faq-page__status">{copy.loadingText}</p>;
  }
  if (error) {
    return <p className="faq-page__status faq-page__status--error" role="alert">{error}</p>;
  }
  if (items && items.length === 0) {
    return <p className="faq-page__status">{copy.emptyText}</p>;
  }

  return (
    <FaqChipFilter
      categories={categories}
      items={faqItems}
      chipAriaLabel={copy.chipAriaLabel}
      questionPrefix={copy.questionPrefix}
      answerPrefix={copy.answerPrefix}
    />
  );
}
