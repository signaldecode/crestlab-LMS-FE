/**
 * 뉴스 목록 페이지 (/news)
 * - GET /api/v1/news 결과를 카테고리 필터/페이지네이션과 함께 보여준다
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { getPageData } from '@/lib/data';
import NewsListContainer, { type NewsListCopy } from '@/components/containers/NewsListContainer';

interface NewsPageData extends NewsListCopy {
  seo: { title: string; description: string };
}

function getCopy(): NewsPageData | null {
  return (getPageData('news') as NewsPageData | null);
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '뉴스' };
}

export default function NewsPage(): JSX.Element {
  const copy = getCopy();
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;
  return (
    <main className="news-page">
      <NewsListContainer copy={copy} />
    </main>
  );
}
