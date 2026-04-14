/**
 * 관리자 쿠폰 관리 페이지 (/admin/coupons)
 * - 쿠폰 목록 + 비활성화 확인 모달 (Container에서 처리)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCouponListContainer, {
  type CouponsCopy,
} from '@/components/admin/coupons/AdminCouponListContainer';
import { getAdminExtraData, getPageData } from '@/lib/data';

interface CouponsPageData extends CouponsCopy {
  seo: { title: string; description: string };
}

function getCopy(): CouponsPageData | null {
  const adminPage = getPageData('admin') as { coupons?: CouponsPageData } | null;
  return adminPage?.coupons ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  return copy ? { title: copy.seo.title, description: copy.seo.description } : { title: '쿠폰 관리' };
}

export default function AdminCouponsPage(): JSX.Element {
  const copy = getCopy();
  const coupons = getAdminExtraData().coupons;
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;

  return <AdminCouponListContainer coupons={coupons} copy={copy} />;
}
