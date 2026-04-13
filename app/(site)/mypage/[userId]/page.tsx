/**
 * 타 유저 프로필 페이지 (/mypage/[userId])
 * - 커뮤니티 제거로 인해 최소화 — 추후 필요 시 확장
 */

import type { JSX } from 'react';
import { redirect } from 'next/navigation';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function OtherUserProfilePage({ params }: ProfilePageProps): Promise<JSX.Element> {
  void (await params);
  redirect('/mypage');
}
