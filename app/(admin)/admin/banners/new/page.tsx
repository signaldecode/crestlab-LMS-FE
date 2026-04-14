import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminBannerFormContainer, { type BannerFormCopy } from '@/components/admin/banners/AdminBannerFormContainer';
import { getPageData } from '@/lib/data';

interface BannerFormPageData extends BannerFormCopy {
  seoCreate: { title: string; description: string };
  seoEdit: { title: string; description: string };
  notFoundText: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

function getCopy(): BannerFormPageData | null {
  const adminPage = getPageData('admin') as { bannerForm?: BannerFormPageData } | null;
  return adminPage?.bannerForm ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const c = getCopy();
  return c ? { title: c.seoCreate.title, description: c.seoCreate.description } : { title: '배너 등록' };
}

export default function Page(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminBannerFormContainer mode="create" copy={copy} common={common} />;
}
