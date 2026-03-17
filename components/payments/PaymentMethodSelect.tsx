/**
 * 결제수단 선택 (PaymentMethodSelect)
 * - 결제수단 버튼 목록을 렌더링하고 선택 상태를 관리한다
 * - 라벨은 data에서 로드한다
 */

'use client';

import { getPageData } from '@/lib/data';

export type PaymentMethodKey = 'card' | 'kakaopay' | 'naverpay' | 'tosspay' | 'transfer';

const METHOD_KEYS: PaymentMethodKey[] = ['card', 'kakaopay', 'naverpay', 'tosspay', 'transfer'];

interface PaymentMethodSelectProps {
  selected: PaymentMethodKey;
  onSelect: (method: PaymentMethodKey) => void;
}

export default function PaymentMethodSelect({
  selected,
  onSelect,
}: PaymentMethodSelectProps) {
  const pageData = getPageData('checkout') as Record<string, Record<string, string>> | null;
  const sections = pageData?.sections ?? {};
  const methods = pageData?.methods ?? {};

  const fallbackLabels: Record<PaymentMethodKey, string> = {
    card: '신용·체크카드',
    kakaopay: '카카오페이',
    naverpay: 'N Pay',
    tosspay: '토스페이',
    transfer: '계좌이체',
  };

  return (
    <div className="checkout-container__section">
      <h2 className="checkout-container__section-title">
        {sections.paymentMethod ?? '결제 수단'}
      </h2>
      <div className="checkout-container__payment-methods">
        {METHOD_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={`checkout-container__payment-option${
              selected === key ? ' checkout-container__payment-option--active' : ''
            }`}
            onClick={() => onSelect(key)}
            aria-pressed={selected === key}
          >
            {methods[key] ?? fallbackLabels[key]}
          </button>
        ))}
      </div>
    </div>
  );
}
