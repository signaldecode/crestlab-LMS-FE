# 내 피드 (MyFeed) 구현 계획

## 1. 디자인 분석

### 레이아웃
- 3칸 그리드 유지 (사이드바 / 피드 / Aside) — CommunityPageShell 그대로 활용
- CommunityFeed의 탭 전환 (`feedTabs[1].id === 'myFeed'`) 시 MyFeedContent가 렌더링됨

### 내 피드 구성 요소

#### ① 타이틀 영역
- **"내피드"** 큰 제목 + ▼ 드롭다운 아이콘 (정렬/필터 변경 토글 용도)

#### ② 카테고리 필터 칩
- 가로 정렬 pill 버튼: `전체` | `전문가` | `부동산` | `비트코인` | `주식`
- 활성 칩: 파란 배경(`$color-primary`) + 흰 텍스트
- 비활성 칩: 흰 배경 + border + 검정 텍스트
- **data 기반으로 관리** (추후 관리자가 카테고리 추가/수정 가능)

#### ③ 피드 카드 (FeedCard)
각 카드 구조 (위→아래):

```
┌─────────────────────────────────────────┐
│ [아바타] 닉네임 ✓ 팔로워 1222    [🔖]  │  ← 작성자 행
│                                         │
│ 제목 텍스트 (bold, 1줄)                 │  ← 제목
│ 본문 미리보기 텍스트 (2-3줄, gray)      │  ← 본문
│                                         │
│ ┌──────────────┐ ┌──────────────┐       │  ← 이미지 (1장 또는 2장)
│ │              │ │              │       │
│ └──────────────┘ └──────────────┘       │
│                                         │
│ 26.05.22          ♡ 000  💬 000  ↗     │  ← 하단 stats
└─────────────────────────────────────────┘
```

**작성자 행:**
- 아바타(원형, placeholder)
- 닉네임 (bold)
- Bluecheck 인증 뱃지 (`/images/community/Bluecheck.png`)
- 팔로워 수 (gray 텍스트)
- 오른쪽 끝: 북마크(🔖) 아이콘 버튼

**이미지 영역:**
- 이미지 0장: 이미지 영역 없음
- 이미지 1장: 전체 너비 (border-radius)
- 이미지 2장: 2열 그리드 (gap 포함)

**하단 stats 행:**
- 왼쪽: 날짜 (gray)
- 오른쪽: ♡ 좋아요 수, 💬 댓글 수, ↗ 공유 아이콘

**카드 간 구분:** 하단 border 또는 padding으로 구분

---

## 2. 현재 코드 대비 수정 사항

### 2-1. `data/communityData.json` 추가

```jsonc
{
  // 내 피드 설정
  "myFeed": {
    "title": "내피드",
    "titleAriaLabel": "내 피드 정렬 변경",
    "filterChips": [
      { "value": "all", "label": "전체" },
      { "value": "expert", "label": "전문가" },
      { "value": "realestate", "label": "부동산" },
      { "value": "bitcoin", "label": "비트코인" },
      { "value": "stock", "label": "주식" }
    ],
    "bookmarkAriaLabel": "북마크",
    "likeAriaLabel": "좋아요",
    "commentAriaLabel": "댓글",
    "shareAriaLabel": "공유"
  },

  // 내 피드 더미 게시글
  "dummyMyFeedPosts": [
    {
      "id": "mf-1",
      "authorNickname": "유아나Is",
      "authorVerified": true,
      "followerCount": "팔로워 1222",
      "title": "여전히 배울 수 있다: 포기하지 않고 만든 결과",
      "body": "서브임시텍스트입니다 최대3줄서브임시텍스트입니다 최대3줄서브임시텍스트입니다 최대3줄서브임시텍스트입니다 최대3줄...",
      "images": ["/images/banners/banner5.jpg"],
      "date": "26.05.22",
      "likeCount": 0,
      "commentCount": 0,
      "isBookmarked": false
    },
    {
      "id": "mf-2",
      "authorNickname": "나누림",
      "authorVerified": true,
      "followerCount": "팔로워 1222",
      "title": "자본주의를 외면한 평범한 직장인이 인생을 바꾼 '이 방법'",
      "body": "서브임시텍스트입니다 최대3줄서브임시텍스트입니다 최대3줄...",
      "images": ["/images/banners/banner3.jpg", "/images/banners/banner9.jpg"],
      "date": "26.05.22",
      "likeCount": 0,
      "commentCount": 0,
      "isBookmarked": false
    },
    {
      "id": "mf-3",
      "authorNickname": "나누림",
      "authorVerified": true,
      "followerCount": "팔로워 1222",
      "title": "현재 시장에서 1억 더 싼 '아파트 급매' 찾는 3가지 방법",
      "body": "서브임시텍스트입니다 최대3줄서브임시텍스트입니다 최대3줄...",
      "images": ["/images/banners/banner6.jpg"],
      "date": "26.05.22",
      "likeCount": 0,
      "commentCount": 0,
      "isBookmarked": false
    },
    {
      "id": "mf-4",
      "authorNickname": "나누림",
      "authorVerified": true,
      "followerCount": "팔로워 1222",
      "title": "월부 30개월, 1억초반으로 수도권 30평대 신축 투자했습니다",
      "body": "서브임시텍스트입니다 최대3줄서브임시텍스트입니다 최대3줄...",
      "images": [],
      "date": "26.05.22",
      "likeCount": 0,
      "commentCount": 0,
      "isBookmarked": false
    }
  ]
}
```

### 2-2. `types/index.ts` 추가

```typescript
/** 내 피드 필터 칩 */
export interface MyFeedFilterChip {
  value: string;
  label: string;
}

/** 내 피드 설정 */
export interface MyFeedConfig {
  title: string;
  titleAriaLabel: string;
  filterChips: MyFeedFilterChip[];
  bookmarkAriaLabel: string;
  likeAriaLabel: string;
  commentAriaLabel: string;
  shareAriaLabel: string;
}

/** 내 피드 더미 게시글 */
export interface DummyMyFeedPost {
  id: string;
  authorNickname: string;
  authorVerified: boolean;
  followerCount: string;
  title: string;
  body: string;
  images: string[];       // 0장, 1장, 2장
  date: string;
  likeCount: number;
  commentCount: number;
  isBookmarked: boolean;
}
```

`CommunityData`에 필드 추가:
```typescript
export interface CommunityData {
  // ... 기존 필드
  myFeed?: MyFeedConfig;
  dummyMyFeedPosts?: DummyMyFeedPost[];
}
```

### 2-3. `components/community/MyFeedContent.tsx` — 전면 재작성

**변경 전:** 스켈레톤 + 빈 상태 + 추천글 패턴
**변경 후:** 필터 칩 + FeedCard 리스트 기반 렌더링

```
MyFeedContent
├─ 타이틀 ("내피드" + ▼)
├─ FilterChips (전체/전문가/부동산/비트코인/주식)
└─ FeedCardList
    ├─ FeedCard (작성자 + 제목 + 본문 + 이미지 + stats)
    ├─ FeedCard
    └─ ...
```

**주요 로직:**
- `useState`로 activeFilter 관리 (기본값 `'all'`)
- data에서 `dummyMyFeedPosts` 가져와서 렌더링
- 이미지 배열 길이에 따라:
  - 0: 이미지 영역 미렌더링
  - 1: 단일 이미지 (full width)
  - 2: 2열 그리드 (50:50)
- Bluecheck 이미지는 `verifiedBadge` data 사용

### 2-4. `_community-page.scss` — 내 피드 섹션 스타일 추가/수정

**기존 `.my-feed` 스타일 대부분 교체.**

새로 추가할 클래스:
```
.my-feed
  &__header         — 타이틀 행 (내피드 + ▼)
  &__title          — h2 "내피드" 스타일
  &__dropdown-icon  — ▼ 아이콘

  &__chips          — 필터 칩 컨테이너 (flex, gap, 가로 스크롤)
  &__chip           — 개별 칩 (pill 스타일)
  &__chip--active   — 활성 칩 (primary 배경)

  &__card-list      — 카드 리스트 컨테이너
  &__card           — 개별 카드
  &__card-author    — 작성자 행 (flex)
  &__card-avatar    — 아바타 (원형)
  &__card-name      — 닉네임
  &__card-follower  — 팔로워 수
  &__card-bookmark  — 북마크 버튼 (우측 정렬)
  &__card-title     — 제목
  &__card-body      — 본문 미리보기 (3줄 clamp)
  &__card-images    — 이미지 컨테이너
  &__card-image     — 개별 이미지
  &__card-images--single  — 1장일 때
  &__card-images--double  — 2장일 때 (grid 2col)
  &__card-footer    — 하단 stats (날짜 + 좋아요/댓글/공유)
  &__card-date      — 날짜
  &__card-stats     — 좋아요/댓글/공유 그룹
  &__card-stat      — 개별 stat 아이템
```

---

## 3. 영향 범위

| 파일 | 변경 유형 | 설명 |
|------|-----------|------|
| `data/communityData.json` | 추가 | `myFeed` 설정 + `dummyMyFeedPosts` 더미 데이터 |
| `types/index.ts` | 추가 | `MyFeedConfig`, `DummyMyFeedPost`, `MyFeedFilterChip` 타입 |
| `components/community/MyFeedContent.tsx` | **전면 재작성** | 필터 칩 + FeedCard 리스트 렌더링 |
| `assets/styles/components/_community-page.scss` | 수정 | `.my-feed` 섹션 스타일 교체/추가 |

### 영향 없음 (변경 불필요)
- `CommunityFeed.tsx` — 이미 `activeTab === 'myFeed'`일 때 `<MyFeedContent />`를 렌더링하므로 수정 불필요
- `CommunityPageShell.tsx` — 변경 없음
- `CommunitySidebar.tsx` — 변경 없음
- `CommunityAside.tsx` — 변경 없음
- `PostCard.tsx` / `PostList.tsx` — 내 피드에서는 사용하지 않음 (FeedCard 별도 구현)

---

## 4. 구현 순서

1. `communityData.json`에 `myFeed` 설정 + `dummyMyFeedPosts` 추가
2. `types/index.ts`에 타입 정의 추가
3. `MyFeedContent.tsx` 전면 재작성
4. `_community-page.scss`에 `.my-feed` 스타일 교체
5. 빌드 검증

---

## 5. 커스터마이징 포인트

관리자가 `communityData.json`만 수정하면 변경 가능한 항목:
- **`myFeed.filterChips`**: 필터 칩 추가/삭제/순서 변경
- **`myFeed.title`**: 타이틀 텍스트
- **`dummyMyFeedPosts`**: 더미 게시글 (추후 API 연동 시 제거)

실제 API 연동 시:
- `dummyMyFeedPosts` 대신 `GET /api/feed/following?category={activeFilter}` 호출
- 필터 칩 변경 시 API 재호출
