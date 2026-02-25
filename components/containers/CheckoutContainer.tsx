/**
 * 결제 컨테이너 (CheckoutContainer)
 * - 결제 페이지의 메인 조립 레이어
 * - 주문 정보 확인, 쿠폰/상품권·포인트 적용, 결제 수단 선택, 최종 결제 버튼
 * - 2칸 레이아웃: 왼쪽 주문 정보 / 오른쪽 결제 요약
 * - 강의 정보만 스켈레톤, 나머지는 실제 UI
 */

'use client';

import { useState } from 'react';
import Skeleton from '@/components/ui/Skeleton';

type PaymentMethod = 'card' | 'kakao' | 'naver' | 'toss' | 'bank';

const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
  { key: 'card', label: '신용·체크카드' },
  { key: 'kakao', label: '카카오페이' },
  { key: 'naver', label: 'N Pay' },
  { key: 'toss', label: '토스페이' },
  { key: 'bank', label: '계좌이체' },
];

export default function CheckoutContainer() {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [couponOpen, setCouponOpen] = useState(false);
  const [voucherType, setVoucherType] = useState<'voucher' | 'point'>('voucher');
  const [voucherAmount, setVoucherAmount] = useState('0');
  const [pointAmount, setPointAmount] = useState('0');
  const [agreed, setAgreed] = useState(false);

  return (
    <section className="checkout-container">
      <h1 className="checkout-container__title">주문결제</h1>

      <div className="checkout-container__layout">
        {/* ── 왼쪽: 주문 정보 ── */}
        <div className="checkout-container__main">

          {/* 주문 강의 (스켈레톤) */}
          <div className="checkout-container__section">
            <div className="checkout-container__course-item">
              <Skeleton variant="rect" width={120} height={68} className="checkout-container__course-thumb" />
              <div className="checkout-container__course-info">
                <div className="checkout-container__course-badges">
                  <Skeleton variant="rect" width={32} height={20} />
                  <Skeleton variant="rect" width={42} height={20} />
                  <Skeleton variant="rect" width={52} height={20} />
                </div>
                <Skeleton variant="text" width="80%" height={18} />
                <Skeleton variant="text" width="30%" height={14} />
                <Skeleton variant="text" width={100} height={18} />
              </div>
            </div>
          </div>

          {/* 쿠폰 */}
          <div className="checkout-container__section">
            <div className="checkout-container__section-header">
              <h2 className="checkout-container__section-title">쿠폰</h2>
              <button
                type="button"
                className="checkout-container__coupon-link"
                onClick={() => setCouponOpen(!couponOpen)}
              >
                쿠폰코드 &gt;
              </button>
            </div>
            <div className="checkout-container__select-wrap">
              <select className="checkout-container__select" disabled>
                <option>사용가능한 쿠폰이 없어요</option>
              </select>
              <svg className="checkout-container__select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>

          {/* 상품권 · 포인트 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">
              상품권 · 포인트
              <span className="checkout-container__section-note">*둘 중 하나만 적용 가능</span>
            </h2>

            {/* 상품권 */}
            <div className="checkout-container__voucher-row">
              <label className="checkout-container__radio-label">
                <input
                  type="radio"
                  name="voucherType"
                  checked={voucherType === 'voucher'}
                  onChange={() => setVoucherType('voucher')}
                  className="checkout-container__radio"
                />
                <span className="checkout-container__radio-text">상품권</span>
                <span className="checkout-container__available">사용 가능 0</span>
              </label>
              <div className="checkout-container__input-row">
                <input
                  type="text"
                  className="checkout-container__input"
                  value={voucherAmount}
                  onChange={(e) => setVoucherAmount(e.target.value)}
                  disabled={voucherType !== 'voucher'}
                />
                <button
                  type="button"
                  className="checkout-container__apply-btn"
                  disabled={voucherType !== 'voucher'}
                >
                  전액 사용
                </button>
              </div>
            </div>

            {/* 포인트 */}
            <div className="checkout-container__voucher-row">
              <label className="checkout-container__radio-label">
                <input
                  type="radio"
                  name="voucherType"
                  checked={voucherType === 'point'}
                  onChange={() => setVoucherType('point')}
                  className="checkout-container__radio"
                />
                <span className="checkout-container__radio-text">포인트</span>
                <span className="checkout-container__available">사용 가능 0</span>
              </label>
              <div className="checkout-container__input-row">
                <input
                  type="text"
                  className="checkout-container__input"
                  value={pointAmount}
                  onChange={(e) => setPointAmount(e.target.value)}
                  disabled={voucherType !== 'point'}
                />
                <button
                  type="button"
                  className="checkout-container__apply-btn"
                  disabled={voucherType !== 'point'}
                >
                  전액 사용
                </button>
              </div>
            </div>

            <p className="checkout-container__point-note">
              *실 결제 금액의 50%까지 사용 가능
            </p>
          </div>

          {/* 결제 수단 */}
          <div className="checkout-container__section">
            <h2 className="checkout-container__section-title">결제 수단</h2>
            <div className="checkout-container__payment-methods">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.key}
                  type="button"
                  className={`checkout-container__payment-option${selectedMethod === method.key ? ' checkout-container__payment-option--active' : ''}`}
                  onClick={() => setSelectedMethod(method.key)}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 오른쪽: 결제 요약 ── */}
        <aside className="checkout-container__summary">
          <div className="checkout-container__summary-sticky">
            <h2 className="checkout-container__section-title">결제 금액</h2>

            <div className="checkout-container__summary-row">
              <span>총 클래스 금액</span>
              <Skeleton variant="text" width={90} height={16} />
            </div>
            <div className="checkout-container__summary-row">
              <span>쿠폰 사용</span>
              <span>0원</span>
            </div>
            <div className="checkout-container__summary-row">
              <span>상품권 사용</span>
              <span>0원</span>
            </div>
            <div className="checkout-container__summary-row">
              <span>포인트 사용</span>
              <span>0원</span>
            </div>

            <div className="checkout-container__summary-divider" />

            <div className="checkout-container__summary-row checkout-container__summary-row--total">
              <span>총 결제 금액</span>
              <Skeleton variant="text" width={110} height={24} />
            </div>

            <button
              type="button"
              className="checkout-container__pay-btn"
              disabled={!agreed}
            >
              결제하기
            </button>

            <label className="checkout-container__agree-label">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="checkout-container__agree-checkbox"
              />
              <span className="checkout-container__agree-text">
                강의 및 결제 정보를 확인하였으며, 수강정책 및 환불규정에 동의합니다.
              </span>
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}
