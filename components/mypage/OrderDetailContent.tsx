/**
 * 주문 상세 콘텐츠 (OrderDetailContent)
 * - /mypage/orders/[orderId] 페이지에서 사용
 * - 주문 강의 목록, 할인 내역, 결제 정보를 표시
 */

'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { findOrderById, getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';
import uiData from '@/data/uiData.json';
import type { Course } from '@/types';

const pageData = accountData.mypage.orderDetailPage;
const SK = 'order-detail';

function formatPrice(price: number): string {
  return price.toLocaleString('ko-KR') + uiData.priceUnit;
}

interface OrderDetailContentProps {
  orderId: string;
}

export default function OrderDetailContent({ orderId }: OrderDetailContentProps): JSX.Element {
  const order = findOrderById(orderId);
  const allCourses = getCourses();

  const courseMap = useMemo(() => {
    const map = new Map<string, Course>();
    allCourses.forEach((c) => map.set(c.slug, c));
    return map;
  }, [allCourses]);

  if (!order) {
    return (
      <div className={`${SK}`}>
        <div className={`${SK}__not-found`}>
          <h2 className={`${SK}__not-found-title`}>{pageData.notFoundTitle}</h2>
          <p className={`${SK}__not-found-desc`}>{pageData.notFoundDescription}</p>
          <Link href="/mypage" className={`${SK}__not-found-link`}>
            {pageData.notFoundLinkLabel}
          </Link>
        </div>
      </div>
    );
  }

  const statusKey = order.status as keyof typeof pageData.statusLabels;
  const statusText = pageData.statusLabels[statusKey] || order.status;
  const methodKey = order.paymentMethod as keyof typeof pageData.methodLabels;
  const methodText = pageData.methodLabels[methodKey] || order.paymentMethod;
  const isRefund = order.status === '환불';

  return (
    <div className={`${SK}`}>
      {/* 뒤로가기 */}
      <Link href="/mypage" className={`${SK}__back`} aria-label={pageData.backAriaLabel}>
        &larr; {pageData.backLabel}
      </Link>

      {/* 헤더 */}
      <header className={`${SK}__header`}>
        <h2 className={`${SK}__title`}>{pageData.title}</h2>
        <span className={`${SK}__status ${SK}__status--${isRefund ? 'refund' : 'done'}`}>
          {statusText}
        </span>
      </header>

      {/* 주문 기본 정보 */}
      <section className={`${SK}__info`}>
        <dl className={`${SK}__info-list`}>
          <div className={`${SK}__info-row`}>
            <dt className={`${SK}__info-label`}>{pageData.orderIdLabel}</dt>
            <dd className={`${SK}__info-value`}>{order.id}</dd>
          </div>
          <div className={`${SK}__info-row`}>
            <dt className={`${SK}__info-label`}>{pageData.orderDateLabel}</dt>
            <dd className={`${SK}__info-value`}>{order.createdAt}</dd>
          </div>
          <div className={`${SK}__info-row`}>
            <dt className={`${SK}__info-label`}>{pageData.paymentMethodLabel}</dt>
            <dd className={`${SK}__info-value`}>{methodText}</dd>
          </div>
        </dl>
      </section>

      {/* 주문 강의 목록 */}
      <section className={`${SK}__section`}>
        <h3 className={`${SK}__section-title`}>{pageData.sectionCourses}</h3>
        <ul className={`${SK}__course-list`}>
          {order.items.map((item) => {
            const course = courseMap.get(item.courseSlug);
            return (
              <li key={item.courseSlug} className={`${SK}__course-item`}>
                {course && (
                  <Link href={`/courses/${course.slug}`} className={`${SK}__course-thumb-link`}>
                    <Image
                      src={course.thumbnail}
                      alt={course.thumbnailAlt}
                      width={80}
                      height={60}
                      className={`${SK}__course-img`}
                    />
                  </Link>
                )}
                <div className={`${SK}__course-info`}>
                  {course ? (
                    <Link href={`/courses/${course.slug}`} className={`${SK}__course-title`}>
                      {course.title}
                    </Link>
                  ) : (
                    <span className={`${SK}__course-title`}>{item.courseSlug}</span>
                  )}
                  {course && (
                    <span className={`${SK}__course-instructor`}>{course.instructor}</span>
                  )}
                </div>
                <span className={`${SK}__course-price`}>{formatPrice(item.price)}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 결제 금액 */}
      <section className={`${SK}__section`}>
        <h3 className={`${SK}__section-title`}>{pageData.sectionPrice}</h3>
        <dl className={`${SK}__price-list`}>
          <div className={`${SK}__price-row`}>
            <dt>{pageData.coursePriceLabel}</dt>
            <dd>{formatPrice(order.coursePrice)}</dd>
          </div>
          {order.couponDiscount > 0 && (
            <div className={`${SK}__price-row ${SK}__price-row--discount`}>
              <dt>{pageData.couponDiscountLabel}</dt>
              <dd>-{formatPrice(order.couponDiscount)}</dd>
            </div>
          )}
          {order.pointDiscount > 0 && (
            <div className={`${SK}__price-row ${SK}__price-row--discount`}>
              <dt>{pageData.pointDiscountLabel}</dt>
              <dd>-{formatPrice(order.pointDiscount)}</dd>
            </div>
          )}
          {order.voucherDiscount > 0 && (
            <div className={`${SK}__price-row ${SK}__price-row--discount`}>
              <dt>상품권 할인</dt>
              <dd>-{formatPrice(order.voucherDiscount)}</dd>
            </div>
          )}
          <div className={`${SK}__price-row ${SK}__price-row--total`}>
            <dt>{pageData.totalAmountLabel}</dt>
            <dd>{formatPrice(order.totalAmount)}</dd>
          </div>
        </dl>
      </section>

      {/* 하단 액션 */}
      <div className={`${SK}__actions`}>
        {order.receiptUrl && (
          <a
            href={order.receiptUrl}
            className={`${SK}__action-btn ${SK}__action-btn--secondary`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={pageData.receiptAriaLabel}
          >
            {pageData.receiptLabel}
          </a>
        )}
        {!isRefund && (
          <button
            type="button"
            className={`${SK}__action-btn ${SK}__action-btn--outline`}
            aria-label={pageData.refundAriaLabel}
          >
            {pageData.refundLabel}
          </button>
        )}
      </div>
    </div>
  );
}
