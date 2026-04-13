# 메인페이지 피그마 디자인 스펙

> Figma URL: `figma.com/design/DxpjDW6HGTCAN25GLD5SMn` / node-id: `536-20946`
> 시안명: 메인페이지 2차 시안

---

## 1. 전체 페이지 구조

| 항목 | 값 |
|------|-----|
| 페이지 전체 너비 | 1920px |
| 페이지 전체 높이 | 7569px |
| 콘텐츠 영역 너비 | 1440px (좌우 240px 여백) |
| 배경색 | #FFFFFF |
| 기본 폰트 | Pretendard |
| 보조 폰트 | Roboto (섹션 라벨), Squada One (로고) |

---

## 2. 섹션 순서 (위 → 아래)

| # | 섹션 | Y 위치 | 설명 |
|---|------|--------|------|
| 1 | Header/Navigation | y=0 | 글로벌 네비게이션 바 |
| 2 | Hero Banner | y=100 | 풀폭 이미지 슬라이더 + 그라데이션 오버레이 |
| 3 | Banner Control Bar | y=550 | 슬라이드 카운터 "1/8" + 화살표 |
| 4 | Quick Menu | y=680 | 8개 아이콘 퀵 메뉴 |
| 5 | Best Review | y=946 (approx) | 수강생 후기 (어두운 배경) |
| 6 | Best Program #1 | ~y=946 | 이주의 베스트 프로그램 (카드 그리드) |
| 7 | Best Program #2 | ~y=1662 | 이주의 베스트 프로그램 (카드 그리드) |
| 8 | Instructor | ~y=2378 | 강사 프로필 카드 (가로 스크롤) |
| 9 | Background Image | ~y=3080 | 풀폭 장식 배경 이미지 |
| 10 | Tabbed Course #1 | ~y=4247 | 이주의 베스트 프로그램 + 탭 필터 |
| 11 | Tabbed Course #2 | ~y=5027 | 이주의 베스트 프로그램 + 탭 필터 |
| 12 | News/Content | ~y=5807 | 이주의 추천 뉴스 + 페이지네이션 |

---

## 3. 섹션별 상세 스펙

### 3.1 Header / Navigation

| 항목 | 값 |
|------|-----|
| 너비 | 1440px (가운데 정렬) |
| 패딩 | 24px 0px |
| 레이아웃 | Row, space-between, align-items: center |

**로고**
- 텍스트: "LOGO NAME"
- 폰트: Squada One 400, 32px, line-height 1.057em
- 색상: #111111

**네비 메뉴**
- 항목: "회사소개", "주식", "가상자산", "부동산", "강사"
- 폰트: Pretendard 500, 16px, line-height 1.5em, letter-spacing -2.5%
- 색상: #222222
- 간격: gap 48px

**검색바**
- 너비: 300px
- 패딩: 16px 24px
- 테두리: 1px solid #E5E5EC
- border-radius: 9999px (pill)
- placeholder 색상: #767676, 14px

**인증 버튼**
- "로그인" / "회원가입"
- 폰트: Pretendard 500, 14px
- 색상: #767676
- 구분자: 4px 원형 #E5E5EC
- 간격: gap 16px

---

### 3.2 Hero Banner

| 항목 | 값 |
|------|-----|
| 너비 | 1440px |
| 높이 | 520px |
| border-radius | 20px |
| 배경 | 이미지 fill |
| 오버레이 | linear-gradient(180deg, transparent 13%, rgba(0,0,0,0.6) 100%) |

---

### 3.3 Banner Control Bar

| 항목 | 값 |
|------|-----|
| 레이아웃 | Row, align-items: center, gap: 12px |
| 패딩 | 10px 16px |
| border-radius | 9999px (pill) |
| 배경 | rgba(0, 0, 0, 0.6) |
| 텍스트 | "1/8", Pretendard 600, 16px, #FFFFFF |

---

### 3.4 Quick Menu

| 항목 | 값 |
|------|-----|
| 레이아웃 | Row, gap: 48px |
| 아이템 수 | 8개 |

**각 아이템**
| 항목 | 값 |
|------|-----|
| 레이아웃 | Column, align-items: center |
| 아이콘 컨테이너 | 100x100px, padding: 24px, border-radius: 20px |
| 아이콘 크기 | 60x60px SVG |
| 라벨 폰트 | Pretendard 500, 18px, center |
| 라벨 색상 | #222222 |

---

### 3.5 Best Review (수강생 후기)

**배경**
- 풀폭: 1920px x 1027px
- 배경 이미지 + 오버레이

**헤더**
| 항목 | 값 |
|------|-----|
| 라벨 "Review" | Pretendard 600 |
| 제목 "월부 수강생 후기" | Pretendard 600, 40px, line-height 1.25em, letter-spacing -2.5% |
| 제목 색상 | #FFFFFF |
| 설명 텍스트 | Pretendard 400, 18px, line-height 1.444em |
| 설명 색상 | rgba(255,255,255,0.7) |

**통계 바**
| 항목 | 값 |
|------|-----|
| 레이아웃 | Row, gap: 60px |
| 블록 너비 | 220px |
| 블록 내부 gap | 8px |
| 라벨 "누적 수강생" | Pretendard 600, #FFFFFF |
| 숫자 "3,612+" | Pretendard 700, 48px, line-height 1em |
| 숫자 색상 | gradient (purple-to-white) |
| 날개 장식 SVG | 49px x 91px |

**후기 카드**
| 항목 | 값 |
|------|-----|
| 카드 너비 | 464px |
| 카드 높이 | auto (hug) |
| 패딩 | 32px |
| 배경 | #FFFFFF |
| border-radius | 16px |
| 내부 gap | 12px |

**카드 내부 구성**
| 요소 | 스펙 |
|------|------|
| 프로필 아바타 | 30x30px 원형 |
| 닉네임 | Pretendard 500, 14px, #222222 |
| 날짜 | Pretendard 400, 14px, #767676 |
| 별점 | star SVG + "5.0" (Pretendard 500, 14px, #222222) |
| 후기 제목 | Pretendard 500, 16px, #000000 |
| 후기 본문 | Pretendard 300, 14px, #505050 |
| 카드 간 gap | 24px |

---

### 3.6 Best Program (강의 카드 그리드)

**섹션 헤더**
| 항목 | 값 |
|------|-----|
| 라벨 "program" | Roboto 400, 18px, #0077FF |
| 제목 | Pretendard 700, 34px, letter-spacing -2.5%, #000000 |
| 헤더-카드 간격 | 32px |

**강의 카드**
| 항목 | 값 |
|------|-----|
| 레이아웃 | Row, gap: 24px, 3개/행 |
| 카드 너비 | 464px |
| 카드 그림자 | 8px 8px 8px 0px rgba(34,34,34,0.1) |

| 요소 | 스펙 |
|------|------|
| 썸네일 높이 | 204px |
| 썸네일 border-radius | 16px 16px 0 0 (상단만) |
| 콘텐츠 영역 패딩 | 24px |
| 콘텐츠 내부 gap | 32px |
| 콘텐츠 border-radius | 0 0 16px 16px (하단만) |
| 제목 | Pretendard 500, 18px, #222222 (2줄 제한, height 52px) |
| 별점 | star + "4.0" (500, 14px, #222222) + "(150)" (400, 14px, #767676) |
| 강사명 | icon + "강사명" (500, 14px, #222222) |

**BEST 뱃지**
| 항목 | 값 |
|------|-----|
| 배경 | linear-gradient(143deg, #010101 0%, #1778F2 96%) |
| border-radius | 4px |
| 패딩 | 8px 16px |
| 텍스트 | Pretendard 500, 14px, #FFFFFF |

**키워드 태그**
| 항목 | 값 |
|------|-----|
| 배경 | #FFFFFF |
| 테두리 | 1px solid #E5E5EC |
| border-radius | 4px |
| 패딩 | 8px 16px |
| 텍스트 | "#키워드", Pretendard 500, 14px, #767676 |
| 태그 간 gap | 8px |

**CTA 버튼 "바로가기"**
| 항목 | 값 |
|------|-----|
| 너비 | 100% (full width) |
| 패딩 | 16px 10px |
| 배경 | #F4F4F4 |
| border-radius | 4px |
| 텍스트 | Pretendard 500, 14px, #767676 |

---

### 3.7 Instructor (강사 섹션)

| 항목 | 값 |
|------|-----|
| 전체 너비 | 2172px (가로 스크롤) |
| 카드 간 gap | 24px |

**강사 카드**
| 항목 | 값 |
|------|-----|
| 카드 크기 | 342px x 454px |
| 카드 배경 | #F6F7FB |
| 카드 border-radius | 12px |
| 사진 크기 | 342px x 430px |
| 사진 border-radius | 16px |
| 그라데이션 오버레이 | linear-gradient(180deg, transparent 0%, #0077FF 100%) + #F6F7FB |

**이름 플레이트**
| 항목 | 값 |
|------|-----|
| 위치 | 카드 하단 절대 위치 (x:24, y:348) |
| 너비 | 294px |
| 배경 | #FFFFFF |
| border-radius | 8px |
| 패딩 | 16px 20px |
| 내부 gap | 4px |
| 이름 | Pretendard 500, 18px, #222222 |
| 직함 | Pretendard 400, 14px, #767676 |

---

### 3.8 Tabbed Course (탭 필터 강의 섹션)

Best Program과 동일 구조 + 탭 필터 추가

**탭 버튼**
| 상태 | 배경 | 테두리 | 텍스트 색상 |
|------|------|--------|-------------|
| Active | #0077FF | 없음 | #FFFFFF |
| Inactive | transparent | 1px solid #E5E5EC | #999999 |

| 항목 | 값 |
|------|-----|
| border-radius | 9999px (pill) |
| 패딩 | 12px 24px |
| 폰트 | Pretendard 500, 14px |
| 탭 간 gap | 12px |
| 탭-카드 간격 | 20px |

---

### 3.9 News / Content (추천 뉴스)

**섹션 헤더**
- 라벨: "program", Roboto 400, 18px, #0077FF
- 제목: "이주의 추천 뉴스", Pretendard 700, 34px, #000000

**뉴스 카드**
| 항목 | 값 |
|------|-----|
| 레이아웃 | Row, gap: 24px, 2개/행 |
| 카드 너비 | 708px |
| 카드 레이아웃 | Row (가로), gap: 24px |

| 요소 | 스펙 |
|------|------|
| 썸네일 | 264px x 180px, border-radius: 12px |
| 날짜 | Pretendard 400, 16px, #767676 |
| 제목 | Pretendard 500, 20px, #222222 |
| 태그 | "#투자", 배경 #F4F4F4, border-radius: 9999px, 패딩 8px 16px, 14px, #767676 |
| 텍스트 영역 gap | 20px |
| 행 간 gap | 40px |

**페이지네이션**
| 항목 | 값 |
|------|-----|
| 버튼 크기 | 40x40px |
| border-radius | 4px |
| 활성 배경 | #F6F7FB |
| 텍스트 | Pretendard 500, 16px, #767676 |

---

## 4. 컬러 팔레트

### 텍스트 색상
| 토큰 | HEX | 용도 |
|------|-----|------|
| text-black | #000000 | 제목 (heading) |
| text-logo | #111111 | 로고 |
| text-primary | #222222 | 본문 기본 텍스트 |
| text-review-body | #505050 | 후기 본문 |
| text-medium | #595959 | 중간 회색 |
| text-tertiary | #6B7684 | 3차 텍스트 |
| text-secondary | #767676 | 보조 텍스트, placeholder |
| text-muted | #999999 | 비활성 탭 텍스트 |
| text-inverse | #FFFFFF | 밝은 배경 위 텍스트 |

### 배경 / 채움 색상
| 토큰 | HEX | 용도 |
|------|-----|------|
| bg-white | #FFFFFF | 페이지/카드 배경 |
| bg-light-gray | #F4F4F4 | CTA 버튼, 뉴스 태그 배경 |
| bg-section | #F6F7FB | 섹션/카드 배경 |
| bg-placeholder | #D9D9D9 | 아바타 placeholder |

### 강조 / 브랜드 색상
| 토큰 | HEX | 용도 |
|------|-----|------|
| primary-blue | #0077FF | 주요 액센트, 활성 탭, 섹션 라벨 |
| star-yellow | #F6C509 | 별점 |
| accent-red | #C10532 | 다크 레드 강조 |
| accent-pink | #FFBBCD | 핑크 강조 |

### 테두리
| 토큰 | HEX | 용도 |
|------|-----|------|
| border-default | #E5E5EC | 기본 테두리, 비활성 탭, 검색바 |

### 그라데이션
| 이름 | 값 | 용도 |
|------|-----|------|
| hero-overlay | linear-gradient(180deg, transparent 13%, rgba(0,0,0,0.6) 100%) | 히어로 배너 오버레이 |
| best-badge | linear-gradient(143deg, #010101 0%, #1778F2 96%) | BEST 뱃지 |
| stat-number | purple-to-white gradient | 통계 숫자 |
| instructor-overlay | linear-gradient(180deg, transparent 0%, #0077FF 100%) | 강사 카드 오버레이 |
| pink-icon | linear-gradient(90deg, #FFA1B5 0%, #F45671 100%) | 핑크 아이콘 |
| purple-icon | linear-gradient(90deg, #ABA2F4 0%, #7158ED 100%) | 보라 아이콘 |
| overlay-dark | rgba(0, 0, 0, 0.6) | 반투명 오버레이 |
| text-translucent | rgba(255, 255, 255, 0.7) | 반투명 흰색 텍스트 |

---

## 5. 타이포그래피 스케일

| 스타일명 | 폰트 | Weight | Size | Line-Height | Letter-Spacing |
|----------|-------|--------|------|-------------|----------------|
| logo | Squada One | 400 | 32px | 1.057em | - |
| display 1 | Pretendard | 600 | 40px | 1.25em | -2.5% |
| stat-number | Pretendard | 700 | 48px | 1em | - |
| section-title | Pretendard | 700 | 34px | 1.118em | -2.5% |
| title 2 | Pretendard | 500 | 20px | 1.5em | -2.5% |
| title 3 | Pretendard | 500 | 18px | 1.444em | -2.5% |
| title 4 | Pretendard | 500 | 16px | 1.5em | -2.5% |
| body 1 | Pretendard | 400 | 18px | 1.444em | -2.5% |
| body 2 | Pretendard | 400 | 16px | 1.5em | -2.5% |
| body 3 | Pretendard | 400/300 | 14px | 1.429em | -2.5% |
| button 1 | Pretendard | 500 | 16px | 1.5em | -2.5% |
| button 2 | Pretendard | 500 | 14px | 1.429em | -2.5% |
| caption 2 | Pretendard | 500 | 14px | 1.429em | -2.5% |
| section-label | Roboto | 400 | 18px | 1.444em | - |
| counter | Pretendard | 600 | 16px | 1.5em | - |

---

## 6. 공통 스페이싱 패턴

| 패턴 | 값 | 사용처 |
|------|-----|--------|
| 페이지 좌우 여백 | 240px | 콘텐츠 영역 오프셋 |
| 섹션 간 gap | 32px ~ 40px | 주요 섹션 사이 |
| 카드 가로 gap | 24px | 카드 간 간격 |
| 카드 내부 패딩 | 24px ~ 32px | 카드 콘텐츠 영역 |
| 카드 내부 블록 gap | 32px | 콘텐츠 블록 사이 |
| 텍스트 블록 gap | 8px ~ 12px | 제목-메타 사이 |
| 네비 메뉴 gap | 48px | 네비 항목 사이 |
| 퀵메뉴 gap | 48px | 퀵메뉴 아이템 사이 |
| 탭 gap | 12px | 탭 버튼 사이 |
| 태그/뱃지 gap | 8px | 태그 칩 사이 |
| 통계 블록 gap | 60px | 통계 카운터 사이 |
| 뉴스 텍스트 gap | 20px | 날짜/제목/태그 사이 |
| 헤더-콘텐츠 gap | 32px | 섹션 헤더 ~ 카드 그리드 |
| 탭-카드 gap | 20px | 탭 필터 ~ 카드 그리드 |

---

## 7. Border-Radius 패턴

| 값 | 사용처 |
|-----|--------|
| 4px | 태그, 뱃지, 페이지네이션 버튼, CTA 버튼 |
| 8px | 강사 이름 플레이트 |
| 12px | 뉴스 썸네일, 강사 카드 배경 |
| 16px | 강의 카드 썸네일(상단), 후기 카드, 강사 사진 |
| 16px 16px 0 0 | 강의 카드 썸네일 (상단만 둥글게) |
| 0 0 16px 16px | 강의 카드 콘텐츠 (하단만 둥글게) |
| 20px | 히어로 배너, 퀵메뉴 아이콘 |
| 9999px (pill) | 검색바, 탭 버튼, 컨트롤바, 뉴스 태그 |

---

## 8. 이펙트 (그림자)

| 이름 | 값 | 사용처 |
|------|-----|--------|
| card-shadow | box-shadow: 8px 8px 8px 0px rgba(34, 34, 34, 0.1) | 강의 카드 |

---

## 9. 주요 컴포넌트 크기 정리

| 컴포넌트 | 너비 | 높이 |
|----------|------|------|
| 페이지 | 1920px | 7569px |
| 콘텐츠 영역 | 1440px | - |
| 히어로 배너 | 1440px | 520px |
| 퀵메뉴 아이콘 컨테이너 | 100px | 100px |
| 퀵메뉴 아이콘 | 60px | 60px |
| 강의 카드 | 464px | auto |
| 강의 썸네일 | 464px (fill) | 204px |
| 후기 카드 | 464px | auto |
| 강사 카드 | 342px | 454px |
| 강사 사진 | 342px | 430px |
| 뉴스 카드 | 708px | auto |
| 뉴스 썸네일 | 264px | 180px |
| 페이지네이션 버튼 | 40px | 40px |
| 프로필 아바타 | 30px | 30px |
| 검색바 | 300px | auto |
| 일반 아이콘 | 20px | 20px |
