/**
 * API fetch 래퍼 (api.ts)
 * - 백엔드(Spring REST) API 호출을 위한 공통 fetch 래퍼
 * - base URL, 인증 헤더, 에러 처리 등을 일관되게 관리한다
 * - 엔드포인트별 함수를 제공하여 컴포넌트에서 직접 fetch하지 않도록 한다
 */

import type {
  Course,
  Order,
  CreateOrderRequest,
  CreateOrderResponse,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

/** 공통 fetch 래퍼 */
async function request<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

/** 강의 목록 조회 */
export function fetchCourses(params: Record<string, string> = {}): Promise<Course[]> {
  const query = new URLSearchParams(params).toString();
  return request<Course[]>(`/courses${query ? `?${query}` : ''}`);
}

/** 강의 상세 조회 (slug) */
export function fetchCourseBySlug(slug: string): Promise<Course> {
  return request<Course>(`/courses/${slug}`);
}

/** 내 수강 목록 조회 */
export function fetchMyCourses(): Promise<Course[]> {
  return request<Course[]>('/me/courses');
}

/**
 * 개발용 mock 모드 여부
 * - 백엔드 미구현 시 NEXT_PUBLIC_MOCK_PAYMENT=true로 설정하면
 *   createOrder / confirmPayment가 mock 응답을 반환한다
 * - 백엔드 연동 시 해당 환경변수를 제거하면 실제 API를 호출한다
 */
const MOCK_PAYMENT = process.env.NEXT_PUBLIC_MOCK_PAYMENT === 'true';

/** 주문 생성 (결제 전 — 백엔드에서 orderId 발급) */
export async function createOrder(body: CreateOrderRequest): Promise<CreateOrderResponse> {
  if (MOCK_PAYMENT) {
    const orderId = `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return {
      orderId,
      orderName: body.courseSlugs.join(', '),
      totalAmount: 100,
      customerEmail: 'test@example.com',
      customerName: '테스트 사용자',
    };
  }

  return request<CreateOrderResponse>('/proxy/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** 결제 승인 (토스 리다이렉트 후 — 백엔드에서 토스 최종 승인) */
export async function confirmPayment(body: ConfirmPaymentRequest): Promise<ConfirmPaymentResponse> {
  if (MOCK_PAYMENT) {
    return {
      orderId: body.orderId,
      status: 'DONE',
      totalAmount: body.amount,
      method: '카드',
      approvedAt: new Date().toISOString(),
      receipt: undefined,
      courseAccess: [],
    };
  }

  return request<ConfirmPaymentResponse>('/api/payments/confirm', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** 내 주문 내역 조회 */
export function fetchMyOrders(params: Record<string, string> = {}): Promise<Order[]> {
  const query = new URLSearchParams(params).toString();
  return request<Order[]>(`/me/orders${query ? `?${query}` : ''}`);
}
