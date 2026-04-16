# Figma "About / 회사소개" 페이지 구현 스펙

Source: `mcp-figma-get_figma_data-1776309288861.txt` (전체 3923 라인 / 100% 읽음)
Root frame: `592:23295` "브랜드소개" — 1920 x 6452, bg `#FFFFFF`

페이지 본문(헤더·푸터 제외)은 루트 좌표계 기준 대략 y≈140 ~ y≈5950 구간에 absolute 배치되어 있음.
레이아웃은 대부분 column/row flex + `locationRelativeToParent` 혼용. 구현 시 1440 콘텐츠 max-width + 섹션 vertical padding 으로 환산 필요.

---

## 1. 전체 페이지 구조 (시각 순서)

| # | 섹션 | 역할 | 대략 Y-range |
|---|------|------|--------------|
| 0 | Header (공통) | 기존 GNB 재사용 | 0 ~ 100 |
| 1 | **Hero (Intro)** | 페이지 타이틀 + 태블릿 대시보드 일러스트 | 174 ~ 1100 |
| 2 | **Data** | 검증된 데이터 기반 커리큘럼 성과 (카드 2개, 막대 그래프) | 1280 ~ 2276 |
| 3 | **Experience** | 최고의 학습 경험 선사 (2 카드 + 와이드 배너) | 2386 ~ 3500 |
| 4 | **Evolution** | 강의의 기준 재정의 (스마트폰 목업 + 클래퍼보드) | 3540 ~ 4314 |
| 5 | **Professionals** | 프리미엄 강사진 (강사 프로필 카드 6개) | 4474 ~ 5182 |
| 6 | **Trust** | 통합 결제 시스템 (UI 컨트롤 목업 + 신용카드 컴포넌트) | 5242 ~ 5950 |
| 7 | Footer (공통) | 기존 푸터 재사용 | 6070 ~ 6452 |

데코 요소: dark background rectangle(1120~4314), 상단 blue→transparent gradient ellipse(y=2276), 배경 초대형 "CRAST LAB CRAST LAB" 텍스트(y=3865, fontSize 300px).

---

## Section: Hero (Intro)

- 노드: `592:23710` (Frame 1707487845) / `725:11201` (tablet group) / `592:23711` (tablet bg rect)
- 레이아웃: 2컬럼 느낌 — 좌측 카피 중앙정렬, 우측·하부에 태블릿 대시보드 그래픽. `locationRelativeToParent`로 배치되어 실제로는 absolute overlay. 구현 시 relative-container + 태블릿 이미지 오른쪽 정렬 권장.
- 배경: 페이지 배경 `#FFFFFF` 그대로. 뒤에 `Vector` SVG (opacity 0.3) 와 상단 gradient가 깔림.
- 텍스트
  - eyebrow: `intro` — `style_MEXMAD` Pretendard 500 · 20px · line-height 1.4em · UPPERCASE · letter-spacing -2.5% · color `#0077FF`
  - headline: 2행 `비트코인, 주식, 부동산\n시장을 이기는 단 하나의 선텍.` — `style_32XGP3` Pretendard 600 · 56px · 1.3214em · center · color `#222222`
  - (오타로 보이지만 Figma 그대로 "선텍." 유지 — 실제 구현 시 "선택."으로 교정 가능)
- 태블릿 대시보드 그래픽 (절대 좌표 기준 내부 상세)
  - 태블릿 프레임: `592:23714` rect 828x553, image `fill_89VY35` → `tablet.png` (`tabletbg.png`는 태블릿 주변 그라데이션/섀도 배경 rect 1280x460 `fill_54DNZO`)
  - 점선 퍼센트 가이드 6개: 100%/80%/80%/60%/40%/0% — stroke `#DDDDDD`, dash 8 8, 폰트 `style_KNXP23` Pretendard 400 · 16px · 1.5em · `#767676`
  - 그래프 포인트 배지(`#FFDBDD` 작은 dot): 4개 위치
  - 성장률 칩 4개: `+70%`, `+56%`, `+64%`, `+90%` — 배경 `#FFFFFF` round pill(border-radius 999px), 글자색 `#EC444B`, `style_H2TI23` Pretendard 600 · 18px · 1.333em · padding 10px 24px, box-shadow 3 3 2 0 rgba(0,0,0,0.1)
  - 내부 대시보드 콘텐츠는 `systemContent.png` 로 구성 가능
- 간격: 제목 블록 column gap 20px, 전체 섹션 아래 큰 여백(≈180px) 후 Data 섹션

## Section: Data (검증된 데이터 기반 커리큘럼 성과)

- 노드: `592:23757`  (2개 카드 wrapper) + 헤더 `592:23717`
- 배치: 섹션 박스 1196px (x=362) · column · gap 40px · alignItems center
- 배경: 상위 어두운 rect `fill_XSHY63 #000000` (정확히는 전체 dark 레이어가 섹션 뒤에 깔림). 섹션 자체 배경 없음.
- 헤더
  - eyebrow `data` — `style_MEXMAD` (Pretendard 500·20px·upper·center) · 색 `#FFFFFF`
  - h2 `수강생 투자 전/후 결과 분석 대시보드` — `style_QE54QJ` Pretendard 600·44px·1.318em·center·`#FFFFFF`
- 카드 레이어: row · gap 24px · width fill (1196). 두 장의 카드 `#161616` 배경, border-radius 16px, padding 40px, column gap 48px · width 586
  - **Card 1** (`592:23734`)
    - h3 `검증된 데이터 기반\n커리큘럼 성과` — `headline 1` Pretendard 600·32px·1.3125em·left·`#FFFFFF`
    - body `객관적인 데이터 분석을 기반으로 설계된 커리큘럼을 통해\n실질적인 투자 성과로 이어지는 학습을 제공합니다.` — `body 1` Pretendard 400·18px·1.4444em·`#767676`
    - 막대 2개 (row, alignItems flex-end, gap 68px)
      - `+10%` 라벨(headline 2 Pretendard 600·28px·center·`#767676`) + 바 108x60 (`#575757`, radius 8) + 캡션 `기초 학습 전\n포트폴리오` (`title 2` Pretendard 500·20px·center·`#767676`)
      - `+120%` 라벨(`#FFFFFF`) + 바 108x280 (이미지 fill `fill_TAIVQG` imageRef `546b9cce…` + `#575757` blend) + 캡션 `기초 학습 후\n포트폴리오` (`#FFFFFF`)
  - **Card 2** (`592:23741`) — 동일 구조, 데이터 3개 막대
    - h3 `실질적인 투자\n결과 분석`
    - body `실제 투자 데이터를 기반으로 성과를 분석하고\n더 나은 의사결정을 위한 인사이트를 제공합니다.`
    - 막대3: `+8%`(47px, 회색 `#575757`) `투자 시작\n단계`  /  `+20%`(159px, 회색) `전략 적용\n단계`  /  `+120%`(280px, 이미지 fill) `성과 개선\n결과`

## Section: Experience (최고의 학습 경험)

- 노드: `592:23784` (Frame 1707487864), 1196 폭 · column · gap 40 · center · x=362, y=2386
- 헤더
  - eyebrow `Experience` `style_MEXMAD`·`#FFFFFF`
  - h2 `최고의 학습 경험을 선사합니다` · `style_QE54QJ`·`#FFFFFF`
- 카드 row (gap 24, 카드 2개, 각 586 폭, bg `#161616`, radius 16, padding 40, column gap 24, alignItems center)
  - **Card 1** — 3D 아이콘 rect 114x154 (imageRef `1431c444…` → `3Dsecurity.png` 매핑 추정) + effect boxShadow 16 16 10 0 rgba(34,34,34,0.2)
    - h3 `수강생 보호 정책` — `headline 3` Pretendard 600·24px·1.4166em·center·`#FFFFFF`
    - body `안전한 개인정보 관리 학습 이력 꼼꼼한 보호\n유로 콘텐츠 불법공유 방지` — `body 2` Pretendard 400·16px·1.5em·center·rgba(255,255,255,0.7)
  - **Card 2** — 3D 아이콘 rect 134x154 (imageRef `c7cd3fd6…` → `3Dpie.png` 로 매핑 가능) + 동일 shadow
    - h3 `안심 학습 서비스`
    - body `세심한 보호 아래 학습에 집중 안제 어디서든\n수강함께 성장하는 커뮤니티` (Figma 그대로, 오타성 문구)
- 가운데 22px 세로 connector SVG (`592:23773`, gap -4px)
- **와이드 하단 배너** (`592:23783`)
  - 상단 블록: padding 28 10, 배경 gradient `linear-gradient(85deg,#00438F 0%,#8EC3FF 50%,#00438F 100%)`, radius 16 16 0 0
    - text `수강생 안심 성장을 위한 단 하나의 플랫폼` · `headline 1` Pretendard 600·32px·`#FFFFFF`
  - 하단 블록: padding 56 10, `#161616`, radius 0 0 16 16
    - text `안전한 개인정보 관리와 수강생 보호 정책을 기반으로 학습 이력을 꼼꼼하게 보호하며\n학습에 집중할수 있는 환경을 제공합니다.` · `headline 2` Pretendard 600·28px·center·`#FFFFFF`

## Section: Evolution (강의의 기준 재정의)

- 노드 헤더: `592:23800` (x=681, y=3540, 558 폭, column gap 16, center)
- 노드 컨텐츠: `611:23936` (x=640, y=3648, 640x666)
- 배경: 뒤에 거대 `CRAST LAB CRAST LAB` 텍스트 (`596:23989`, Pretendard 700·300px·`1.193em`, gradient fill `linear-gradient(90deg, rgba(255,255,255,0) 19%, #FFFFFF 49%, rgba(255,255,255,0.2) 80%)`, width 3222, y=3865) — 섹션 가로 배경 워터마크
- 헤더
  - eyebrow `Evolution` `style_MEXMAD`·`#FFFFFF`
  - h2 `강의의 기준을 다시 정의` — `style_N9B9Z6` Pretendard 600·48px·1.208em·center·`#FFFFFF`
- 컨텐츠: 좌측 스마트폰 목업 rect 640x666 (`611:23561` image `fill_RLRVGN` imageRef `71a3407e…` → `phone.png` 또는 `phoneFrame.png` + `phoneContent{1..6}.png`), 우측 카드(`611:23935`, 폭 383, column gap 30, x=138 y=161 relative to group)
  - 클래퍼보드 이미지 rect (height 230, image `fill_IEITHF` imageRef `13da1872…` → 별도 배너 이미지; 프로젝트 자산에는 없을 수 있음 — **Missing asset 후보**)
  - 하단 작은 dots 3개 (`#41455E`)
  - 텍스트 블록
    - h3 `크래스트랩은 오직 최고의 강의만을\n수강생들에게 제공합니다.` — `style_DXK82C` Pretendard 700·26px·1.3846em·center·`#000000`
    - body `실제 시장에서 검증된 전략과 노하우를 바탕으로\n실질적인 성과로 이어지는 학습을 지원합니다` — `style_KNXP23` Pretendard 400·16px·1.5em·center·`#767676` (width 294)
  - 버튼 2개 (row, gap 12)
    - `취소` — 180 폭, padding 16, radius 4, bg `#F3F3F3`, `style_426MHX` Pretendard 500·18px·center·color `#505050`
    - `다음` — 180 폭, 동일 padding/radius, bg `#3086F5`, color `#FFFFFF`

## Section: Professionals (프리미엄 강사진)

- 노드: `611:23557` Group 1707481484, x=316, y=4474, 1364 x 708
- 레이아웃: 좌측 카피(`596:23804` 555 폭, column gap 16, y=236) + 우측 큰 카드 컨테이너(`611:23341` 708x708, x=656 y=0, bg `#F6F7FB`, radius 20). 다크 섹션 안의 밝은 아일랜드.
- 좌측 카피
  - eyebrow `Professionals` — `style_YOB54W` Pretendard 500·20px·1.4em·UPPER·left·`#0077FF`
  - h2 `현직 전문가로 구성된\n프리미엄 강사진` — `style_7VCONE` Pretendard 700·42px·1.2857em·left·`#000000`
  - body `다양한 시장 경험을 갖춘 전문가들이\n데이터와 인사이트를 기반으로 체계적인 교육을 제공합니다.` — `style_QQS4ZF` Pretendard 400·20px·1.4em·left·`#767676`
- 우측 카드: 상단 decorative rect (radius 24 24 0 0, `#FFFFFF`, shadow 8 8 12 -1 rgba(35,48,59,0.4)) + 상단 좌측 작은 SVG 아이콘
- 강사 프로필 목록 (312 폭, column gap 12, x=34 y=72) — 6명 아이템
  | 닉네임 | 팔로워 | 아바타 imageRef | 상태 |
  |---|---|---|---|
  | 주식전문가 | 팔로워 5,920 | `0fd91abe…` | follow 버튼 bg `#0077FF` / text `#FFFFFF` |
  | 부동산 전문가 | 팔로워 5,143 | `149d16dc…` | follow bg `#F4F4F4` / text `#767676` |
  | 비트코인 전문가 | 팔로워 1,277 | `1ae5760f…` | follow bg `#F4F4F4` |
  | 최고의 강사 | 팔로워 9,121 | `c9448a11…` | follow bg `#F4F4F4` |
  | 최적의 강사 | 팔로워 4,521 | `f27b1ada…` | follow bg `#F4F4F4` |
  | 인기 강사 | 팔로워 7,010 | `d521a377…` | follow bg `#F4F4F4` |
- 각 아이템: row space-between padding 12 · 왼쪽: 아바타 44x44 (이미지 fill + 기본색 `#F7F7FB`) + (닉네임 `caption 2` Pretendard 500·14px·`#222222`) + (팔로워 `body 3` Pretendard 400·14px·`#767676`). 오른쪽: `팔로우` 버튼 padding 12 24 radius 4 `button 2` Pretendard 500·14px
- 첫번째 row 배경은 `#FFFFFF` + shadow 6 6 6 0 rgba(0,0,0,0.12) (활성화 아이템 표시)
- 해당 섹션의 아바타 이미지들은 **현재 프로젝트 자산에 없음** → 임의 placeholder 필요 (또는 백엔드 강사 API 연동 가능)

## Section: Trust (통합 결제 시스템)

- 노드: `611:23558` Group 1707481485, x=240, y=5242, 1363 x 708
- 레이아웃: 좌측 큰 카드(`611:23416`, 708x708, bg `#F6F7FB`, radius 20) + 우측 카피(`596:23809`, x=808, y=236, 555 폭, column gap 16)
- 우측 카피(좌측과 같은 스타일 토큰 재사용)
  - eyebrow `Trust` — `style_YOB54W`·`#0077FF`
  - h2 `안정성과 효율성을 갖춘\n통합 결제 시스템` — `style_7VCONE`·`#000000`
  - body `안전한 결제 환경과 최적화된 프로세스를 통해\n누구나 빠르고 간편하게 이용할 수 있는 결제 경험을 제공합니다` — `style_QQS4ZF`·`#767676`
- 좌측 카드(다크톤 레이아웃):
  - 상단 decorative rect `#333237` radius 24 24 0 0 + 작은 SVG
  - 입력/토글/버튼 mockup (325 폭, column gap 18, y=246 relative)
    - 연/월 select 2개: `Selects/Value` 155x50, bg `#4E4E4E`, text `#FFFFFF` Inter 400 13px — 값 `12`, `2024`
    - 숫자 input: bg `#4E4E4E`, value `123`
    - switch row: On 스위치 48x28 + text `DEFAULT` Pretendard 400·11px·`#FFFFFF`
    - 버튼 `Add now` 325x50, radius 5, text Pretendard 500·16px·`#000000`, boxShadow 0 4 8 0 rgba(50,50,71,.06), 0 4 4 0 rgba(50,50,71,.08)
  - 하단 신용카드 컴포넌트 (343x216): bg `#151522`, radius 8, 마스크 + waves 그래픽 + 뱅크 로고 SVG + 칩 SVG + Mastercard 아이콘 + 번호 `* * * *  * * * *  * * * *  0000`(Pretendard 400·22px·`#FFFFFF`) + 라벨 `Card Holder Name`/`Expiry Date`(SF Pro Text 400·11px·`#999999`) + 값 `Tiana Rosser`/`05/23`(SF Pro Text 300·13px·`#FFFFFF`), cardShadow 0 24 32 0 rgba(50,50,71,.08), 0 16 16 0 rgba(50,50,71,.08)

---

## Global Frame

- Canvas: 1920 x 6452
- Background: `#FFFFFF`
- 콘텐츠 컨테이너: 1440 (프로젝트 토큰 `$container-max-width`)과 부분 1196/1363 — 섹션별로 1196(data/experience), 1364(professionals/trust) 폭 사용
- 수직 패딩: 섹션간 간격 ≈ 200~300px (대형 다크 캔버스 위에 섹션들이 overlap 배치)
- Dark background band: y=1120 ~ y=4314 (`#000000` 베이스 + 여러 이미지 fill + gradient, `fill_54DNZO`에 4개 fill 스택: cover 이미지 2장 + 다이아고널 gradient(45deg #F0F3FF→#B7CFFD→#8DB5F9))
- 블루 라디얼 ellipse (y=2276, 1920x1920, gradient 180deg rgba(0,119,255,1)→transparent 68%) — Experience 섹션 상단 글로우

## 공통 토큰 / 색상

- Primary Blue: `#0077FF`
- Text/Primary: `#222222` (fill_VOW726)
- Text/Secondary: `#767676` (fill_KKY2P6)
- Text/White 70%: `rgba(255,255,255,0.7)` (fill_WBGIDT)
- Black: `#000000` / White: `#FFFFFF`
- Gray BG: `#F6F7FB`, `#F4F4F4`, `#F3F3F3`, `#F7F7FB`, `#161616`, `#333237`, `#4E4E4E`, `#575757`
- Red accent: `#EC444B` (pills), `#FFDBDD` (dot)
- Accent: `#3086F5` (다음 버튼), `#FFBA49`, `#FFDF92` (카드 내)
- Font stack: Pretendard (본문), Squada One (LOGO 32px 400), Inter (셀렉트 값), SF Pro Text (신용카드)
- Letter spacing 표준: -2.5%

## 공통 텍스트 스타일 맵

| 용도 | 스타일 키 | 값 |
|---|---|---|
| Hero headline | style_32XGP3 | Pretendard 600 · 56px · 1.321em |
| Section h2 (center white) | style_QE54QJ | Pretendard 600 · 44px · 1.318em |
| Section h2 (center 48) | style_N9B9Z6 | Pretendard 600 · 48px · 1.208em |
| Section h2 (left 42) | style_7VCONE | Pretendard 700 · 42px · 1.286em |
| Headline 1 | headline 1 | Pretendard 600 · 32px · 1.3125em |
| Headline 2 | headline 2 | Pretendard 600 · 28px · 1.357em |
| Headline 3 | headline 3 | Pretendard 600 · 24px · 1.417em |
| Title 2 | title 2 | Pretendard 500 · 20px · 1.5em |
| Title 3 | title 3 | Pretendard 500 · 18px · 1.444em |
| Title 4 | title 4 | Pretendard 500 · 16px · 1.5em |
| Body 1 | body 1 | Pretendard 400 · 18px · 1.444em |
| Body 2 | body 2 | Pretendard 400 · 16px · 1.5em |
| Body 3 | body 3 | Pretendard 400 · 14px · 1.429em |
| Caption 2 | caption 2 | Pretendard 500 · 14px · 1.429em |
| Button 2 | button 2 | Pretendard 500 · 14px · 1.429em |
| Eyebrow center upper | style_MEXMAD | Pretendard 500 · 20px · 1.4em · UPPER · center |
| Eyebrow left upper | style_YOB54W | Pretendard 500 · 20px · 1.4em · UPPER · left |
| Mini card body center | style_KNXP23 | Pretendard 400 · 16px · 1.5em · center |
| Card headline | style_DXK82C | Pretendard 700 · 26px · 1.385em · center |
| Card body left | style_QQS4ZF | Pretendard 400 · 20px · 1.4em · left |
| Pills (+%) | style_H2TI23 | Pretendard 600 · 18px · center |
| BG watermark | style_LP7AMS | Pretendard 700 · 300px · 1.193em |

---

## 4. Asset 매핑 (public/images/about/*)

| 파일 | 사용 섹션 | 역할 | Figma imageRef 추정 |
|---|---|---|---|
| `tablet.png` | Hero | 태블릿 프레임 (828x553 mockup) | `c7d3213c9f95605bd61235e2a057c7c2cb53eb6f` (`fill_89VY35`) |
| `tabletbg.png` | Hero | 태블릿 뒤 파스텔 blue gradient / 그림자 배경 (1280x460, radius 20) | `d0ba86ef…` 또는 다른 fill (`fill_54DNZO` 중 커버 이미지) |
| `systemContent.png` | Hero | 태블릿 화면 안 대시보드 콘텐츠 | Figma에선 SVG/개별 요소로 재구성되어 있음 — 대체 이미지로 활용 |
| `3Dpie.png` | Experience Card 2 (안심 학습 서비스) | 3D 아이콘 134x154 | `c7cd3fd6db852a68cbaeabcc84e15050fc321183` (`fill_E3ZV0E`) |
| `3Dsecurity.png` | Experience Card 1 (수강생 보호 정책) | 3D 아이콘 114x154 | `1431c444c2690742df761a735f4468788264c834` (`fill_YYTKB9`) |
| `phone.png` | Evolution | 스마트폰 전체 목업 | `71a3407e98e6eb8b103e8de2c54b7d43eafab831` (`fill_RLRVGN`) |
| `phoneFrame.png` | Evolution | 스마트폰 프레임 오버레이 (투명 PNG) | (Figma는 단일 이미지로 표현, phone.png와 선택적 합성) |
| `phoneContent1.png` ~ `phoneContent6.png` | Evolution (선택) | 폰 스크린 내부 콘텐츠 스와이프용 (6 프레임) | Figma에선 단일 이미지 — 애니메이션/스와이퍼 구현 시 활용 |

### 세부 매핑 신뢰도
- `3Dsecurity.png` ↔ Card 1: Card 1의 주제가 "수강생 보호 정책"(자물쇠/보안) 이고 Figma 노드명도 `3d-icon-cryptocurrency-padlock 3` → 확정.
- `3Dpie.png` ↔ Card 2: Figma 노드명 `3d-icon-cryptocurrency-blockchain-portfolio 1`. "포트폴리오 파이" 이미지로 매핑은 타당하지만 파일명과 원 Figma asset 의미가 100% 일치하지 않음 — 확인 필요.
- `tabletbg.png`: Figma `fill_54DNZO`는 여러 fill stack(이미지 2 + gradient)으로 합쳐져 있어 단일 파일로 완벽 재현 어려움. `tabletbg.png` + CSS gradient 병행 권장.

---

## 5. Missing / 불확실 Asset

아래 Figma imageRef는 현재 `public/images/about/*`에 대응이 확실하지 않음:

- 강사 아바타 6개 (`0fd91abe…`, `149d16dc…`, `1ae5760f…`, `c9448a11…`, `f27b1ada…`, `d521a377…`) — public 폴더에 강사 사진 없음 → placeholder(회색 원) 또는 백엔드 강사 API 이미지 재활용 필요.
- Trust 섹션 카드 내부 bank logo SVG, chip SVG, Mastercard 아이콘 — Figma 내 component instance로 존재. 프로젝트에 동일 리소스 없음 → 자체 SVG 재구성 또는 단일 `creditcard.png` 목업 이미지 신규 도입 고려.
- Evolution 섹션 클래퍼보드/영상/팝콘 이미지 (`13da1872…`) — 프로젝트 자산에 없음. "not specified" / 신규 이미지 필요 (또는 phone.png로 대체).
- Data 섹션 큰 막대(+120%) 이미지 fill (`546b9cce…`) — 실루엣/패턴이 있는 그래프 바 배경. 단순 `#00438F` gradient로 대체 구현 가능.
- 헤더의 `돋보기` SVG, 점선 벡터, 서랍식 햄버거 등은 공통 컴포넌트로 분리되어 있으므로 about 페이지 구현 범위에선 header 재사용으로 해결.

---

## 구현 참고 메모

- 섹션별 `<section>` + Korean `aria-label`은 data/pagesData.json에 구조화 필요 (예: `pages.about.hero.eyebrow`, `pages.about.hero.title`, `pages.about.data.cards[]`, `pages.about.experience.cards[]`, `pages.about.evolution`, `pages.about.professionals.instructors[]`, `pages.about.trust`)
- h1은 Hero headline, h2는 각 섹션 메인 타이틀, h3는 카드 제목으로 1·2·3 계층 유지
- 다크 섹션 연속 구간(Data→Experience)은 하나의 `<div class="about__dark">` 래퍼로 묶고 내부에서 순차 `<section>` 배치 권장
- Evolution 배경의 거대 "CRAST LAB" 워터마크는 `position: absolute` + `pointer-events: none` + `::before` pseudo 또는 별도 span. 300px/font-weight 700을 그대로 쓰기보다 토큰 `clamp()` 축소 고려
- 하드코딩 금지: 모든 문구·alt·aria 는 `data/pagesData.json`에서 관리
- Figma상 오타("선텍.", "안제 어디서든", "유로 콘텐츠") 는 data 단계에서 교정 적용 (원문 유지 vs 교정은 기획 확인)
