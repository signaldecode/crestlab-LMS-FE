/**
 * 환경 설정 (config/index.js)
 * - API base URL, feature flag, 운영 옵션 등 환경별 설정을 모아두는 파일
 * - 고객사 커스터마이징 시 API 연동부 수정은 이 파일에서 관리한다
 */

const config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE || '/api',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '강의 플랫폼',
  isProd: process.env.NODE_ENV === 'production',
};

export default config;
