/**
 * 관리자 공지사항 관리 페이지 (/admin/notices)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminNoticeListContainer, {
  type NoticesCopy,
} from '@/components/admin/notices/AdminNoticeListContainer';
import { getPageData } from '@/lib/data';

interface PageData extends NoticesCopy {
  seo: { title: string; description: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

function getCopy(): PageData | null {
  const adminPage = getPageData('admin') as { notices?: PageData } | null;
  return adminPage?.notices ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '공지사항 관리' };
}

export default function Page(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminNoticeListContainer copy={copy} common={common} />;
}
