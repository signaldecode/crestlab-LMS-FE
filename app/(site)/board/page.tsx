/**
 * 공지사항 목록 페이지 (/board)
 * - 관리자 공지를 카테고리별로 필터링하여 보여준다
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import BoardListContainer from '@/components/containers/BoardListContainer';
import { getBoardData } from '@/lib/data';

const boardData = getBoardData();

export const metadata: Metadata = {
  title: boardData.page.seo.title,
  description: boardData.page.seo.description,
};

export default function BoardPage() {
  return (
    <Suspense>
      <BoardListContainer />
    </Suspense>
  );
}
