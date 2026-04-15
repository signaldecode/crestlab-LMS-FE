/**
 * 관리자 카테고리 관리 페이지 (/admin/categories)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCategoryListContainer, {
  type CategoriesCopy,
} from '@/components/admin/categories/AdminCategoryListContainer';
import { getPageData } from '@/lib/data';

interface PageData extends CategoriesCopy {
  seo: { title: string; description: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

function getCopy(): PageData | null {
  const adminPage = getPageData('admin') as { categories?: PageData } | null;
  return adminPage?.categories ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '카테고리 관리' };
}

export default function Page(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminCategoryListContainer copy={copy} common={common} />;
}
