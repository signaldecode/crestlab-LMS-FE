import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCouponFormContainer, { type CouponFormCopy } from '@/components/admin/coupons/AdminCouponFormContainer';
import { getPageData } from '@/lib/data';

interface CouponFormPageData extends CouponFormCopy {
  seoCreate: { title: string; description: string };
}

function getCopy(): CouponFormPageData | null {
  const adminPage = getPageData('admin') as { couponForm?: CouponFormPageData } | null;
  return adminPage?.couponForm ?? null;
}

export function generateMetadata(): Metadata {
  const c = getCopy();
  return c ? { title: c.seoCreate.title, description: c.seoCreate.description } : { title: '쿠폰 발행' };
}

export default function Page(): JSX.Element {
  const copy = getCopy();
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;
  return <AdminCouponFormContainer copy={copy} />;
}
