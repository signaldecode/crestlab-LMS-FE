/**
 * 토스페이먼츠 SDK 래퍼 (toss.ts)
 * - 클라이언트 사이드 전용 (브라우저에서만 사용)
 * - SDK 초기화 및 결제 위젯 인스턴스 관리
 * - 시크릿 키는 백엔드 책임이며, 프론트는 클라이언트 키만 사용한다
 */

import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import type { TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import config from '@/config';

let widgetsInstance: TossPaymentsWidgets | null = null;
let currentCustomerKey: string | null = null;

/**
 * 토스페이먼츠 결제 위젯 인스턴스를 반환한다 (싱글턴)
 * - customerKey가 변경되면 새 인스턴스를 생성한다
 * - 동일한 customerKey로 호출 시 기존 인스턴스를 재사용한다
 */
export async function getTossWidgets(customerKey: string): Promise<TossPaymentsWidgets> {
  if (widgetsInstance && currentCustomerKey === customerKey) {
    return widgetsInstance;
  }

  const tossPayments = await loadTossPayments(config.tossClientKey);
  widgetsInstance = tossPayments.widgets({ customerKey });
  currentCustomerKey = customerKey;

  return widgetsInstance;
}

/** 위젯 인스턴스 초기화 (페이지 이탈·언마운트 시 호출) */
export function resetTossWidgets(): void {
  widgetsInstance = null;
  currentCustomerKey = null;
}
