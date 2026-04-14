/**
 * 관리자 쿠폰 관리 페이지 (/admin/coupons)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCouponListContainer, {
  type CouponsCopy,
} from '@/components/admin/coupons/AdminCouponListContainer';
import { getPageData } from '@/lib/data';

interface PageData extends CouponsCopy {
  seo: { title: string; description: string };
}

interface CommonCopy { loadingText: string; errorTitle: string; errorRetryLabel: string; }

function getCopy(): PageData | null {
  const adminPage = getPageData('admin') as { coupons?: PageData } | null;
  return adminPage?.coupons ?? null;
}
function getCommonCopy(): CommonCopy | null {
  const adminPage = getPageData('admin') as { common?: CommonCopy } | null;
  return adminPage?.common ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '쿠폰 관리' };
}

export default function Page(): JSX.Element {
  const copy = getCopy();
  const common = getCommonCopy();
  if (!copy || !common) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminCouponListContainer copy={copy} common={common} />;
}
