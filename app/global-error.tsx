/**
 * Global Error 페이지
 * - 루트 레이아웃에서 에러 발생 시 전체 페이지를 대체하는 폴백 UI
 * - 자체적으로 <html>, <body>를 포함해야 한다 (루트 레이아웃이 대체되므로)
 * - "다시 시도" 버튼으로 복구를 시도하고, 홈 이동 버튼을 제공한다
 * - 모든 텍스트는 pagesData.json에서 로드한다
 */

'use client';

import type { JSX } from 'react';
import pagesData from '@/data/pagesData.json';
import '@/assets/styles/main.scss';

const serverErrorData = (pagesData as unknown as Record<string, Record<string, string>>).serverError;

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps): JSX.Element {
  return (
    <html lang="ko">
      <body>
        <main className="global-error-page">
          <section className="global-error-page__content">
            <h1 className="global-error-page__title">{serverErrorData.title}</h1>
            <p className="global-error-page__description">{serverErrorData.description}</p>
            <div className="global-error-page__actions">
              <button
                type="button"
                className="global-error-page__retry-btn"
                onClick={reset}
                aria-label={serverErrorData.retryAriaLabel}
              >
                {serverErrorData.retryLabel}
              </button>
              <a
                href={serverErrorData.homeHref}
                className="global-error-page__home-btn"
                aria-label={serverErrorData.homeAriaLabel}
              >
                {serverErrorData.homeLabel}
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  );
}
