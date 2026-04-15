/**
 * 준비중 placeholder (ComingSoon)
 * - 콘텐츠가 아직 비어있는 페이지에서 노출되는 공용 빈 상태 화면
 * - 모든 텍스트는 props 로 주입 (data 분리 원칙 준수)
 */

import type { JSX } from 'react';
import Link from 'next/link';

export interface ComingSoonProps {
  title: string;
  description?: string;
  primaryAction?: { label: string; href: string; ariaLabel?: string };
  secondaryAction?: { label: string; href: string; ariaLabel?: string };
}

export default function ComingSoon({
  title,
  description,
  primaryAction,
  secondaryAction,
}: ComingSoonProps): JSX.Element {
  return (
    <section className="coming-soon" aria-labelledby="coming-soon-title">
      <div className="coming-soon__inner">
        <span className="coming-soon__badge" aria-hidden="true">PREPARING</span>
        <h1 id="coming-soon-title" className="coming-soon__title">{title}</h1>
        {description && (
          <p className="coming-soon__description">{description}</p>
        )}
        {(primaryAction || secondaryAction) && (
          <div className="coming-soon__actions">
            {primaryAction && (
              <Link
                href={primaryAction.href}
                aria-label={primaryAction.ariaLabel ?? primaryAction.label}
                className="coming-soon__btn coming-soon__btn--primary"
              >
                {primaryAction.label}
              </Link>
            )}
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                aria-label={secondaryAction.ariaLabel ?? secondaryAction.label}
                className="coming-soon__btn coming-soon__btn--ghost"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
