# lecture_frontend 개선 체크리스트

> signal-web-code-front 대비 단점 개선 작업 목록 (우선순위순)

## 1. Custom Hook 패턴 도입
- [x] `hooks/` 폴더 생성
- [x] `useCourses.ts` — lib/data + useCourseStore 통합
- [x] `useCart.ts` — lib/payments + useCartStore + useCouponStore 통합
- [x] `usePlayer.ts` — lib/player + usePlayerStore 통합
- [x] `useAuth.ts` — lib/auth + useAuthStore 통합
- [x] `useCommunity.ts` — lib/data 커뮤니티 함수 + useCommunityStore 통합
- [x] `useUpload.ts` — lib/upload + useUploadStore 통합
- [x] `hooks/index.ts` — 일괄 re-export
- [ ] 기존 Container/페이지에서 Hook 사용으로 전환 (점진적)

## 2. 서버 사이드 프록시/보호 레이어
- [x] `lib/cookies.ts` — httpOnly 쿠키 유틸 + Safari SameSite/Secure 처리
- [x] `app/api/auth/login/route.ts` — 로그인 프록시 (httpOnly 쿠키 세팅)
- [x] `app/api/auth/refresh/route.ts` — 토큰 갱신
- [x] `app/api/auth/logout/route.ts` — 로그아웃 (쿠키 삭제)
- [x] `app/api/proxy/[...path]/route.ts` — 백엔드 catch-all 프록시
- [x] `app/api/streaming/session/route.ts` — HLS 세션 발급
- [x] `config/index.ts` — backendBase 환경변수 추가

## 3. Middleware (인증 가드)
- [x] `middleware.ts` 생성
- [x] 보호 경로 정의 (/learn, /account, /checkout, /cart)
- [x] 관리자 경로 가드 (/admin)
- [x] 미인증 시 /auth/login 리다이렉트 (callbackUrl 포함)

## 4. CSS Variables 동적 테마
- [x] SCSS 토큰을 CSS Custom Properties로 확장
- [x] `themes/_default.scss` — `:root`에 모든 토큰을 CSS 변수로 노출
- [x] `themes/_dark.scss` — `[data-theme='dark']` 다크 테마 추가
- [x] `main.scss`에 다크 테마 import 추가
- [x] `useTheme` Hook 구현 (localStorage + prefers-color-scheme 지원)
- [ ] 컴포넌트 SCSS에서 `var()` 사용으로 전환 (점진적)

## 5. Providers.tsx 강화
- [x] ThemeInitializer 추가 (localStorage + prefers-color-scheme → data-theme)
- [x] AuthInitializer 추가 (토큰 부재 시 자동 로그아웃)
- [ ] ToastProvider 추가 (Toast 스토어 구축 후)
- [x] app/layout.tsx에서 Providers 래핑 완료 (suppressHydrationWarning 포함)

## 6. Zustand 스토어 정리
- [x] `useMyPageStore` → 컴포넌트 미사용 확인, 삭제 대상 (점진적)
- [x] `useCouponStore` + `useCartStore` → 각각 독립 사용처 있어 유지, `useCart` Hook으로 통합 접근 제공
- [x] 9개 스토어 → Hook 레이어로 래핑 완료, 직접 접근 최소화

## 7. Next.js Image 최적화
- [x] `next.config.ts` 이미지 설정 (avif/webp, AWS/CloudFront 도메인)
- [ ] `<img>` → `<Image>` 전환 (점진적)
- [ ] alt 텍스트 data 기반 확인 (점진적)

## 8. 데이터 파일 분리 보완
- [x] 비대해진 JSON 파일 점검 → 전체 1,216줄, 최대 414줄(courses) — 현재 적정
- [x] 추가 분리 불필요 (현재 7개 JSON 구조 유지)
