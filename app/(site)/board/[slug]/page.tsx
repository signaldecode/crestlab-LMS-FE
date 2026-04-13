/**
 * 공지사항 상세 페이지 (/board/[slug])
 * - 공지 1건의 상세 내용을 표시한다
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findNoticeBySlug, getBoardData } from '@/lib/data';
import BoardDetailContent from '@/components/board/BoardDetailContent';

const boardPageData = getBoardData().page;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const notice = findNoticeBySlug(slug);
  if (!notice) return { title: boardPageData.seo.title };
  return {
    title: `${notice.title} — ${boardPageData.title}`,
    description: notice.summary,
  };
}

export default async function BoardDetailPage({ params }: Props): Promise<JSX.Element> {
  const { slug } = await params;
  const notice = findNoticeBySlug(slug);

  if (!notice) notFound();

  return <BoardDetailContent notice={notice} />;
}
