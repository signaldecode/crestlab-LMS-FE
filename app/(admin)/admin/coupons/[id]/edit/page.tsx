import type { JSX } from 'react';
import type { Metadata } from 'next';
import AdminCouponFormContainer, { type CouponFormCopy } from '@/components/admin/coupons/AdminCouponFormContainer';
import { getPageData } from '@/lib/data';

interface CouponFormPageData extends CouponFormCopy {
  seoEdit?: { title: string; description: string };
}

function getCopy(): CouponFormPageData | null {
  const adminPage = getPageData('admin') as { couponForm?: CouponFormPageData } | null;
  return adminPage?.couponForm ?? null;
}

export function generateMetadata(): Metadata {
  const c = getCopy();
  return c?.seoEdit
    ? { title: c.seoEdit.title, description: c.seoEdit.description }
    : { title: '쿠폰 수정' };
}

interface PageProps { params: Promise<{ id: string }> }

export default async function Page({ params }: PageProps): Promise<JSX.Element> {
  const copy = getCopy();
  if (!copy) return <main>데이터를 불러올 수 없습니다.</main>;
  const { id } = await params;
  const couponId = Number(id);
  if (!Number.isInteger(couponId) || couponId <= 0) {
    return <main>잘못된 쿠폰 ID입니다.</main>;
  }
  return <AdminCouponFormContainer copy={copy} couponId={couponId} />;
}
