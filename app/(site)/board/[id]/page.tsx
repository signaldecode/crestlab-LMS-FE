/**
 * 공지사항 상세 페이지 (/board/[id])
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { getBoardData } from '@/lib/data';
import BoardDetailContent from '@/components/board/BoardDetailContent';

const boardPageData = getBoardData().page;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: boardPageData.seo.title,
    description: boardPageData.seo.description,
  };
}

export default async function BoardDetailPage({ params }: Props): Promise<JSX.Element> {
  const { id } = await params;
  return <BoardDetailContent noticeId={Number(id)} />;
}
