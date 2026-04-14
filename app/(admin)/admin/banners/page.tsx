/**
 * 관리자 배너 관리 페이지 (/admin/banners)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminBannerListContainer, {
  type BannersCopy,
} from '@/components/admin/banners/AdminBannerListContainer';
import { getPageData } from '@/lib/data';

interface BannersPageData extends BannersCopy {
  seo: { title: string; description: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

function getCopy(): BannersPageData | null {
  const adminPage = getPageData('admin') as { banners?: BannersPageData } | null;
  return adminPage?.banners ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '배너 관리' };
}

export default function AdminBannersPage(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminBannerListContainer copy={copy} common={common} />;
}
