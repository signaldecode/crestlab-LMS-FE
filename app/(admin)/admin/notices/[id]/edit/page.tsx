import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminNoticeFormContainer, {
  type NoticeFormCopy,
} from '@/components/admin/notices/AdminNoticeFormContainer';
import { getPageData } from '@/lib/data';

interface PageData extends NoticeFormCopy {
  seoEdit: { title: string; description: string };
  notFoundText: string;
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

interface PageProps { params: Promise<{ id: string }>; }

function getCopy(): PageData | null {
  const adminPage = getPageData('admin') as { noticeForm?: PageData } | null;
  return adminPage?.noticeForm ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await params;
  const c = getCopy();
  return c ? { title: c.seoEdit.title, description: c.seoEdit.description } : { title: '공지 수정' };
}

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params;
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return (
    <AdminNoticeFormContainer
      mode="edit"
      noticeId={Number(id)}
      copy={copy}
      common={common}
      notFoundText={copy.notFoundText}
    />
  );
}
