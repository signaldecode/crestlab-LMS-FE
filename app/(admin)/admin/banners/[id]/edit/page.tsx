import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminBannerFormContainer, { type BannerFormCopy } from '@/components/admin/banners/AdminBannerFormContainer';
import { getPageData } from '@/lib/data';

interface BannerFormPageData extends BannerFormCopy {
  seoEdit: { title: string; description: string };
  notFoundText: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface PageProps { params: Promise<{ id: string }>; }

function getCopy(): BannerFormPageData | null {
  const adminPage = getPageData('admin') as { bannerForm?: BannerFormPageData } | null;
  return adminPage?.bannerForm ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  const c = getCopy();
  return c ? { title: c.seoEdit.title, description: c.seoEdit.description } : { title: '배너 수정' };
}

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params;
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return (
    <AdminBannerFormContainer
      mode="edit"
      bannerId={Number(id)}
      copy={copy}
      common={common}
      notFoundText={copy.notFoundText}
    />
  );
}
