/**
 * 환경 설정 (config/index.ts)
 * - API base URL, feature flag, 운영 옵션 등 환경별 설정을 모아두는 파일
 * - 고객사 커스터마이징 시 API 연동부 수정은 이 파일에서 관리한다
 */

interface OAuthProviderConfig {
  clientId: string;
  redirectUri: string;
}

interface Config {
  apiBase: string;
  backendBase: string;
  siteName: string;
  isProd: boolean;
  tossClientKey: string;
  oauth: {
    google: OAuthProviderConfig;
    kakao: OAuthProviderConfig;
  };
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const config: Config = {
  apiBase: process.env.NEXT_PUBLIC_API_BASE || '/api',
  backendBase: process.env.BACKEND_API_BASE || 'http://localhost:8080',
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || '강의 플랫폼',
  isProd: process.env.NODE_ENV === 'production',
  tossClientKey: process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || '',
  oauth: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${baseUrl}/auth/callback?provider=google`,
    },
    kakao: {
      clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '',
      redirectUri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI || `${baseUrl}/auth/callback?provider=kakao`,
    },
  },
};

export default config;
