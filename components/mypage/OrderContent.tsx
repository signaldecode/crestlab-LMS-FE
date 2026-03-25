/**
 * 구매 내역 콘텐츠 (OrderContent)
 * - /mypage/orders 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOrders, getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';
import uiData from '@/data/uiData.json';
import type { Course } from '@/types';

const ordersPageData = accountData.mypage.ordersPage;
const SK = 'mypage-classroom';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
}

export default function OrderContent(): JSX.Element {
  const orders = getOrders();
  const allCourses = getCourses();

  const ordersWithCourses = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      courses: order.courseSlugs
        .map((slug) => allCourses.find((c) => c.slug === slug))
        .filter((c): c is Course => c != null),
    }));
  }, [orders, allCourses]);

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{ordersPageData.title}</h2>
        {ordersWithCourses.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{ordersPageData.emptyText}</p>
          </div>
        ) : (
          <div className={`${SK}__purchase-list`}>
            {ordersWithCourses.map((order) => (
              <Link
                key={order.id}
                href={`/mypage/orders/${order.id}`}
                className={`${SK}__purchase-row`}
                aria-label={ordersPageData.detailAriaLabel}
              >
                <span className={`${SK}__purchase-date`}>{order.createdAt}</span>
                <div className={`${SK}__purchase-course`}>
                  {order.courses[0] && (
                    <>
                      <span className={`${SK}__purchase-thumb-link`}>
                        <Image
                          src={order.courses[0].thumbnail}
                          alt={order.courses[0].thumbnailAlt}
                          width={64}
                          height={48}
                          className={`${SK}__purchase-img`}
                        />
                      </span>
                      <div className={`${SK}__purchase-info`}>
                        <span className={`${SK}__purchase-title`}>
                          {order.courses[0].title}
                        </span>
                        <span className={`${SK}__purchase-instructor`}>
                          {order.courses[0].instructor}
                          {order.courses.length > 1 && ` 외 ${order.courses.length - 1}${ordersPageData.additionalCountSuffix}`}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <span className={`${SK}__purchase-price`}>{formatPrice(order.totalAmount)}</span>
                <span className={`${SK}__purchase-status ${SK}__purchase-status--${order.status === '환불' ? 'refund' : 'done'}`}>
                  {order.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
