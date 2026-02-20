/**
 * 인증 유틸 (auth.js)
 * - 토큰 저장/삭제/조회, 쿠키 관리, 인증 상태 확인 등 헬퍼 함수를 제공한다
 * - useAuthStore와 함께 사용하여 클라이언트 인증 흐름을 처리한다
 */

const TOKEN_KEY = 'auth_token';

/** 토큰 저장 (localStorage) */
export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // localStorage 미지원/용량 초과 예외 처리
  }
}

/** 토큰 조회 */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** 토큰 삭제 (로그아웃 시) */
export function removeToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // 예외 처리
  }
}

/** 로그인 여부 확인 */
export function isAuthenticated() {
  return !!getToken();
}

/** Authorization 헤더 생성 */
export function getAuthHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
