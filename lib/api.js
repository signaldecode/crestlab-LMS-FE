/**
 * API fetch 래퍼 (api.js) — 선택 사항
 * - 백엔드(Spring REST) API 호출을 위한 공통 fetch 래퍼
 * - base URL, 인증 헤더, 에러 처리 등을 일관되게 관리한다
 * - 엔드포인트별 함수를 제공하여 컴포넌트에서 직접 fetch하지 않도록 한다
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

/** 공통 fetch 래퍼 */
async function request(endpoint, options = {}) {
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
export function fetchCourses(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/courses${query ? `?${query}` : ''}`);
}

/** 강의 상세 조회 (slug) */
export function fetchCourseBySlug(slug) {
  return request(`/courses/${slug}`);
}

/** 내 수강 목록 조회 */
export function fetchMyCourses() {
  return request('/me/courses');
}

/** 주문 생성 */
export function createOrder(body) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** 내 주문 내역 조회 */
export function fetchMyOrders(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/me/orders${query ? `?${query}` : ''}`);
}
