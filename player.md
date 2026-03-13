# Vidstack 기반 강의 플레이어 구현 계획

## 1. 현재 상태 진단

### 구현 완료 (틀)
- `LecturePlayerContainer` — 플레이어 페이지 조립 레이어 (비디오 영역은 빈 div)
- `VideoControls` — 커스텀 컨트롤 오버레이 (재생/볼륨/배속/자막/풀스크린)
- `LectureSidebar` — 커리큘럼/Q&A/노트/채팅/스크립트 탭 사이드바
- `LectureNavFooter` — 이전/다음 강의 네비게이션
- `VideoPlayerShell` — 레이아웃 래퍼
- `usePlayerStore` (Zustand) — 진행률/이어보기 상태
- `usePlayer` 훅 — 스토어 + localStorage 연동
- `lib/player.ts` — 진행률 저장/복원/시간 포맷 유틸
- `POST /api/streaming/session` — HLS 세션 발급 Route Handler
- `_lecture-player.scss` — 다크 테마 기반 플레이어 스타일
- `/learn/[courseSlug]/[lectureId]` — 라우트 + layout/loading/error/not-found

### 미구현 (핵심 갭)
- 실제 `<video>` 엘리먼트 없음
- HLS 재생 로직 없음 (hls.js 미설치)
- 비디오 이벤트 ↔ 스토어 연동 없음
- 커리큘럼 데이터 ↔ 사이드바 연동 없음
- 스트리밍 세션 발급 → manifestUrl 재생 흐름 없음

---

## 2. Vidstack 도입 이유

### 왜 Vidstack인가

| 기준 | hls.js 직접 통합 | Vidstack |
|------|-----------------|----------|
| HLS 지원 | 직접 `attachMedia` 구현 | 내장 (hls.js 번들 포함) |
| React 통합 | ref + 이벤트 수동 바인딩 | `<MediaPlayer>` 컴포넌트 네이티브 제공 |
| 커스텀 UI | 전부 직접 구현 | Headless UI + 기본 테마 선택 가능 |
| 접근성 (A11y) | 전부 직접 구현 | WCAG 2.1 AA 기본 준수 |
| 키보드 제어 | 전부 직접 구현 | 내장 (Space/Arrow/M/F 등) |
| 자막 (VTT) | track 엘리먼트 수동 | `<Track>` 컴포넌트 제공 |
| 배속 제어 | playbackRate 수동 | 슬라이더/메뉴 내장 |
| 썸네일 프리뷰 | 미지원 | 타임라인 썸네일 내장 |
| PiP (Picture-in-Picture) | 수동 | 내장 |
| 타입 안전성 | hls.js 타입만 | 전체 API TypeScript 네이티브 |
| 번들 사이즈 | hls.js ~60KB | vidstack ~45KB (tree-shakable) |
| Safari HLS | 분기 처리 필요 | 자동 (native HLS fallback) |

### 핵심 판단
- **커스텀 컨트롤 UI를 이미 구현해둔 상태** → Vidstack의 Headless 모드를 활용하면 기존 `VideoControls`를 유지하면서 내부 로직만 vidstack에 위임 가능
- Safari/iOS native HLS 분기를 자동 처리하므로 크로스 브라우저 코드 절감
- 접근성(aria, 키보드)이 기본 내장되어 CLAUDE.md A11y 요구사항 자동 충족

---

## 3. 아키텍처 설계

### 3.1 레이어 구조

```
[Page Route]
  app/(site)/learn/[courseSlug]/[lectureId]/page.tsx
    ↓ params 전달
[Container]
  LecturePlayerContainer.tsx
    ↓ 데이터 로딩 + 스트리밍 세션 발급
    ↓ manifestUrl 획득
[Player Core]
  VidstackPlayer.tsx (새로 생성)
    ├─ <MediaPlayer> (vidstack 코어)
    ├─ <MediaProvider> (HLS/네이티브 자동 선택)
    ├─ <Track> (자막)
    └─ PlayerLayout.tsx (커스텀 UI 조립)
         ├─ VideoControls.tsx (기존 → vidstack 훅으로 리와이어)
         ├─ LectureSidebar.tsx (기존 유지)
         └─ LectureNavFooter.tsx (기존 유지)
[State]
  usePlayerStore.ts (Zustand — 앱 레벨 상태)
    ↕ 동기화
  vidstack 내부 상태 (미디어 레벨 상태)
[Hooks]
  usePlayer.ts (기존 — 스토어 + localStorage)
  useStreamingSession.ts (새로 생성 — 세션 발급/갱신)
[Lib]
  player.ts (기존 유틸 유지)
```

### 3.2 상태 분리 원칙

vidstack 도입 시 상태가 두 곳에 존재한다. 명확히 분리한다:

| 상태 | 관리 주체 | 이유 |
|------|----------|------|
| `currentTime`, `duration`, `isPlaying`, `volume`, `playbackRate`, `buffered` | **vidstack 내부** | 미디어 엘리먼트 소유 상태. 외부에서 복제하지 않는다 |
| `progress` (%), `lastPosition` (초), `isCompleted` | **usePlayerStore** | 앱 비즈니스 로직. 이어보기/수료 판정에 사용 |
| `manifestUrl`, `sessionExpiresAt`, `sessionType` | **useStreamingSession** | 스트리밍 세션 생명주기. 메모리에만 보관 |
| `currentCourseSlug`, `currentLectureId` | **usePlayerStore** | 현재 재생 중인 강의 식별 |

> 기존 `LecturePlayerContainer`에서 `useState`로 관리하던 `isPlaying`, `currentTime`, `volume`, `playbackRate`는 **모두 제거**한다. vidstack의 `useMediaState()` 훅 또는 `useMediaStore()`로 읽는다.

### 3.3 파일 변경 계획

#### 새로 생성
| 파일 | 역할 |
|------|------|
| `components/player/VidstackPlayer.tsx` | vidstack `<MediaPlayer>` 래퍼. manifestUrl을 받아 HLS 재생 |
| `components/player/PlayerLayout.tsx` | 커스텀 컨트롤 레이아웃 조립 (vidstack Headless UI) |
| `components/player/PlayerOverlay.tsx` | 센터 플레이 버튼 + 버퍼링 스피너 + 에러 오버레이 |
| `hooks/useStreamingSession.ts` | 스트리밍 세션 발급/만료 감지/재발급 |
| `assets/styles/components/_vidstack-player.scss` | vidstack 커스텀 스타일 (토큰 기반) |

#### 수정
| 파일 | 변경 내용 |
|------|----------|
| `components/containers/LecturePlayerContainer.tsx` | useState 제거, VidstackPlayer 통합, 데이터 로딩 추가 |
| `components/ui/VideoControls.tsx` | props 기반 → vidstack `useMediaState()` 훅 기반으로 전환 |
| `stores/usePlayerStore.ts` | 미디어 상태 필드 제거, 비즈니스 상태만 유지 |
| `hooks/usePlayer.ts` | vidstack 이벤트 구독으로 이어보기/진행률 동기화 |
| `types/index.ts` | 스트리밍 세션/플레이어 관련 타입 추가 |

#### 유지 (변경 없음)
| 파일 | 이유 |
|------|------|
| `components/ui/LectureSidebar.tsx` | 비디오와 독립적인 UI |
| `components/ui/LectureNavFooter.tsx` | 비디오와 독립적인 UI |
| `components/ui/VideoPlayerShell.tsx` | 레이아웃 래퍼 역할 유지 |
| `lib/player.ts` | 유틸 함수는 vidstack과 무관 |
| `app/api/streaming/session/route.ts` | 이미 올바른 구조 |
| `_lecture-player.scss` | 전체 페이지 레이아웃 스타일 유지 |

---

## 4. 핵심 구현 설계

### 4.1 VidstackPlayer 컴포넌트

```
VidstackPlayer
├── <MediaPlayer>
│   ├── <MediaProvider />          ← HLS/네이티브 자동 선택
│   ├── <Track />                  ← 자막 (VTT)
│   └── <PlayerLayout>             ← 커스텀 UI
│       ├── <PlayerOverlay />      ← 센터 버튼/버퍼링/에러
│       └── <VideoControls />      ← 하단 컨트롤 바
└── 이벤트 구독
    ├── onTimeUpdate → usePlayerStore.updateProgress
    ├── onEnded → usePlayerStore.markCompleted
    ├── onError → 에러 상태 표시
    └── onCanPlay → 이어보기 위치로 seek
```

**핵심 props:**
```typescript
interface VidstackPlayerProps {
  manifestUrl: string;          // HLS manifest URL
  startPosition?: number;       // 이어보기 시작 위치 (초)
  courseSlug: string;
  lectureId: string;
  title: string;                // 접근성용 제목
  captions?: CaptionTrack[];    // 자막 트랙 목록
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onError?: (error: PlayerError) => void;
}
```

### 4.2 스트리밍 세션 흐름

```
[사용자가 강의 클릭]
  ↓
LecturePlayerContainer 마운트
  ↓
useStreamingSession(courseSlug, lectureId) 호출
  ↓
POST /api/streaming/session
  ↓ 응답
┌─────────────────────────────────────────┐
│ type: PRESIGNED_URL                      │
│ → manifestUrl에 서명 파라미터 포함       │
│ → VidstackPlayer에 manifestUrl 전달     │
├─────────────────────────────────────────┤
│ type: SIGNED_COOKIE                      │
│ → 서버가 Set-Cookie로 쿠키 설정          │
│ → VidstackPlayer에 기본 manifestUrl 전달 │
│ → fetch 시 credentials: 'include'       │
└─────────────────────────────────────────┘
  ↓
VidstackPlayer가 manifestUrl로 HLS 재생 시작
  ↓
세션 만료 감지 (expiresAt 기준 타이머)
  ↓
만료 N분 전 자동 재발급 (최대 3회)
  ↓ 실패 시
에러 UI 표시 + 수동 재발급 버튼
```

### 4.3 useStreamingSession 훅 설계

```typescript
interface UseStreamingSessionReturn {
  manifestUrl: string | null;
  isLoading: boolean;
  error: StreamingError | null;
  sessionType: 'PRESIGNED_URL' | 'SIGNED_COOKIE' | null;
  expiresAt: Date | null;
  refresh: () => Promise<void>;   // 수동 재발급
}
```

**자동 재발급 로직:**
- `expiresAt` 기준으로 만료 5분 전에 자동 갱신 타이머 설정
- 최대 재발급 횟수: 3회 (무한 루프 방지)
- 재발급 실패 시 `error` 상태 설정 → UI에서 수동 재발급 버튼 표시
- 컴포넌트 언마운트 시 타이머 정리 (cleanup)

### 4.4 VideoControls 리와이어 방향

기존 `VideoControls`는 부모로부터 props를 받아 렌더링한다. vidstack 전환 시:

**Before (현재):**
```tsx
<VideoControls
  currentTime={currentTime}
  duration={duration}
  isPlaying={isPlaying}
  volume={volume}
  playbackRate={playbackRate}
  onPlay={handlePlay}
  onPause={handlePause}
  onSeek={handleSeek}
  onVolumeChange={handleVolumeChange}
  ...
/>
```

**After (vidstack 전환 후):**
```tsx
// VideoControls 내부에서 직접 vidstack 상태를 읽는다
import { useMediaState, useMediaRemote } from '@vidstack/react';

function VideoControls() {
  const isPaused = useMediaState('paused');
  const currentTime = useMediaState('currentTime');
  const duration = useMediaState('duration');
  const volume = useMediaState('volume');
  const playbackRate = useMediaState('playbackRate');

  const remote = useMediaRemote();

  // remote.play(), remote.pause(), remote.seek(time), ...
}
```

**장점:**
- props drilling 제거 — 컨트롤이 미디어 상태를 직접 구독
- 부모 컴포넌트(Container) 단순화
- vidstack이 최적화된 렌더링 제공 (변경된 상태만 리렌더)

**주의:**
- `VideoControls`가 반드시 `<MediaPlayer>` 하위에 위치해야 Context 접근 가능
- 기존 props 인터페이스는 제거하되, 호환 기간 동안 optional로 유지 가능

---

## 5. 이어보기 / 진행률 동기화

### 저장 시점
| 이벤트 | 동작 |
|--------|------|
| `timeupdate` (매 N초) | `usePlayerStore.updateProgress()` + `lib/player.saveProgress()` |
| `pause` | 즉시 저장 |
| `ended` | `markCompleted()` + 저장 |
| 페이지 이탈 (`beforeunload`) | 마지막 위치 저장 |
| 다른 강의로 전환 | 현재 강의 저장 → 새 강의 로드 |

### 복원 시점
| 시점 | 동작 |
|------|------|
| VidstackPlayer `onCanPlay` | `lib/player.getLastPosition()` → `remote.seek(position)` |

### 수료 판정
- `progress >= 90%` 또는 `ended` 이벤트 발생 시 수료로 간주 (임계값은 config에서 관리)
- 수료 상태는 서버에도 전송 (`POST /api/me/courses/{slug}/complete`)

### 저장 최적화
- `timeupdate` 이벤트는 초당 4회 발생 → **throttle 10초 간격**으로 localStorage 저장
- 서버 동기화는 **30초 간격** 또는 pause/ended 시점

---

## 6. 에러 처리 전략

### 에러 분류 및 UI 대응

| 에러 | 원인 | UI 대응 |
|------|------|---------|
| 401 AUTH_REQUIRED | 미로그인 | 로그인 모달 표시 |
| 403 NO_ENROLLMENT | 수강 미구매 | "수강 신청" CTA + 강의 상세 링크 |
| 410 SESSION_EXPIRED | 세션 만료 | 자동 재발급 시도 → 실패 시 "다시 시도" 버튼 |
| 429 TOO_MANY_REQUESTS | 과다 요청 | 쿨다운 카운트다운 표시 |
| HLS MEDIA_ERR | 네트워크/디코딩 | "재생 오류" + 재시도 버튼 |
| HLS NETWORK_ERR | CDN 연결 실패 | "네트워크 확인" 안내 |

### 에러 메시지 원칙
- 모든 에러 메시지는 `data/uiData.json`의 `player.errors`에서 로드
- 보안 관련 상세 정보(서명 파라미터, 토큰 값 등) 절대 노출 금지
- 에러 상태는 `aria-live="polite"` 영역으로 스크린리더에 전달

---

## 7. 접근성 (A11y) 체크리스트

vidstack이 기본 제공하는 것과 추가로 구현해야 하는 것:

### vidstack 기본 제공 (추가 작업 불필요)
- [x] Space/K: 재생/일시정지
- [x] Arrow Left/Right: 5초/10초 탐색
- [x] Arrow Up/Down: 볼륨 조절
- [x] M: 음소거 토글
- [x] F: 전체화면 토글
- [x] C: 자막 토글
- [x] 미디어 상태 aria-label 자동 업데이트
- [x] 포커스 트랩 (전체화면 시)

### 추가 구현 필요
- [ ] 사이드바 탭 키보드 내비게이션 (Arrow Up/Down)
- [ ] 커리큘럼 항목 Enter로 강의 전환
- [ ] 에러/버퍼링 상태 `aria-live` 공지
- [ ] 이전/다음 강의 버튼 aria-label에 강의 제목 포함
- [ ] 자막 언어 선택 메뉴 키보드 접근성

---

## 8. 백엔드 연동 포인트

### 필요한 API 엔드포인트

| 엔드포인트 | 메서드 | 용도 | 구현 상태 |
|-----------|--------|------|----------|
| `/api/streaming/session` | POST | HLS 세션 발급 | Route Handler 구현 완료 |
| `/api/me/courses` | GET | 내 수강 강의 목록 | 미구현 (mock 필요) |
| `/api/me/courses/{slug}/progress` | PUT | 진행률 서버 동기화 | 미구현 |
| `/api/me/courses/{slug}/complete` | POST | 수료 처리 | 미구현 |
| `/api/me/courses/{slug}/last-position` | GET | 이어보기 위치 조회 | 미구현 |
| `/api/courses/{slug}` | GET | 강의 상세 (커리큘럼 포함) | data 기반 (추후 API 전환) |

### 데이터 전환 전략
현재는 `data/coursesData.json` 기반이지만, 백엔드 연동 시:

1. **Phase 1 (현재):** `data/coursesData.json` → `lib/data.ts` → 컴포넌트
2. **Phase 2 (API 전환):** `lib/api.ts` → 같은 타입으로 반환 → 컴포넌트 변경 없음

`lib/data.ts`의 `findCourseBySlug()` 함수 시그니처를 유지하면서 내부 구현만 fetch로 교체하면 컴포넌트 수정이 최소화된다.

---

## 9. 성능 최적화

### 번들 최적화
- vidstack은 tree-shakable → 사용하는 컴포넌트만 번들에 포함
- `next/dynamic`으로 `VidstackPlayer` lazy load (초기 페이지 로드 시 플레이어 코드 제외)
- HLS provider도 dynamic import (`@vidstack/react/player/layouts` 중 필요한 것만)

### 재생 최적화
- `preload="metadata"` 기본 설정 (자동 재생 방지 + 메타데이터 선로드)
- 썸네일 프리뷰: vidstack의 `<Thumbnail>` 컴포넌트로 타임라인 호버 시 미리보기
- Quality 선택: HLS adaptive bitrate 자동 + 수동 품질 선택 메뉴

### 메모리 관리
- manifestUrl/토큰은 React state(메모리)에만 보관, localStorage/sessionStorage 저장 금지
- 강의 전환 시 이전 플레이어 인스턴스 정리 (vidstack이 자동 처리)
- `beforeunload`에서 진행률 저장 후 정리

---

## 10. 구현 순서 (권장)

### Step 1: 기반 설치 및 타입 정의
- `npm install vidstack@next` (React 19 호환 버전)
- `types/index.ts`에 플레이어/스트리밍 관련 타입 추가
- vidstack CSS 토큰 연동 (`_vidstack-player.scss`)

### Step 2: VidstackPlayer 핵심 컴포넌트
- `VidstackPlayer.tsx` 생성 — `<MediaPlayer>` + `<MediaProvider>` 기본 재생
- manifestUrl을 받아 HLS 재생 확인 (하드코딩 URL로 먼저 테스트)
- Safari/Chrome 크로스 브라우저 확인

### Step 3: VideoControls 리와이어
- 기존 `VideoControls`를 vidstack `useMediaState`/`useMediaRemote` 기반으로 전환
- props 인터페이스 제거, vidstack Context 의존으로 변경
- 기존 스타일(`_lecture-player.scss`) 유지

### Step 4: 이어보기 / 진행률 연동
- `usePlayer` 훅에서 vidstack `timeupdate` 이벤트 구독
- throttle 기반 localStorage 저장
- `onCanPlay` 시 이어보기 위치 복원
- `ended` 시 수료 처리

### Step 5: 스트리밍 세션 연동
- `useStreamingSession` 훅 생성
- `LecturePlayerContainer`에서 세션 발급 → `VidstackPlayer`에 manifestUrl 전달
- 만료 감지 + 자동 재발급 로직
- 에러 UI (401/403/410/429)

### Step 6: 커리큘럼 데이터 연동
- `LectureSidebar`에 실제 `coursesData.json` 커리큘럼 데이터 연결
- 강의 선택 시 라우트 전환 (`/learn/[courseSlug]/[lectureId]`)
- 현재 강의 하이라이트 + 진행 상태 표시

### Step 7: 고급 기능
- 자막 (`<Track>` 컴포넌트)
- PiP (Picture-in-Picture)
- 품질 선택 메뉴
- 썸네일 프리뷰
- 배속 기억 (localStorage)

### Step 8: 백엔드 연동 준비
- 진행률 서버 동기화 (`PUT /api/me/courses/{slug}/progress`)
- 이어보기 위치 서버 조회 (`GET /api/me/courses/{slug}/last-position`)
- 수료 서버 처리 (`POST /api/me/courses/{slug}/complete`)

---

## 11. 폴더 구조 변경

```
components/
  player/                    ← 새로 생성 (플레이어 도메인 컴포넌트)
    VidstackPlayer.tsx       ← vidstack 코어 래퍼
    PlayerLayout.tsx         ← 커스텀 UI 레이아웃
    PlayerOverlay.tsx        ← 센터 버튼/버퍼링/에러
  ui/
    VideoControls.tsx        ← 리와이어 (vidstack 훅 기반)
    LectureSidebar.tsx       ← 유지
    LectureNavFooter.tsx     ← 유지
    VideoPlayerShell.tsx     ← 유지
  containers/
    LecturePlayerContainer.tsx  ← 수정 (VidstackPlayer 통합)

hooks/
  usePlayer.ts               ← 수정 (vidstack 이벤트 연동)
  useStreamingSession.ts     ← 새로 생성

assets/styles/components/
  _vidstack-player.scss      ← 새로 생성 (vidstack 커스텀 스타일)
  _lecture-player.scss       ← 유지 (페이지 레이아웃)
```

> `components/player/`를 새 도메인 폴더로 분리하는 이유: vidstack 의존성이 있는 컴포넌트를 격리하여 `ui/`의 범용성을 유지하고, 추후 플레이어 라이브러리 교체 시 영향 범위를 최소화한다.

---

## 12. 데이터 구조 (data/coursesData.json 확장)

현재 커리큘럼 데이터에 플레이어용 필드를 추가:

```jsonc
{
  "slug": "react-masterclass",
  "curriculum": [
    {
      "sectionTitle": "섹션 1: React 기초",
      "lessons": [
        {
          "id": "lesson-001",
          "slug": "react-intro",          // ← 스트리밍 세션 발급에 사용
          "title": "React 소개",
          "duration": "12:30",
          "locked": false,
          "preview": true,                // ← 미리보기 가능 여부
          "captions": [                   // ← 자막 트랙
            {
              "src": "/captions/react-intro-ko.vtt",
              "srclang": "ko",
              "label": "한국어",
              "default": true
            }
          ],
          "a11y": {
            "ariaLabel": "React 소개 강의 재생하기, 12분 30초"
          }
        }
      ]
    }
  ]
}
```

---

## 13. 주의사항 및 원칙

1. **vidstack 버전**: React 19 호환 확인 필수. `vidstack@next` (1.x) 사용
2. **SSR 주의**: `<MediaPlayer>`는 클라이언트 전용 → `'use client'` + `next/dynamic` lazy load
3. **보안**: manifestUrl/토큰을 console.log, localStorage, data JSON에 절대 노출 금지
4. **스타일**: vidstack 기본 CSS를 import한 뒤 토큰 기반(`_colors.scss`, `_spacing.scss`)으로 오버라이드. inline style/HEX/px 직접 사용 금지
5. **에러 메시지**: `data/uiData.json`에서 로드. 하드코딩 금지
6. **테스트**: 개발 시 public 도메인의 HLS 샘플로 테스트 (예: Bitmovin 공개 샘플)
