# GEMINI.md: The Master Architecture & Development Mandate

이 문서는 본 프로젝트의 **최상위 헌법**입니다. 모든 개발자 및 AI 에이전트는 이 문서에 명시된 원칙을 100% 준수해야 하며, 본 가이드를 벗어난 제안이나 구현은 기술적 부채로 간주하여 거부됩니다.

---

## 🏛️ 1. 핵심 철학: "완벽한 소유권과 분리" (Core Philosophy)

본 프로젝트는 **'최소 수정으로 최대의 변화'**를 구현하기 위해 **구조(Structure), 내용(Content), 표현(Presentation)**을 엄격히 분리합니다.

1.  **구조의 불변성 (Structural Sovereignty)**: `app/`과 `components/`는 비즈니스 로직의 '틀'을 정의합니다. 특정 브랜드나 강의 내용에 종속되지 않는 범용적이고 견고한 구조를 유지합니다.
2.  **내용의 데이터화 (Content as Data)**: UI에 노출되는 **단 한 단어의 문자열**도 코드에 직접 기입하지 않습니다. 모든 것은 `data/*.json`에서 흐릅니다.
3.  **표현의 토큰화 (Presentation by Tokens)**: 모든 시각적 요소는 `assets/styles/tokens/`의 변수를 통해서만 정의됩니다. HEX 코드나 픽셀 단위의 하드코딩은 시스템 파괴 행위로 간주합니다.

---

## 🧠 2. 개발 사고 체계 (Architectural Mental Model)

기능 개발 시 반드시 다음 **'하향식 설계(Top-Down Design)'** 순서를 준수합니다.

> **Route(URL) → SEO Meta → Layout → Page(thin) → Container(Logic) → Domain Block → UI Atom → Data Schema → A11y Validation**

1.  **Route & SEO**: URL 구조(`slug`)를 결정하고, 그에 따른 검색 엔진 최적화 메타데이터를 설계합니다.
2.  **Container Layer**: 비즈니스 로직, 상태 관리(Zustand), 데이터 페칭 로직이 위치하는 곳입니다.
3.  **Domain Block**: `courses`, `community` 등 도메인 지식이 포함된 컴포넌트입니다.
4.  **UI Atom**: 도메인 지식이 전혀 없는 순수 UI 부품(`Button`, `Input`)입니다.
5.  **A11y**: 마지막 순간에 스크린 리더와 키보드 접근성을 검증하는 것이 아니라, 설계 단계부터 `aria-label`과 시맨틱 마크업을 반영합니다.

---

## 🚀 3. 기술 스택 명세 (Technical Stack Mandate)

-   **Framework**: Next.js 16.1.6 (App Router) - Server/Client Component의 명확한 분리.
-   **Core**: React 19 + TypeScript (Strict Mode) - 타입 안정성이 담보되지 않은 코드는 승인되지 않습니다.
-   **State**: Zustand - 작고 빠르며 직관적인 상태 관리를 지향합니다.
-   **Styling**: SCSS + Design Tokens - CSS 변수와 SCSS 믹스인을 조합한 유연한 테마 시스템.
-   **Streaming**: HLS (m3u8) - `hls.js`를 이용한 MSE 기반 재생 및 Safari Native Fallback.
-   **SEO/AEO**: Metadata API + JSON-LD (LD+JSON) - 검색 엔진과 답변 엔진 모두를 위한 구조화 데이터 주입.

---

## 📂 4. 디렉토리 전략 및 책임 (Directory Responsibility)

### 📁 `app/` (The Router)
- **`(site)/`**: 서비스 공개 영역. SEO와 사용자 경험(UX)이 최우선입니다.
- **`(admin)/`**: 운영 관리 영역. 데이터의 무결성과 관리 효율성이 최우선입니다.
- **`api/`**: Next.js Route Handlers. 프런트엔드와 백엔드 사이의 '보안 게이트웨이' 역할을 수행합니다.

### 📁 `components/` (The Building Blocks)
- **`ui/`**: 순수 UI 원자. **하드코딩된 텍스트가 발견될 경우 즉시 리팩토링 대상**입니다.
- **`containers/`**: 스마트 컴포넌트. `hooks`를 호출하고 상태를 관리하며 하위 컴포넌트로 데이터를 흘려보냅니다.
- **`domain/`**: 도메인 전용 컴포넌트. 각 도메인 폴더(`courses/`, `community/` 등)는 독립적으로 동작 가능해야 합니다.

### 📁 `data/` (The Source of Truth)
- **`index.ts`**: 모든 JSON 데이터를 타입 안전하게 통합 관리합니다.
- **`siteData.json`**: 사이트 정체성(이름, 로고, SEO 기본값).
- **`coursesData.json`**: 강의 엔티티의 모든 정보(슬러그, 커리큘럼, FAQ).
- **`uiData.json`**: 버튼, 툴팁, 에러 메시지 등 인터페이스 언어.

---

## 🔗 5. Slug 및 라우팅 규칙 (Routing Sovereignty)

1.  **Slug 중심성**: 모든 상세 페이지는 ID(`123`)가 아닌 Slug(`react-basic`)를 사용합니다.
2.  **URL 구조화**:
    - 강의: `/courses/[slug]`
    - 커뮤니티: `/community/[slug]`
    - 마이페이지: `/mypage/[userId]`
3.  **Redirect & Security**: `middleware.ts`를 통해 인증되지 않은 사용자의 접근을 엣지 단계에서 제어합니다.

---

## 📺 6. 보안 스트리밍 가이드라인 (Video Streaming Protocol)

1.  **권한 발급**: 재생 시작 시 `POST /api/streaming/session`을 호출하여 세션을 생성합니다.
2.  **서명 방식**:
    - `PRESIGNED_URL`: 짧은 만료 시간을 가진 서명된 URL을 통해 직접 재생.
    - `SIGNED_COOKIE`: 보안 쿠키를 통해 세그먼트(`.ts`) 접근 권한을 제어.
3.  **금지 사항**:
    - `.m3u8` 주소를 클라이언트 소스코드나 `data` 파일에 노출하는 행위.
    - 브라우저 콘솔에 서명된 URL이나 토큰을 출력하는 행위.
    - 스트리밍 서명 생성 로직을 프런트엔드에서 구현하는 행위.

---

## 🎨 7. 스타일 시스템 (Styling & Design Tokens)

1.  **토큰 우선**: `assets/styles/tokens/`에 정의되지 않은 값 사용을 금지합니다.
2.  **순서 준수**:
    - 1) `tokens` (정의)
    - 2) `mixins/functions` (도구)
    - 3) `base` (기초)
    - 4) `components` (적용)
3.  **반응형**: `mixins/_breakpoints.scss`를 사용하여 디바이스별 일관된 레이아웃을 보장합니다.

---

## 🔎 8. 글로벌 최적화 (SEO/AEO/GEO/A11y)

1.  **SEO**: Metadata API를 사용하여 페이지별 `title`, `description`, `openGraph`를 동적으로 생성합니다.
2.  **AEO**: FAQ 데이터는 반드시 `FAQPage` 타입의 JSON-LD로 변환되어 헤드에 주입되어야 합니다.
3.  **GEO**: 오프라인 정보가 필요한 경우 `LocalBusiness` 구조화 데이터를 주입합니다.
4.  **A11y (WCAG 2.1 준수)**:
    - 모든 `<img>`는 `alt` 필수.
    - 인터랙티브 요소는 `aria-label` 또는 `aria-describedby` 필수.
    - 키보드 포커스 가시성 보장 및 논리적 탭 순서 유지.

---

## 🚫 9. 절대 금지 사항 (The "Never" List)

-   **Inline Styles**: `style={{...}}` 금지.
-   **Hardcoded Text**: 코드 내 한국어/영어 문자열 직접 입력 금지.
-   **Any Types**: `any` 타입 사용 시 기술 검토 반려.
-   **Magic Numbers**: `z-index: 9999`와 같은 매직 넘버 사용 금지 (토큰 사용).
-   **Direct URL Storage**: 보안상 중요한 URL이나 토큰을 영구 저장소(localStorage)에 보관 금지.

---

## 📝 10. 보고 및 구현 프로토콜 (Output Standard)

모든 작업 완료 후 다음 양식에 맞춰 결과를 보고합니다.

1.  **Summary**: 작업의 목적과 핵심 변경 사항.
2.  **Architecture Tree**: 변경된 컴포넌트 계층 구조.
3.  **Files Changed**: 변경된 파일 목록 (상대 경로).
4.  **Implementation Detail**: 주요 코드 조각 및 설명.
5.  **Optimization Check**: SEO/AEO/A11y 적용 내역 상세 보고.
6.  **Customization Guide**: 타 사이트 적용 시 수정해야 할 Data/Token 포인트.

---
*이 문서는 프로젝트의 생명주기 내내 유지되며, 모든 기술적 의사결정의 최상위 근거가 된다.*
