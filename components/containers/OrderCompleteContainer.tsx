/**
 * 결제 완료 컨테이너 (OrderCompleteContainer)
 * - 결제 성공 후 보여주는 완료 화면 조립 레이어
 * - 주문 번호, 결제 금액, 수강 시작 CTA 등을 구성한다
 */

import type { JSX } from 'react';

export default function OrderCompleteContainer(): JSX.Element {
  return (
    <section className="order-complete-container">
      {/* 결제 완료 메시지 + 주문 정보 + 수강 시작 CTA가 렌더링된다 */}
    </section>
  );
}
