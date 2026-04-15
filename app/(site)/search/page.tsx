import type { JSX } from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import SearchContainer, { type SearchCopy } from '@/components/search/SearchContainer';
import { getPageData } from '@/lib/data';

interface SearchPageData extends SearchCopy {
  seo: { title: string; description: string };
}

function getCopy(): SearchPageData | null {
  return (getPageData('search') as SearchPageData | null) ?? null;
}

export function generateMetadata(): Metadata {
  const c = getCopy();
  return c ? { title: c.seo.title, description: c.seo.description } : { title: '통합 검색' };
}

export default function Page(): JSX.Element {
  const copy = getCopy();
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;
  return (
    <Suspense fallback={<main>{copy.loadingText}</main>}>
      <SearchContainer copy={copy} />
    </Suspense>
  );
}
