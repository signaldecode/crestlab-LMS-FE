/**
 * 404 Not Found 페이지
 * - 존재하지 않는 경로 접근 시 표시
 * - 헤더/푸터를 유지하고, 중앙에 안내 문구 + 홈 이동 버튼을 표시한다
 * - 모든 텍스트는 pagesData.json에서 로드한다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/common/AppHeader';
import AppFooter from '@/components/common/AppFooter';
import SkipToContent from '@/components/common/SkipToContent';
import pagesData from '@/data/pagesData.json';

const notFoundData = (pagesData as unknown as Record<string, Record<string, string>>).notFound;

export default function NotFoundPage(): JSX.Element {
  return (
    <>
      <SkipToContent />
      <AppHeader />
      <main id="main-content" className="not-found-page">
        <section className="not-found-page__content">
          <h1 className="not-found-page__title">{notFoundData.title}</h1>
          <p className="not-found-page__description">{notFoundData.description}</p>
          <Link
            href={notFoundData.homeHref}
            className="not-found-page__home-btn"
            aria-label={notFoundData.homeAriaLabel}
          >
            {notFoundData.homeLabel}
          </Link>
        </section>
      </main>
      <AppFooter />
    </>
  );
}
