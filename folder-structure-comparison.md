# lecture_frontend vs signal-web-code-front 폴더 구조 비교

## 1. 기본 정보

| 항목 | lecture_frontend | signal-web-code-front |
|------|-----------------|----------------------|
| **프레임워크** | Next.js 16 (App Router) | Nuxt 4.2 (Vue 3) |
| **UI 라이브러리** | React 19 + TSX | Vue 3 + SFC (.vue) |
| **언어** | TypeScript (strict) | JavaScript (일부 TS) |
| **상태관리** | Zustand (9개 스토어) | Pinia (2개 스토어) + Composables |
| **스타일** | SCSS + Token System | SCSS + Token System + CSS Variables 테마 |
| **패키지매니저** | npm | pnpm |
| **도메인** | 강의 플랫폼 | 이커머스 (쇼핑몰) |
| **배포** | - | AWS Amplify |

---

## 2. 폴더 구조 비교

### lecture_frontend

```
project/
├── app/                          # Next.js App Router
│   ├── (site)/                   # 공개 Route Group
│   ├── (admin)/                  # 관리자 Route Group
│   ├── api/                      # Route Handlers
│   └── providers.tsx
├── components/                   # 116개 컴포넌트 (프로젝트 루트)
│   ├── common/
│   ├── layout/
│   ├── ui/
│   ├── containers/
│   ├── courses/
│   ├── community/
│   ├── mypage/
│   ├── home/
│   ├── auth/
│   └── admin/
├── data/                         # 8개 JSON + index.ts (프로젝트 루트)
├── assets/styles/                # SCSS (프로젝트 루트)
├── lib/                          # 유틸리티 함수
├── stores/                       # Zustand 스토어
├── types/                        # 중앙 타입 정의
└── config/
```

### signal-web-code-front

```
project/
├── app/                          # Nuxt 앱 디렉토리 (모든 것이 app/ 안에)
│   ├── pages/                    # 파일 기반 라우팅 (42개)
│   ├── layouts/                  # 레이아웃 (2개)
│   ├── components/               # 108개 컴포넌트 (app 내부)
│   │   ├── ui/
│   │   ├── layout/
│   │   └── domain/
│   ├── composables/              # 30개 Composable (Vue 핵심 패턴)
│   ├── stores/                   # Pinia (2개)
│   ├── data/                     # 28개 JSON (app 내부)
│   ├── assets/styles/            # SCSS (app 내부)
│   ├── plugins/                  # Nuxt 플러그인 (4개)
│   ├── middleware/               # 라우트 미들웨어
│   └── utils/                    # 유틸리티 (2개)
├── server/                       # 서버 핸들러 (API 프록시, 내부 엔드포인트)
└── public/
```

---

## 3. 핵심 차이점 분석

### 3.1 컴포넌트 분류 체계

| 구분 | lecture_frontend | signal-web-code-front |
|------|-----------------|----------------------|
| **분류 방식** | 역할별 5단계 (common → layout → ui → containers → 도메인) | 3단계 (ui → layout → domain) |
| **Container 패턴** | 별도 containers/ 폴더로 비즈니스 로직 분리 | 없음 (composable이 대체) |
| **도메인 폴더** | courses/, community/, mypage/, home/ 등 세분화 | domain/ 하나에 통합 |

### 3.2 비즈니스 로직 위치

| 구분 | lecture_frontend | signal-web-code-front |
|------|-----------------|----------------------|
| **패턴** | Container 컴포넌트 + lib/ 함수 | Composables (30개) |
| **API 래퍼** | lib/api.ts (fetch wrapper) | composables/useApi.js (get/post/put/patch/del) |
| **데이터 접근** | lib/data.ts (getCourses, findBySlug 등) | composables별 fetch (useProducts, useCart 등) |
| **인증** | lib/auth.ts + useAuthStore | plugins + useAuthStore + server 핸들러 |

### 3.3 데이터 관리

| 구분 | lecture_frontend | signal-web-code-front |
|------|-----------------|----------------------|
| **파일 수** | 8개 JSON + index.ts 통합 | 28개 JSON (페이지별 1:1 매핑) |
| **구조** | 도메인별 분리 (site, ui, courses, home 등) | 페이지별 분리 (login.json, cart.json, order.json 등) |
| **타입 안전성** | TypeScript MainData 인터페이스로 통합 | 타입 없음 (JS import) |
| **통합 방식** | index.ts에서 모든 JSON을 MainData로 조합 | 각 컴포넌트에서 직접 import |

### 3.4 라우팅

| 구분 | lecture_frontend | signal-web-code-front |
|------|-----------------|----------------------|
| **방식** | App Router (폴더 = URL) | Pages 디렉토리 (파일 = URL) |
| **Route Group** | (site), (admin) 으로 레이아웃 분리 | layouts/default, layouts/mypage |
| **식별자** | slug 기반 (/courses/[slug]) | id 기반 (/products/[id]) |
| **SEO** | Metadata API + JSON-LD | useSeoMeta + useHead |

### 3.5 서버 사이드

| 구분 | lecture_frontend | signal-web-code-front |
|------|-----------------|----------------------|
| **API 프록시** | app/api/ Route Handler | server/api/[...].js catch-all 프록시 |
| **내부 API** | 없음 | server/api/_internal/ (로그인, 유저 조회 등) |
| **쿠키 처리** | - | Safari 쿠키 이슈 해결 (Secure/SameSite 변환) |
| **SSR 데이터** | - | plugins에서 서버사이드 데이터 초기화 |

---

## 4. lecture_frontend 장점

### 강점

1. **TypeScript 엄격 모드**
   - 중앙 `types/index.ts`에서 모든 도메인 타입 정의
   - `MainData` 인터페이스로 데이터 구조 컴파일 타임 검증
   - signal은 JavaScript 기반이라 런타임에서만 오류 발견 가능

2. **Container 패턴으로 관심사 분리가 명확**
   - UI 컴포넌트는 순수 렌더링만 담당
   - Container가 데이터 페칭 + 상태 관리 + UI 조합을 담당
   - 테스트와 재사용이 용이한 구조

3. **SEO/AEO/GEO/A11y 1등 시민 설계**
   - JSON-LD (FAQPage, Course, BreadcrumbList, Organization) 내장
   - GEO 데이터 (좌표, 주소, 영업시간) 구조화
   - AEO용 한 문장 요약(summary) 필드 설계
   - signal은 기본 SEO만 지원 (useSeoMeta)

4. **slug 기반 라우팅**
   - `/courses/react-masterclass` vs `/products/123`
   - SEO 친화적이고 URL만으로 콘텐츠 유추 가능
   - 고객사 변경 시 URL 안정성 유지

5. **도메인별 컴포넌트 세분화**
   - courses/, community/, mypage/, home/ 등 도메인별 폴더
   - signal의 domain/ 단일 폴더보다 탐색이 쉬움 (60개+ 파일이 한 폴더)

6. **데이터 통합 레이어 (data/index.ts)**
   - 여러 JSON을 하나의 타입 안전한 MainData 객체로 통합
   - lib/data.ts에서 findCourseBySlug 등 조회 함수 제공
   - signal은 컴포넌트마다 개별 JSON을 직접 import

7. **Route Group으로 레이아웃 분리**
   - (site)와 (admin)이 URL 오염 없이 독립적 레이아웃
   - 관리자 영역 확장이 용이

8. **lib/ 유틸리티 체계**
   - seo.ts, payments.ts, player.ts 등 도메인별 유틸리티
   - 비즈니스 로직이 컴포넌트/composable에 흩어지지 않음

---

## 5. lecture_frontend 단점 (signal 대비)

### 약점

1. **Composable 패턴 부재**
   - signal의 30개 composable은 로직 재사용의 핵심 단위
   - `useCart()`, `useProducts()`, `usePayments()` 등 호출 한 줄로 완전한 기능 제공
   - lecture는 Container + lib + Store를 조합해야 해서 보일러플레이트가 더 많음

2. **서버 사이드 처리가 약함**
   - signal은 server/api/_internal/로 민감한 API를 서버에서만 처리
   - 로그인 시 `/me` 호출을 서버에서 숨기는 등 보안 패턴 적용
   - Safari 쿠키 이슈 해결 프록시 내장
   - lecture는 이런 서버 사이드 보호 레이어가 미구축

3. **동적 테마 시스템 없음**
   - signal은 CSS Variables + useTheme()으로 런타임 테마 전환 가능
   - lecture는 SCSS 토큰만 사용 → 테마 변경 시 빌드 필요
   - 고객사 브랜드 적용 시 signal이 더 유연

4. **Plugin 시스템 없음**
   - signal은 auth.client.js, cart.client.js, shop-info.server.js 등 플러그인으로 초기화
   - 클라이언트/서버 분리 실행이 명확
   - lecture는 providers.tsx 하나에 의존

5. **데이터 파일이 페이지와 1:1 매핑되지 않음**
   - signal은 28개 JSON이 각 페이지/기능과 직관적으로 매핑
   - lecture는 8개 JSON에 통합 → 단일 파일이 커질 수 있음
   - 다만 lecture의 방식이 타입 안전성은 더 높음

6. **Zustand 스토어 과다 (9개)**
   - signal은 Pinia 2개 + composable 조합으로 간결
   - lecture는 9개 스토어 관리 필요 → 상태 흐름 추적이 복잡해질 수 있음

7. **미들웨어/가드 체계 미흡**
   - signal은 Nuxt middleware + layout 가드로 인증 보호
   - lecture는 명시적 미들웨어 폴더가 없음

8. **이미지 최적화 도구 부재**
   - signal은 @nuxt/image로 반응형 이미지 자동 최적화
   - lecture는 Next.js Image 컴포넌트를 활용할 수 있지만 전용 설정이 부족

---

## 6. signal-web-code-front에서 차용할 만한 패턴

| 패턴 | 설명 | 적용 방안 |
|------|------|-----------|
| **Composable/Hook 패턴** | `useCart()`, `useProducts()` 등 한 줄 호출로 완전한 기능 | lib/ 함수를 React Custom Hook으로 래핑 |
| **서버 사이드 프록시** | API 프록시 + 쿠키 보호 + 민감 API 숨김 | app/api/에 프록시 + 내부 전용 엔드포인트 구축 |
| **동적 테마** | CSS Variables + 런타임 전환 | SCSS 토큰을 CSS Custom Properties로 확장 |
| **페이지별 데이터 파일** | 28개 JSON으로 관심사 분리 | 현재 8개 구조 유지하되, 파일이 커지면 추가 분리 |
| **Plugin 초기화** | 클라이언트/서버 분리 초기화 | providers.tsx를 client/server 분리 또는 middleware 활용 |
| **Safari 쿠키 처리** | SameSite/Secure 변환 프록시 | app/api/ 프록시에 쿠키 정책 레이어 추가 |

---

## 7. 종합 평가

| 평가 항목 | lecture_frontend | signal-web-code-front |
|-----------|-----------------|----------------------|
| 타입 안전성 | ★★★★★ | ★★☆☆☆ |
| SEO/AEO/GEO | ★★★★★ | ★★★☆☆ |
| 접근성(A11y) | ★★★★★ | ★★★☆☆ |
| 관심사 분리 | ★★★★☆ | ★★★★☆ |
| 로직 재사용성 | ★★★☆☆ | ★★★★★ |
| 서버 사이드 보호 | ★★☆☆☆ | ★★★★★ |
| 테마 유연성 | ★★☆☆☆ | ★★★★★ |
| 커스터마이징 용이성 | ★★★★☆ | ★★★★☆ |
| 코드 탐색성 | ★★★★★ | ★★★☆☆ |
| 보일러플레이트 최소화 | ★★★☆☆ | ★★★★☆ |

### 결론

**lecture_frontend**은 타입 안전성, SEO 심화, 접근성, 명확한 폴더 분류에서 우위를 가진다. 템플릿으로서 "구조가 튼튼하고 고객사 커스터마이징이 쉬운" 목표에 잘 부합한다.

**signal-web-code-front**은 Composable 패턴, 서버 사이드 보호, 동적 테마, 실전 운영 패턴(쿠키 처리, 소셜 로그인)에서 강점이 있다. 실제 서비스 운영 경험이 반영된 패턴이 많다.

lecture_frontend의 다음 개선 방향으로는 **Custom Hook 패턴 강화**, **서버 사이드 프록시/보호 레이어 구축**, **CSS Variables 기반 동적 테마 지원**을 권장한다.