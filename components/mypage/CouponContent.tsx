/**
 * 쿠폰 콘텐츠 (CouponContent)
 * - /mypage 쿠폰 섹션에서 사용
 * - 쿠폰 등록, 보유중인/사용완료 쿠폰 탭, 티켓 스타일 카드 그리드, 페이지네이션
 */

'use client';

import type { JSX } from 'react';
import { useState, useMemo } from 'react';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchMyCoupons, registerCouponCode, UserApiError, type UserCoupon } from '@/lib/userApi';
import accountData from '@/data/accountData.json';

const pageData = accountData.mypage.couponsPage;
const SK = 'mypage-coupon';
const PER_PAGE = pageData.perPage ?? 8;

export default function CouponContent(): JSX.Element {
  const { data, loading, error, refetch } = useAdminQuery(fetchMyCoupons, []);
  const allCoupons = data ?? [];

  const [registerError, setRegisterError] = useState('');
  const [registerOk, setRegisterOk] = useState('');
  const registerMutation = useAdminMutation(
    (code: string) => registerCouponCode(code),
    () => {
      setRegisterOk('쿠폰이 등록되었습니다.');
      setRegisterError('');
      setCouponCode('');
      void refetch();
    },
  );
  const now = Date.now();
  const activeCoupons = allCoupons.filter((c) => !c.isUsed && new Date(c.expiresAt).getTime() > now);
  const expiredCoupons = allCoupons.filter((c) => c.isUsed || new Date(c.expiresAt).getTime() <= now);

  const [couponCode, setCouponCode] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'used'>('active');
  const [currentPage, setCurrentPage] = useState(1);

  /* 탭 전환 시 페이지 리셋 */
  const handleTabChange = (tab: 'active' | 'used') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  /* 현재 탭의 쿠폰 목록 */
  const currentList = activeTab === 'active' ? activeCoupons : expiredCoupons;
  const totalPages = Math.max(1, Math.ceil(currentList.length / PER_PAGE));
  const pagedList = useMemo(
    () => currentList.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE),
    [currentList, currentPage],
  );

  /* 페이지 번호 목록 생성 */
  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <div className={SK}>
      {/* ── 쿠폰 등록 ── */}
      <section className={`${SK}__register-section`}>
        <h2 className={`${SK}__section-title`}>{pageData.registerTitle}</h2>
        <div className={`${SK}__register-row`}>
          <input
            type="text"
            className={`${SK}__register-input`}
            placeholder={pageData.registerPlaceholder}
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            aria-label={pageData.registerPlaceholder}
          />
          <button
            type="button"
            className={`${SK}__register-btn`}
            disabled={!couponCode.trim() || registerMutation.submitting}
            onClick={async () => {
              setRegisterOk('');
              setRegisterError('');
              const result = await registerMutation.run(couponCode.trim());
              if (!result && registerMutation.error) {
                const err = registerMutation.error;
                setRegisterError(err instanceof UserApiError ? err.message : '쿠폰 등록에 실패했습니다.');
              }
            }}
          >
            {pageData.registerButton}
          </button>
        </div>
        {registerOk && <p className={`${SK}__register-success`} role="status">{registerOk}</p>}
        {registerError && <p className={`${SK}__register-error`} role="alert">{registerError}</p>}
        <p className={`${SK}__register-note`}>{pageData.registerNote}</p>
      </section>

      <hr className={`${SK}__divider`} />

      {/* ── 쿠폰 리스트 ── */}
      <section className={`${SK}__list-section`}>
        <h2 className={`${SK}__section-title`}>{pageData.listTitle}</h2>

        {/* 탭 */}
        <div className={`${SK}__tabs`} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'active'}
            className={`${SK}__tab ${activeTab === 'active' ? `${SK}__tab--active` : ''}`}
            onClick={() => handleTabChange('active')}
          >
            {pageData.tabActive}
            <span className={`${SK}__tab-count`}>{activeCoupons.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'used'}
            className={`${SK}__tab ${activeTab === 'used' ? `${SK}__tab--active` : ''}`}
            onClick={() => handleTabChange('used')}
          >
            {pageData.tabUsed}
            <span className={`${SK}__tab-count`}>{expiredCoupons.length}</span>
          </button>
        </div>

        {/* 카드 그리드 */}
        {loading && !data ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>불러오는 중…</p>
          </div>
        ) : error && !data ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{error.message}</p>
          </div>
        ) : pagedList.length > 0 ? (
          <div className={`${SK}__grid`}>
            {pagedList.map((coupon) => (
              <CouponCard
                key={coupon.userCouponId}
                coupon={coupon}
                isExpired={activeTab === 'used'}
              />
            ))}
          </div>
        ) : (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>
              {activeTab === 'active' ? pageData.emptyText : pageData.emptyUsedText}
            </p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className={`${SK}__pagination`} aria-label="쿠폰 페이지 탐색">
            <button
              type="button"
              className={`${SK}__page-btn ${SK}__page-btn--arrow`}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label={pageData.paginationPrev}
            >
              <ChevronLeft />
            </button>

            {pageNumbers.map((item, idx) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${idx}`} className={`${SK}__page-ellipsis`}>
                  &hellip;
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`${SK}__page-btn ${currentPage === item ? `${SK}__page-btn--active` : ''}`}
                  onClick={() => setCurrentPage(item)}
                  aria-current={currentPage === item ? 'page' : undefined}
                >
                  {item}
                </button>
              ),
            )}

            <button
              type="button"
              className={`${SK}__page-btn ${SK}__page-btn--arrow`}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label={pageData.paginationNext}
            >
              <ChevronRight />
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}

/* ── 쿠폰 카드 ── */
interface CouponCardProps {
  coupon: UserCoupon;
  isExpired: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function CouponCard({ coupon, isExpired }: CouponCardProps) {
  return (
    <div className={`${SK}__card ${isExpired ? `${SK}__card--expired` : ''}`}>
      <div className={`${SK}__card-body`}>
        <span className={`${SK}__card-discount`}>{coupon.discountInfo}</span>
        <p className={`${SK}__card-name`}>{coupon.couponName}</p>
        <span className={`${SK}__card-date`}>
          ~ {formatDate(coupon.expiresAt)}
        </span>
      </div>
      <div className={`${SK}__card-ticket`}>
        <div className={`${SK}__card-ticket-lines`} aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`${SK}__card-ticket-line`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SVG 아이콘 ── */
function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
