# 토스페이먼츠(TossPayments) 연동 계획서

## 1. 현재 프로젝트 상태 분석

### 1.1 구현 완료된 부분

| 항목 | 파일 | 상태 |
|------|------|------|
| 결제 페이지 UI | `components/containers/CheckoutContainer.tsx` | 기본 레이아웃 구현 (쿠폰/상품권/포인트/결제수단 UI) |
| 장바구니 스토어 | `stores/useCartStore.ts` | 아이템 추가/삭제/쿠폰코드 관리 |
| 쿠폰 스토어 | `stores/useCouponStore.ts` | localStorage 기반 쿠폰 발급/조회 |
| 장바구니 훅 | `hooks/useCart.ts` | 스토어 통합 + 금액 계산 |
| 금액 계산 유틸 | `lib/payments.ts` | calcSubtotal/calcDiscount/calcTotal/formatPrice |
| API 래퍼 | `lib/api.ts` | createOrder 함수 시그니처 존재 |
| 프록시 라우트 | `app/api/proxy/[...path]/route.ts` | 백엔드 중계 (토큰 자동 첨부) |
| 인증 시스템 | `lib/auth.ts` + `lib/cookies.ts` | httpOnly 쿠키 기반 토큰 관리 |
| 타입 정의 | `types/index.ts` | CartItem, Coupon, Order, OrderData 기본 타입 |
| 강의 데이터 | `data/coursesData.json` | 20개 강의 (price 필드 존재) |
| UI 문구 | `data/uiData.json` | 장바구니 토스트/빈 상태 메시지 |
| 페이지 SEO | `data/pagesData.json` | 장바구니 페이지 SEO만 존재 |

### 1.2 미구현 / 보완 필요 항목

| 항목 | 상태 | 비고 |
|------|------|------|
| CartContainer | 스켈레톤만 존재 | 아이템 목록/금액 요약/CTA 미구현 |
| OrderCompleteContainer | 스켈레톤만 존재 | 완료 메시지/주문 정보/CTA 미구현 |
| 실제 결제 API 호출 | 미구현 | CheckoutContainer에 결제 버튼만 있음 |
| 토스페이먼츠 SDK | 미도입 | 패키지 설치 + 초기화 필요 |
| 결제 승인 API 라우트 | 미생성 | `app/api/payments/confirm/route.ts` 필요 |
| 결제 실패/성공 페이지 | 미구현 | 토스 리다이렉트 후 처리 |
| components/payments/ | 폴더 미생성 | CouponSelect, PriceSummary 등 미분리 |
| checkout/order SEO 데이터 | 미등록 | pagesData.json에 추가 필요 |
| 결제 관련 UI 문구 | 하드코딩됨 | CheckoutContainer 내 문자열 → data 이동 필요 |
| 주문 상태 스토어 | 미구현 | 결제 진행 상태 관리 필요 |
| middleware 인증 가드 | 주석 처리됨 | /checkout, /cart 보호 활성화 필요 |

---

## 2. 토스페이먼츠 준비 사항

### 2.1 사전 준비 (비개발)

- [ ] **토스페이먼츠 가맹점 가입** — https://developers.tosspayments.com
- [ ] **클라이언트 키 발급** (테스트용 + 라이브용)
  - 테스트 키: `test_ck_...` / `test_sk_...`
  - 라이브 키: `live_ck_...` / `live_sk_...`
- [ ] **시크릿 키 발급** (백엔드 결제 승인용, 프론트 노출 금지)
- [ ] **결제 수단 설정** — 가맹점 관리자에서 사용할 결제수단 활성화
  - 신용/체크카드, 계좌이체, 가상계좌, 간편결제(토스페이, 카카오페이, 네이버페이 등)
- [ ] **Webhook URL 등록** — 결제 상태 변경 알림 수신용 (백엔드)
- [ ] **테스트 환경 확인** — 테스트 모드에서 결제 플로우 검증

### 2.2 환경 변수 추가

```env
# .env.local (프론트엔드)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_XXXXXXXXXXXXXXXX

# .env (백엔드 — Spring)
TOSS_SECRET_KEY=test_sk_XXXXXXXXXXXXXXXX
TOSS_CLIENT_KEY=test_ck_XXXXXXXXXXXXXXXX
```

> **주의**: 시크릿 키(`sk_...`)는 절대 프론트에 노출하지 않는다. `NEXT_PUBLIC_` 접두사 사용 금지.

### 2.3 패키지 설치

```bash
npm install @tosspayments/tosspayments-sdk
```

---

## 3. 토스페이먼츠 결제 흐름

### 3.1 전체 시퀀스

```
[사용자]                    [프론트(Next.js)]              [백엔드(Spring)]           [토스페이먼츠]
   │                              │                             │                         │
   │  1. 결제하기 클릭              │                             │                         │
   │─────────────────────────────>│                             │                         │
   │                              │  2. 주문 생성 요청             │                         │
   │                              │────────────────────────────>│                         │
   │                              │  3. orderId + amount 응답    │                         │
   │                              │<────────────────────────────│                         │
   │                              │                             │                         │
   │                              │  4. SDK requestPayment()    │                         │
   │                              │────────────────────────────────────────────────────>│
   │                              │                             │                         │
   │  5. 토스 결제창 (카드/간편결제)  │                             │                         │
   │<─────────────────────────────────────────────────────────────────────────────────│
   │  6. 결제 완료                 │                             │                         │
   │─────────────────────────────────────────────────────────────────────────────────>│
   │                              │                             │                         │
   │  7. successUrl 리다이렉트      │                             │                         │
   │  (?paymentKey&orderId&amount) │                             │                         │
   │─────────────────────────────>│                             │                         │
   │                              │  8. 결제 승인 요청             │                         │
   │                              │────────────────────────────>│                         │
   │                              │                             │  9. POST /confirm        │
   │                              │                             │────────────────────────>│
   │                              │                             │  10. 승인 결과            │
   │                              │                             │<────────────────────────│
   │                              │  11. 주문 확정 응답            │                         │
   │                              │<────────────────────────────│                         │
   │                              │                             │                         │
   │  12. /order/complete 이동     │                             │                         │
   │<─────────────────────────────│                             │                         │
```

### 3.2 핵심 포인트

1. **주문 생성 → 결제 요청 분리**: 결제 전에 백엔드에서 주문을 먼저 생성하고 `orderId`를 받는다
2. **결제 승인은 백엔드**: 프론트는 `paymentKey`만 전달, 시크릿 키로 승인하는 건 백엔드 책임
3. **금액 검증**: 백엔드에서 주문 생성 시 저장한 금액과 토스에서 돌아온 `amount`를 반드시 대조
4. **멱등성**: `orderId`는 고유해야 하며, 같은 주문에 대한 중복 결제를 방지

---

## 4. 구현 계획

### Phase 1: 기반 준비 (데이터 + 타입 + 환경)

#### 4.1 환경 변수 설정 — `config/index.ts`

```typescript
// 추가할 필드
interface Config {
  // ... 기존 필드
  tossClientKey: string;
}

const config: Config = {
  // ... 기존 값
  tossClientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '',
};
```

#### 4.2 타입 추가 — `types/index.ts`

```typescript
/* ── 토스페이먼츠 결제 ── */

/** 결제 수단 */
export type PaymentMethod = 'CARD' | 'TRANSFER' | 'VIRTUAL_ACCOUNT' | 'MOBILE_PHONE' | 'TOSSPAY' | 'KAKAOPAY' | 'NAVERPAY';

/** 주문 생성 요청 (프론트 → 백엔드) */
export interface CreateOrderRequest {
  courseSlugs: string[];
  couponId?: string;
  pointAmount?: number;
  voucherAmount?: number;
}

/** 주문 생성 응답 (백엔드 → 프론트) */
export interface CreateOrderResponse {
  orderId: string;
  orderName: string;
  totalAmount: number;
  customerEmail: string;
  customerName: string;
}

/** 결제 승인 요청 (프론트 → 백엔드) */
export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/** 결제 승인 응답 (백엔드 → 프론트) */
export interface ConfirmPaymentResponse {
  orderId: string;
  status: 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
  totalAmount: number;
  method: string;
  approvedAt: string;
  receipt?: { url: string };
  courseAccess: { courseSlug: string; expiresAt: string }[];
}

/** 결제 실패 정보 */
export interface PaymentFailure {
  code: string;
  message: string;
  orderId?: string;
}

/** 주문 상태 (확장) */
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELED' | 'REFUND_REQUESTED' | 'REFUNDED' | 'FAILED';
```

#### 4.3 data 확장 — `data/pagesData.json`

```json
{
  "checkout": {
    "seo": {
      "title": "주문결제 — 강의 플랫폼",
      "description": "선택하신 강의를 안전하게 결제하세요."
    },
    "title": "주문결제",
    "sections": {
      "orderInfo": "주문 강의",
      "coupon": "쿠폰",
      "couponCode": "쿠폰코드",
      "voucher": "상품권 · 포인트",
      "voucherLabel": "상품권",
      "pointLabel": "포인트",
      "voucherNotice": "상품권과 포인트 중 하나만 적용 가능합니다.",
      "availablePrefix": "사용 가능",
      "useAll": "전액 사용",
      "paymentMethod": "결제 수단",
      "agreementText": "강의 및 결제 정보를 확인하였으며, 구매 조건 및 환불 규정에 동의합니다."
    },
    "methods": {
      "card": "신용·체크카드",
      "kakaopay": "카카오페이",
      "naverpay": "N Pay",
      "tosspay": "토스페이",
      "transfer": "계좌이체"
    },
    "summary": {
      "coursePrice": "강의 금액",
      "couponDiscount": "쿠폰 할인",
      "pointDiscount": "포인트 사용",
      "voucherDiscount": "상품권 사용",
      "totalLabel": "최종 결제 금액",
      "submitLabel": "결제하기",
      "submitAriaLabel": "최종 결제 금액으로 결제 진행"
    },
    "errors": {
      "amountMismatch": "결제 금액이 일치하지 않습니다. 다시 시도해주세요.",
      "paymentFailed": "결제에 실패했습니다. 다시 시도해주세요.",
      "orderCreationFailed": "주문 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
      "networkError": "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.",
      "unauthorized": "로그인이 필요합니다."
    }
  },
  "orderComplete": {
    "seo": {
      "title": "결제 완료 — 강의 플랫폼",
      "description": "결제가 성공적으로 완료되었습니다."
    },
    "title": "결제가 완료되었습니다!",
    "subtitle": "수강 등록이 완료되었으며, 지금 바로 학습을 시작할 수 있습니다.",
    "orderIdLabel": "주문번호",
    "amountLabel": "결제 금액",
    "methodLabel": "결제 수단",
    "dateLabel": "결제 일시",
    "receiptLabel": "영수증 보기",
    "startLearningLabel": "학습 시작하기",
    "startLearningAriaLabel": "구매한 강의 학습 시작하기",
    "goHomeLabel": "홈으로 돌아가기",
    "goOrdersLabel": "주문 내역 보기"
  }
}
```

#### 4.4 data 확장 — `data/uiData.json`

```json
{
  "toast": {
    "paymentSuccess": "결제가 완료되었습니다!",
    "paymentFailed": "결제에 실패했습니다.",
    "orderCreated": "주문이 생성되었습니다."
  },
  "loading": {
    "payment": "결제를 처리하고 있습니다..."
  }
}
```

---

### Phase 2: 결제 인프라 구축

#### 4.5 토스페이먼츠 SDK 래퍼 — `lib/toss.ts` (신규)

```typescript
/**
 * 토스페이먼츠 SDK 초기화 및 결제 요청 래퍼
 * - 클라이언트 사이드 전용
 * - 시크릿 키 사용 없음 (백엔드 책임)
 */

import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import config from '@/config';

let widgetsInstance: TossPaymentsWidgets | null = null;

/** SDK 초기화 (싱글턴) */
export async function getTossWidgets(customerKey: string): Promise<TossPaymentsWidgets> {
  if (!widgetsInstance) {
    const tossPayments = await loadTossPayments(config.tossClientKey);
    widgetsInstance = tossPayments.widgets({ customerKey });
  }
  return widgetsInstance;
}

/** 위젯 인스턴스 초기화 (페이지 이탈 시) */
export function resetTossWidgets(): void {
  widgetsInstance = null;
}
```

#### 4.6 결제 API 함수 — `lib/api.ts` 확장

```typescript
// 기존 createOrder를 토스 연동에 맞게 수정

/** 주문 생성 (결제 전) */
export async function createOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
  return request<CreateOrderResponse>('/proxy/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** 결제 승인 (토스 리다이렉트 후) */
export async function confirmPayment(body: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
  return request<ConfirmPaymentResponse>('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
```

#### 4.7 결제 승인 API 라우트 — `app/api/payments/confirm/route.ts` (신규)

```typescript
/**
 * 결제 승인 프록시
 * 프론트에서 받은 paymentKey/orderId/amount를
 * 백엔드로 전달하여 토스페이먼츠 최종 승인을 수행한다.
 *
 * 시크릿 키는 백엔드에서만 사용한다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/lib/cookies';

const BACKEND_BASE = process.env.BACKEND_API_BASE || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();

  const res = await fetch(`${BACKEND_BASE}/api/payments/confirm`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

---

### Phase 3: UI 컴포넌트 구현

#### 4.8 결제 위젯 컴포넌트 — `components/payments/TossPaymentWidget.tsx` (신규)

역할: 토스페이먼츠 결제수단 위젯 렌더링 + 결제 요청 처리

```
Props:
  - orderId: string
  - orderName: string
  - amount: number
  - customerEmail: string
  - customerName: string
  - onSuccess: () => void
  - onFail: (error: PaymentFailure) => void
```

#### 4.9 결제 금액 요약 — `components/payments/PriceSummary.tsx` (신규)

역할: 강의 금액, 쿠폰 할인, 포인트/상품권 사용, 최종 금액 표시
- 모든 라벨은 pagesData.json의 `checkout.summary`에서 로드

#### 4.10 쿠폰 선택 — `components/payments/CouponSelect.tsx` (신규)

역할: 보유 쿠폰 목록 드롭다운 + 적용/해제
- 쿠폰 적용 시 할인 금액 실시간 계산

#### 4.11 결제 수단 선택 — `components/payments/PaymentMethodSelect.tsx` (신규)

역할: 결제수단 라디오 버튼 UI (현재 CheckoutContainer 내 하드코딩 → 분리)
- 결제수단 라벨은 pagesData.json의 `checkout.methods`에서 로드

#### 4.12 CheckoutContainer 리팩터링

```
현재: 모든 UI + 상태 + 하드코딩 문구가 한 파일에 존재
변경: 결제수단/쿠폰/금액요약을 하위 컴포넌트로 분리
     하드코딩 문구 → data에서 로드
     결제 실행 로직 추가 (createOrder → SDK requestPayment)
```

#### 4.13 CartContainer 구현

```
구현 내용:
  - 장바구니 아이템 목록 (썸네일/제목/강사/가격/삭제)
  - 전체 선택/해제
  - 금액 요약 (PriceSummary 재사용)
  - 결제하기 CTA → /checkout?slugs=slug1,slug2
  - 빈 장바구니 상태 (EmptyState)
  - 라벨은 pagesData.json의 cart 섹션에서 로드
```

#### 4.14 결제 완료 페이지

##### `app/(site)/order/complete/page.tsx` 수정

```
searchParams에서 orderId를 받아 주문 정보 조회
→ OrderCompleteContainer에 전달
```

##### `OrderCompleteContainer` 구현

```
구현 내용:
  - 성공 아이콘 + 타이틀/서브타이틀
  - 주문 정보 (주문번호/결제금액/결제수단/결제일시)
  - 영수증 링크 (토스 receipt URL)
  - CTA: 학습 시작하기 / 주문 내역 / 홈
  - 라벨은 pagesData.json의 orderComplete 섹션에서 로드
```

#### 4.15 결제 실패 페이지 — `app/(site)/order/fail/page.tsx` (신규)

```
역할: 토스 결제 실패 시 리다이렉트 도착점
searchParams: code, message, orderId
구현: 에러 메시지 표시 + 다시 시도 CTA
```

---

### Phase 4: 결제 성공/실패 라우트 처리

#### 4.16 성공 처리 — `app/(site)/checkout/success/page.tsx` (신규)

```
역할: 토스 리다이렉트 successUrl 도착점
흐름:
  1. searchParams에서 paymentKey, orderId, amount 추출
  2. confirmPayment API 호출 (백엔드 → 토스 승인)
  3. 성공 시 /order/complete?orderId=xxx 리다이렉트
  4. 실패 시 에러 표시 + 재시도 안내
UI: 로딩 스피너 + "결제를 처리하고 있습니다..." 메시지
```

#### 4.17 실패 처리 — `app/(site)/checkout/fail/page.tsx` (신규)

```
역할: 토스 리다이렉트 failUrl 도착점
흐름:
  1. searchParams에서 code, message, orderId 추출
  2. 에러 메시지 표시
  3. 다시 결제하기 / 장바구니로 돌아가기 CTA
```

---

### Phase 5: 상태 관리 확장

#### 4.18 주문/결제 스토어 — `stores/useOrderStore.ts` (신규)

```typescript
interface OrderState {
  /** 현재 진행 중인 주문 */
  pendingOrder: CreateOrderResponse | null;
  /** 결제 완료된 주문 */
  completedOrder: ConfirmPaymentResponse | null;
  /** 결제 진행 상태 */
  paymentStatus: 'idle' | 'creating' | 'paying' | 'confirming' | 'done' | 'failed';
  /** 에러 */
  error: PaymentFailure | null;

  setPendingOrder(order: CreateOrderResponse | null): void;
  setCompletedOrder(order: ConfirmPaymentResponse | null): void;
  setPaymentStatus(status: OrderState['paymentStatus']): void;
  setError(error: PaymentFailure | null): void;
  reset(): void;
}
```

#### 4.19 useCartStore 확장

```typescript
// 추가할 필드/메서드
interface CartState {
  // ... 기존
  selectedSlugs: string[];        // 선택된 아이템 (다건 결제)
  toggleSelect(slug: string): void;
  selectAll(): void;
  deselectAll(): void;
  getSelectedItems(): CartItem[];
}
```

---

### Phase 6: 백엔드 API 계약 (Spring 측 필요 엔드포인트)

> 프론트 구현과 병행하여 백엔드에 요청해야 할 API 목록

#### 6.1 주문 생성

```
POST /api/orders
Authorization: Bearer {accessToken}

Request:
{
  "courseSlugs": ["real-estate-intermediate"],
  "couponId": "cpn-001",           // 선택
  "pointAmount": 5000,             // 선택
  "voucherAmount": 0               // 선택
}

Response (200):
{
  "orderId": "ORD-20260317-001",
  "orderName": "열반스쿨 중급반",
  "totalAmount": 344000,
  "customerEmail": "user@example.com",
  "customerName": "홍길동"
}

Errors:
  400: 잘못된 요청 (유효하지 않은 slug, 쿠폰 등)
  401: 인증 필요
  409: 이미 구매한 강의
```

#### 6.2 결제 승인

```
POST /api/payments/confirm
Authorization: Bearer {accessToken}

Request:
{
  "paymentKey": "tgen_...",
  "orderId": "ORD-20260317-001",
  "amount": 344000
}

Response (200):
{
  "orderId": "ORD-20260317-001",
  "status": "DONE",
  "totalAmount": 344000,
  "method": "카드",
  "approvedAt": "2026-03-17T14:30:00+09:00",
  "receipt": { "url": "https://..." },
  "courseAccess": [
    { "courseSlug": "real-estate-intermediate", "expiresAt": "2099-12-31" }
  ]
}

Errors:
  400: 금액 불일치 / 이미 처리된 주문
  401: 인증 필요
  500: 토스 승인 실패 (code, message 전달)
```

#### 6.3 주문 상세 조회

```
GET /api/orders/{orderId}
Authorization: Bearer {accessToken}

Response (200):
{
  "orderId": "ORD-20260317-001",
  "status": "PAID",
  "totalAmount": 344000,
  "method": "카드",
  "courseSlugs": ["real-estate-intermediate"],
  "couponDiscount": 5000,
  "pointUsed": 0,
  "approvedAt": "2026-03-17T14:30:00+09:00",
  "receipt": { "url": "https://..." }
}
```

#### 6.4 결제 취소/환불

```
POST /api/orders/{orderId}/cancel
Authorization: Bearer {accessToken}

Request:
{
  "cancelReason": "단순 변심"
}

Response (200):
{
  "orderId": "ORD-20260317-001",
  "status": "CANCELED",
  "cancelAmount": 344000,
  "canceledAt": "2026-03-17T15:00:00+09:00"
}
```

---

## 5. 파일 생성/수정 목록

### 신규 생성

| 파일 | 역할 |
|------|------|
| `lib/toss.ts` | 토스페이먼츠 SDK 초기화 래퍼 |
| `app/api/payments/confirm/route.ts` | 결제 승인 프록시 API |
| `app/(site)/checkout/success/page.tsx` | 결제 성공 리다이렉트 처리 |
| `app/(site)/checkout/fail/page.tsx` | 결제 실패 리다이렉트 처리 |
| `components/payments/TossPaymentWidget.tsx` | 토스 결제 위젯 |
| `components/payments/PriceSummary.tsx` | 결제 금액 요약 |
| `components/payments/CouponSelect.tsx` | 쿠폰 선택 드롭다운 |
| `components/payments/PaymentMethodSelect.tsx` | 결제수단 선택 |
| `stores/useOrderStore.ts` | 주문/결제 상태 관리 |
| `assets/styles/components/_checkout-success.scss` | 성공/실패 페이지 스타일 |

### 수정

| 파일 | 변경 내용 |
|------|-----------|
| `config/index.ts` | `tossClientKey` 필드 추가 |
| `types/index.ts` | 결제 관련 타입 추가 (Phase 1 참조) |
| `data/pagesData.json` | checkout, orderComplete 섹션 추가 |
| `data/uiData.json` | 결제 관련 토스트/로딩 문구 추가 |
| `lib/api.ts` | createOrder, confirmPayment 함수 추가 |
| `lib/payments.ts` | orderId 생성 유틸, 금액 검증 함수 추가 |
| `stores/useCartStore.ts` | selectedSlugs, 선택 액션 추가 |
| `components/containers/CheckoutContainer.tsx` | 하드코딩 제거, 하위 컴포넌트 분리, 결제 로직 추가 |
| `components/containers/CartContainer.tsx` | 장바구니 UI 완성 구현 |
| `components/containers/OrderCompleteContainer.tsx` | 결제 완료 UI 구현 |
| `app/(site)/checkout/page.tsx` | 다건 결제 지원 (slugs 파라미터) |
| `app/(site)/order/complete/page.tsx` | orderId로 주문 정보 조회 |
| `middleware.ts` | /checkout, /cart 인증 가드 활성화 |
| `assets/styles/components/_checkout-page.scss` | 결제 위젯 스타일 추가 |
| `hooks/index.ts` | useOrder 훅 re-export 추가 (필요 시) |

---

## 6. 구현 순서 (권장)

```
Phase 1  기반 준비
 ├─ 4.1  config 환경 변수
 ├─ 4.2  types 타입 정의
 ├─ 4.3  pagesData.json 확장
 └─ 4.4  uiData.json 확장

Phase 2  결제 인프라
 ├─ 4.5  lib/toss.ts (SDK 래퍼)
 ├─ 4.6  lib/api.ts (API 함수 추가)
 └─ 4.7  app/api/payments/confirm (승인 프록시)

Phase 3  UI 컴포넌트
 ├─ 4.8  TossPaymentWidget
 ├─ 4.9  PriceSummary
 ├─ 4.10 CouponSelect
 ├─ 4.11 PaymentMethodSelect
 ├─ 4.12 CheckoutContainer 리팩터링
 ├─ 4.13 CartContainer 구현
 ├─ 4.14 OrderCompleteContainer 구현
 └─ 4.15 결제 실패 페이지

Phase 4  라우트 처리
 ├─ 4.16 checkout/success 페이지
 └─ 4.17 checkout/fail 페이지

Phase 5  상태 관리
 ├─ 4.18 useOrderStore
 └─ 4.19 useCartStore 확장

Phase 6  백엔드 API 요청 및 통합 테스트
```

---

## 7. 보안 체크리스트

- [ ] 시크릿 키(`sk_...`)가 프론트 코드에 절대 포함되지 않는지 확인
- [ ] `NEXT_PUBLIC_` 환경 변수에 시크릿 키가 없는지 확인
- [ ] 결제 승인 시 금액 검증을 백엔드에서 수행하는지 확인
- [ ] orderId가 예측 불가능한 형식인지 확인 (UUID 또는 서버 생성)
- [ ] 콘솔에 결제 관련 민감 정보(paymentKey 등) 로그가 없는지 확인
- [ ] CSRF 방어: 결제 승인 API에 인증 토큰 필수 적용
- [ ] 결제 완료 후 장바구니 비우기 (이중 결제 방지)
- [ ] 토스 Webhook으로 결제 상태 동기화 (백엔드)

---

## 8. 테스트 계획

### 프론트 테스트 시나리오

| # | 시나리오 | 예상 결과 |
|---|---------|-----------|
| 1 | 단일 강의 결제 (카드) | 토스 결제창 → 승인 → 완료 페이지 |
| 2 | 다건 강의 결제 | 합산 금액으로 결제 → 모든 강의 수강 등록 |
| 3 | 쿠폰 적용 후 결제 | 할인된 금액으로 결제 요청 |
| 4 | 결제 취소 (사용자) | 토스 결제창에서 취소 → fail 페이지 |
| 5 | 결제 실패 (카드 한도) | fail 페이지 → 에러 메시지 표시 |
| 6 | 결제 중 네트워크 오류 | 에러 처리 + 재시도 안내 |
| 7 | 이미 구매한 강의 | 주문 생성 시 409 → 안내 메시지 |
| 8 | 비로그인 상태 결제 | 로그인 페이지 리다이렉트 |
| 9 | 0원 결제 (쿠폰 100%) | 토스 SDK 없이 직접 주문 확정 |
| 10 | 모바일 결제 | 앱 전환 → 결제 → 리다이렉트 복귀 |

### 토스 테스트 카드

```
카드번호: 4330000000000014 (테스트 승인용)
유효기간: 미래 아무 날짜
CVC: 아무 3자리
비밀번호: 아무 2자리
```

---

## 9. 참고 링크

- 토스페이먼츠 개발자 문서: https://docs.tosspayments.com
- 결제 위젯 연동 가이드: https://docs.tosspayments.com/guides/v2/payment-widget/integration
- API 레퍼런스: https://docs.tosspayments.com/reference
- 테스트 가이드: https://docs.tosspayments.com/guides/v2/test-code
- 에러 코드 목록: https://docs.tosspayments.com/reference/error-codes
