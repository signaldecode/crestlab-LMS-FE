/**
 * 토스페이먼츠 SDK 래퍼 (toss.ts)
 * - 클라이언트 사이드 전용 (브라우저에서만 사용)
 * - API 개별 연동 키 사용 시 payment() 방식으로 결제창을 직접 띄운다
 * - 시크릿 키는 백엔드 책임이며, 프론트는 클라이언트 키만 사용한다
 */

import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import type { TossPaymentsPayment } from '@tosspayments/tosspayments-sdk';
import config from '@/config';

let paymentInstance: TossPaymentsPayment | null = null;
let currentCustomerKey: string | null = null;

/** 비로그인 사용자용 익명 키 */
export const TOSS_ANONYMOUS = ANONYMOUS;

/**
 * 토스페이먼츠 결제창 인스턴스를 반환한다 (싱글턴)
 * - API 개별 연동 키(test_ck_...) 전용
 * - customerKey가 변경되면 새 인스턴스를 생성한다
 */
export async function getTossPayment(customerKey: string): Promise<TossPaymentsPayment> {
  if (paymentInstance && currentCustomerKey === customerKey) {
    return paymentInstance;
  }

  if (!config.tossClientKey) {
    throw new Error('토스 클라이언트 키가 설정되지 않았습니다. .env.local의 NEXT_PUBLIC_TOSS_CLIENT_KEY를 확인하세요.');
  }

  const tossPayments = await loadTossPayments(config.tossClientKey);
  paymentInstance = tossPayments.payment({ customerKey });
  currentCustomerKey = customerKey;

  return paymentInstance;
}

/** 인스턴스 초기화 (페이지 이탈·언마운트 시 호출) */
export function resetTossPayment(): void {
  paymentInstance = null;
  currentCustomerKey = null;
}
