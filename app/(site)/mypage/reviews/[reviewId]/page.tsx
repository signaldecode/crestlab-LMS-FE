/**
 * 후기 상세/수정 페이지 (/mypage/reviews/[reviewId])
 * - 마이페이지 레이아웃 사이드바를 공유한다
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import accountData from '@/data/accountData.json';
import ReviewDetailContent from '@/components/mypage/ReviewDetailContent';

const pageData = accountData.mypage.reviewDetailPage;

export const metadata: Metadata = {
  title: pageData.title,
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ reviewId: string }>;
}

export default async function ReviewDetailPage({ params }: Props): Promise<JSX.Element> {
  const { reviewId } = await params;
  return <ReviewDetailContent reviewId={reviewId} />;
}
