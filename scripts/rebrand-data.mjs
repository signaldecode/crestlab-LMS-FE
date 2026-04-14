/**
 * Data rebranding — converts the 월부/부동산 demo content to a generic IT/dev LMS.
 * Run: node scripts/rebrand-data.mjs
 *
 * Strategy:
 * 1. Per-course mapping (slug → new IT topic) preserves slugs to keep all references intact.
 * 2. Bulk text replacements via regex for testimonial / community / article text that's
 *    too generic to merit a per-item mapping.
 * 3. Image references rewritten from .jpg/.png/.webp → .svg to match generated assets.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = (name) => join(ROOT, 'data', name);
const readJSON = (name) => JSON.parse(readFileSync(dataPath(name), 'utf8'));
const writeJSON = (name, obj) => writeFileSync(dataPath(name), JSON.stringify(obj, null, 2) + '\n', 'utf8');

// ── Bulk image-extension rewrite (jpg/png/webp → svg under /images/banners/) ──
function rewriteImagePaths(s) {
  if (typeof s !== 'string') return s;
  return s
    .replace(/(\/images\/banners\/[a-zA-Z0-9_-]+)\.(jpg|png|webp)/g, '$1.svg')
    .replace(/(\/images\/testIMG\/profile\d+)\.jpg/g, '$1.svg')
    .replace(/(\/images\/community\/Bluecheck)\.png/g, '$1.svg');
}

function deepRewriteImages(node) {
  if (Array.isArray(node)) return node.map(deepRewriteImages);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = deepRewriteImages(v);
    return out;
  }
  return rewriteImagePaths(node);
}

// ── Course mapping: slugs are PRESERVED (all references stay valid). ──────────
// Each entry rewrites the human-facing fields for that course.
const COURSE_REMAP = {
  'real-estate-intermediate': {
    title: 'React 고급 패턴 - 실전 컴포넌트 설계와 성능 최적화',
    summary: '실전 프로젝트에서 바로 쓰는 React 컴포넌트 설계 패턴과 성능 최적화 기법을 배웁니다.',
    description: '컴파운드 컴포넌트, 커스텀 훅, 렌더링 최적화, 상태 관리까지 React 고급 개발자가 알아야 할 모든 것을 마스터합니다.',
    category: 'frontend',
    instructor: '김리액트',
    tags: ['React', '컴포넌트설계', '성능최적화'],
    learningPoints: [
      '재사용 가능한 컴포넌트 패턴 설계법',
      '리렌더링 최소화와 메모이제이션 전략',
      '상태관리 라이브러리 비교와 선택 기준',
    ],
    creatorRole: '프론트엔드 시니어 개발자',
    creatorBio: '실무 10년차 프론트엔드 개발자로, 다수의 대규모 서비스에서 React 아키텍처를 설계해 왔습니다.',
    faq: [
      { question: '리액트 입문자도 들을 수 있나요?', answer: '기본 문법은 알고 있다고 가정합니다. 입문자라면 기초 강의를 먼저 듣는 것을 권장합니다.' },
      { question: '수강 기간은 얼마인가요?', answer: '구매 후 무제한으로 수강하실 수 있습니다.' },
    ],
  },
  'location-analysis': {
    title: 'TypeScript 심화 - 타입 시스템 마스터 클래스',
    summary: '2026년 신규런칭! 복잡한 타입을 자유자재로 다루는 TypeScript 심화 강의입니다.',
    description: '제네릭, 조건부 타입, 매핑 타입, 타입 추론까지 TypeScript의 타입 시스템을 깊이 있게 학습합니다.',
    category: 'frontend',
    instructor: '박타입',
    tags: ['TypeScript', '타입시스템', '제네릭'],
    learningPoints: [
      '복잡한 비즈니스 도메인을 표현하는 타입 설계',
      '제네릭과 조건부 타입을 활용한 추론 기법',
    ],
    creatorRole: '타입스크립트 코어 컨트리뷰터',
    creatorBio: '오픈소스 타입스크립트 라이브러리를 다수 운영하며 타입 시스템 교육에 집중하고 있습니다.',
    faq: [
      { question: 'JavaScript 지식이 전혀 없어도 수강할 수 있나요?', answer: 'TypeScript 심화 과정이라 ES6+ JavaScript 기본 지식이 필요합니다.' },
    ],
  },
  'interior-renovation': {
    title: '디자인 시스템 구축 가이드 - 0부터 만드는 디자인 토큰',
    summary: '구축 프로덕트도 일관된 사용자 경험으로 만드는 디자인 시스템 실전 가이드입니다.',
    description: '디자인 토큰, 컴포넌트 라이브러리, 문서화, 버전 관리까지 디자인 시스템 구축의 전 과정을 학습합니다.',
    category: 'design',
    instructor: '이디자인',
    tags: ['디자인시스템', '디자인토큰', 'Figma'],
    learningPoints: [
      '확장 가능한 디자인 토큰 체계 설계법',
      '디자인-개발 협업 워크플로 정착시키기',
    ],
    creatorRole: '프로덕트 디자이너',
    creatorBio: '여러 스타트업의 디자인 시스템을 0부터 구축해 본 경험을 바탕으로 강의합니다.',
  },
  'real-estate-sell-strategy': {
    title: '2026 NEW Next.js 풀스택 - App Router로 만드는 실전 웹앱',
    summary: 'Next.js 16 App Router 기반 풀스택 웹앱을 처음부터 끝까지 직접 만들어 봅니다.',
    description: '서버 컴포넌트, 라우팅, 데이터 페칭, 인증, 배포까지 Next.js로 프로덕션 레벨의 서비스를 만드는 전 과정을 학습합니다.',
    category: 'frontend',
    instructor: '정넥스트',
    tags: ['Next.js', 'App Router', '풀스택'],
    learningPoints: [
      'App Router 기반 데이터 페칭 전략',
      '서버 컴포넌트와 클라이언트 컴포넌트 분리 원칙',
    ],
    creatorRole: '풀스택 개발자',
    creatorBio: 'Next.js 기반 SaaS 프로덕트를 다수 출시한 풀스택 개발자입니다.',
  },
  'cheap-apartment-finder': {
    title: '2026 NEW 프론트엔드 입문 BEST - 박타입의 Vue 3 입문',
    summary: 'Composition API 기반의 Vue 3을 입문부터 실전까지 단계별로 익힙니다.',
    description: '반응성 시스템, 컴포넌트 통신, Pinia 상태관리, Vue Router까지 Vue 3 생태계 전반을 학습합니다.',
    category: 'frontend',
    instructor: '박타입',
    tags: ['Vue3', 'Composition API', 'Pinia'],
    learningPoints: [
      'Composition API의 반응성 시스템 이해',
      '실전 프로젝트로 배우는 컴포넌트 통신 패턴',
    ],
    creatorRole: '프론트엔드 시니어 개발자',
    creatorBio: 'Vue.js와 React를 모두 다루는 시니어 프론트엔드 개발자입니다.',
    faq: [
      { question: '수강 기간은 얼마인가요?', answer: '구매 후 무제한으로 수강하실 수 있습니다.' },
      { question: '환불이 가능한가요?', answer: '수강 시작 후 7일 이내 환불 가능합니다.' },
    ],
  },
  'gangnam-20min': {
    title: '실전 NestJS! 확장 가능한 백엔드 아키텍처 설계법!',
    summary: 'TypeScript 기반 NestJS로 확장 가능한 백엔드 서비스를 설계하는 방법을 배웁니다.',
    description: '모듈 구조, 의존성 주입, 인증/인가, 데이터베이스 연동, 테스트까지 NestJS의 모든 것을 학습합니다.',
    category: 'backend',
    instructor: '최노드',
    tags: ['NestJS', 'TypeScript', '백엔드아키텍처'],
    learningPoints: [
      'DDD 기반 NestJS 모듈 설계법',
      '실전 인증·인가와 미들웨어 구성',
    ],
    creatorRole: '백엔드 시니어 개발자',
    creatorBio: 'Node.js·NestJS 기반 백엔드 시스템을 운영해 온 시니어 개발자입니다.',
  },
  'my-house-basic': {
    title: '웹 개발 입문이 고민된다면? 시작 전, 웹 개발 기초반',
    summary: '웹 개발의 모든 것을 배우는 입문 기초반입니다.',
    description: 'HTML, CSS, JavaScript의 기본기와 브라우저 동작 원리, Git 기초까지 웹 개발을 시작하는 데 필요한 핵심 지식을 학습합니다.',
    category: 'frontend',
    instructor: '한웹기초',
    tags: ['HTML', 'CSS', 'JavaScript'],
    learningPoints: [
      '시맨틱 마크업과 반응형 레이아웃 작성법',
      'JavaScript의 핵심 문법과 DOM 조작',
    ],
    creatorRole: '주니어 개발자 멘토',
    creatorBio: '입문자에게 친절한 설명으로 정평이 난 웹 개발 입문 강사입니다.',
    faq: [
      { question: '개발 지식이 전혀 없어도 수강할 수 있나요?', answer: '네, 완전 초보자를 위한 기초 강의로 사전 지식 없이도 수강 가능합니다.' },
      { question: '수강 기간은 얼마인가요?', answer: '구매 후 무제한으로 수강하실 수 있습니다.' },
    ],
  },
  'ss-coupon-basic': {
    title: '실무에서 바로 쓰는 도커·쿠버네티스 기초반 5기',
    summary: '컨테이너부터 오케스트레이션까지, 도커와 쿠버네티스 기초를 실습으로 배웁니다.',
    description: '도커 이미지 빌드, 컴포즈, 쿠버네티스 클러스터 구성, 배포 전략까지 컨테이너 기반 운영의 모든 것을 학습합니다.',
    category: 'devops',
    instructor: '강도커',
    tags: ['Docker', 'Kubernetes', '컨테이너'],
    learningPoints: [
      '도커 이미지 최적화 실전 전략',
      '쿠버네티스 매니페스트 작성과 배포',
    ],
    creatorRole: '데브옵스 엔지니어',
    creatorBio: '대규모 서비스의 컨테이너 인프라를 운영해 온 데브옵스 엔지니어입니다.',
  },
  'olive-young-seller': {
    title: 'AWS 클라우드 입문 - 실습으로 익히는 핵심 서비스',
    summary: 'AWS의 핵심 서비스를 실습 위주로 배우는 클라우드 입문 강의입니다.',
    description: 'EC2, S3, RDS, VPC, IAM 등 AWS 핵심 서비스의 사용법과 실전 아키텍처 구성 방법을 학습합니다.',
    category: 'devops',
    instructor: '윤클라우드',
    tags: ['AWS', '클라우드', '인프라'],
    learningPoints: [
      'AWS 핵심 서비스 사용법과 비용 관리',
      '실전 3-tier 아키텍처 구성 실습',
    ],
    creatorRole: '클라우드 아키텍트',
    creatorBio: 'AWS Solution Architect Professional 자격을 보유한 현업 클라우드 아키텍트입니다.',
  },
  'ai-homepage-business': {
    title: '코드 없이 시작하는 AI 앱 빌더! Claude로 만드는 사이드 프로젝트',
    summary: 'AI 도구를 활용해 코드 한 줄 없이 사이드 프로젝트를 만들고 운영하는 방법을 배웁니다.',
    description: 'AI 코드 어시스턴트, 프롬프트 엔지니어링, 노코드 도구 결합으로 누구나 자신의 아이디어를 빠르게 검증할 수 있는 과정입니다.',
    category: 'ai',
    instructor: '오에이아이',
    tags: ['AI', 'Claude', '사이드프로젝트'],
    learningPoints: [
      'AI 코드 어시스턴트 활용 워크플로',
      '아이디어를 MVP로 만드는 노코드/AI 결합 전략',
    ],
    creatorRole: 'AI 프로덕트 빌더',
    creatorBio: '여러 AI 기반 사이드 프로젝트로 사용자를 모은 인디 메이커입니다.',
  },
  'danggeun-market-100': {
    title: '플러터 입문! 한 코드로 만드는 iOS·Android 앱',
    summary: 'Flutter로 한 번 작성한 코드를 iOS와 Android 양쪽에 배포하는 방법을 배웁니다.',
    description: 'Dart 기초, 위젯 트리, 상태 관리, API 연동, 빌드·배포까지 Flutter 모바일 앱 개발의 전 과정을 학습합니다.',
    category: 'mobile',
    instructor: '서모바일',
    tags: ['Flutter', 'Dart', '크로스플랫폼'],
    learningPoints: [
      'Flutter 위젯 트리와 상태 관리 패턴',
      'iOS와 Android 동시 배포 워크플로',
    ],
    creatorRole: '모바일 앱 개발자',
    creatorBio: 'Flutter로 50개 이상의 모바일 앱을 출시한 시니어 모바일 개발자입니다.',
  },
  'monthly-income-blog': {
    title: '개발자 기술블로그 운영 실전반 - 퍼스널 브랜딩의 시작',
    summary: '꾸준히 읽히는 개발자 기술 블로그를 운영하며 퍼스널 브랜딩을 키우는 실전 전략을 배웁니다.',
    description: '주제 선정, 글 구조, SEO 최적화, 커리어 연결까지 기술 블로그로 자신의 가치를 높이는 전 과정을 학습합니다.',
    category: 'career',
    instructor: '신블로그',
    tags: ['기술블로그', '퍼스널브랜딩', 'SEO'],
    learningPoints: [
      '꾸준히 쓸 수 있는 기술 블로그 운영법',
      '개발자 커리어와 연결되는 글쓰기 전략',
    ],
    creatorRole: '시니어 개발자 · 테크 라이터',
    creatorBio: '여러 매체에 기술 글을 기고해 온 시니어 개발자이자 테크 라이터입니다.',
  },
  'tax-income-report': {
    title: '프리랜서 개발자 시작 가이드 - 계약·세금·견적 한 번에 정리',
    summary: '프리랜서 개발자로 독립하기 전에 꼭 알아야 할 계약·세금·견적의 모든 것을 한 번에 정리합니다.',
    description: '사업자 등록, 부가세 신고, 견적 산정, 계약서 작성, 클라이언트 커뮤니케이션까지 프리랜서 개발자의 실무를 학습합니다.',
    category: 'career',
    instructor: '오프리',
    tags: ['프리랜서', '개발자커리어', '견적'],
    learningPoints: [
      '프리랜서 개발자 견적 산정 실전법',
      '안전한 계약과 세금 신고 가이드',
    ],
    creatorRole: '10년차 프리랜서 개발자',
    creatorBio: '대기업·스타트업을 두루 거쳐 현재는 프리랜서로 활동 중인 시니어 개발자입니다.',
  },
  'financial-basic-class': {
    title: '코딩테스트 합격 알고리즘 기초반 - 같은 시간 2배 빠르게 푸는 공식',
    summary: '같은 시간 안에 더 많은 문제를 푸는 코딩테스트 알고리즘 기초반입니다.',
    description: '자료구조, 시간복잡도, 그리디, DP, 그래프 탐색까지 코딩테스트 합격을 위한 핵심 알고리즘을 학습합니다.',
    category: 'cs',
    instructor: '한알고리즘',
    tags: ['알고리즘', '코딩테스트', '자료구조'],
    learningPoints: [
      '핵심 자료구조와 시간복잡도 분석',
      '유형별 알고리즘 풀이 패턴',
    ],
    creatorRole: '알고리즘 강사 · 백엔드 개발자',
    creatorBio: '네이버·카카오 코딩테스트 출제 경험이 있는 알고리즘 강사입니다.',
  },
  'us-stock-basic': {
    title: '환경 셋업부터 모델 학습까지, 파이썬 데이터 분석 기초반 6기',
    summary: '파이썬 입문부터 데이터 분석·시각화까지 단계별로 배웁니다.',
    description: 'Python 기초 문법, NumPy/Pandas, 데이터 시각화, 간단한 머신러닝 모델까지 데이터 분석의 전 과정을 학습합니다.',
    category: 'data',
    instructor: '강데이터',
    tags: ['Python', 'Pandas', '데이터분석'],
    learningPoints: [
      'Pandas로 실전 데이터 전처리하기',
      'matplotlib·seaborn 시각화 핵심',
    ],
    creatorRole: '데이터 사이언티스트',
    creatorBio: '핀테크·이커머스 도메인에서 데이터 분석 업무를 해 온 데이터 사이언티스트입니다.',
  },
  'auction-basics': {
    title: '[2026 전면 리뉴얼] Git/GitHub 협업 기초반 - 실전 브랜치 전략',
    summary: 'Git 기초부터 팀 협업 브랜치 전략까지 한 번에 배우는 실전 강의입니다.',
    description: 'Git 기본 명령, 브랜치/머지/리베이스, GitHub 협업 워크플로, PR 리뷰 문화까지 실전 사례와 함께 학습합니다.',
    category: 'devops',
    instructor: '백깃',
    tags: ['Git', 'GitHub', '협업'],
    learningPoints: [
      '실전 Git 브랜치 전략과 충돌 해결법',
      'GitHub PR 리뷰 문화 정착 방법',
    ],
    creatorRole: '데브옵스 · 개발자 멘토',
    creatorBio: '여러 회사의 Git 협업 워크플로를 정립해 온 시니어 엔지니어입니다.',
  },
  'money-book-club': {
    title: '26년 4월 개발 도서 모임 <소프트웨어 아키텍처의 모든 것>',
    summary: '소프트웨어 아키텍처에 대한 본질적 이해를 함께 배우는 개발 도서 모임입니다.',
    description: '매달 선정된 개발·아키텍처 서적을 함께 읽고 토론하며, 실무 코드와 설계에 적용하는 인사이트를 나눕니다.',
    category: 'career',
    instructor: '모더레이터',
    tags: ['도서모임', '소프트웨어아키텍처', '커리어'],
    learningPoints: [
      '시니어 개발자의 독서법과 코드 적용',
      '개발자 필독서 핵심 요약과 토론',
    ],
    creatorRole: '커뮤니티 모더레이터',
    creatorBio: '개발자 커뮤니티에서 도서 모임을 5년째 운영해 온 모더레이터입니다.',
  },
  'youtube-income-start': {
    title: '개발 유튜버 시작하기 - 0원으로 시작하는 콘텐츠 제작',
    summary: '개발 유튜브 채널을 0원에서 시작해 운영까지 이어가는 전 과정을 배웁니다.',
    description: '채널 컨셉, 영상 기획, 화면 녹화, 편집, 썸네일까지 개발 콘텐츠 제작의 모든 것을 학습합니다.',
    category: 'career',
    instructor: '윤크리에이터',
    tags: ['유튜브', '개발콘텐츠', '편집'],
    learningPoints: [
      '개발자 유튜브 채널 기획부터 운영까지',
      '저비용으로 시작하는 콘텐츠 제작 워크플로',
    ],
    creatorRole: '개발 유튜버',
    creatorBio: '구독자 수 만 명 이상의 개발 유튜브 채널을 운영 중인 크리에이터입니다.',
  },
  'commercial-building': {
    title: '마이크로서비스 아키텍처 실전 - 분산 시스템의 정석',
    summary: '모놀리스에서 마이크로서비스로 안전하게 전환하는 실전 아키텍처 전략을 배웁니다.',
    description: '서비스 분리 기준, API 게이트웨이, 서비스 디스커버리, 분산 트랜잭션, 관측성까지 마이크로서비스의 핵심을 학습합니다.',
    category: 'backend',
    instructor: '강아키텍트',
    tags: ['MSA', '분산시스템', '백엔드'],
    learningPoints: [
      '서비스 분리 기준과 도메인 모델링',
      '분산 환경의 트랜잭션·관측성 전략',
    ],
    creatorRole: '백엔드 아키텍트',
    creatorBio: '대규모 트래픽 서비스의 MSA 전환을 주도해 온 백엔드 아키텍트입니다.',
  },
  'subscription-redevelopment': {
    title: 'CI/CD와 데브옵스 완전정복 - 자동화 파이프라인부터 모니터링까지',
    summary: '코드 푸시부터 배포·모니터링까지, 데브옵스 자동화 파이프라인의 모든 것을 배웁니다.',
    description: 'GitHub Actions, Docker, Kubernetes, 모니터링·알림 구성까지 실전 CI/CD 파이프라인을 직접 구축합니다.',
    category: 'devops',
    instructor: '강도커',
    tags: ['CI/CD', 'GitHub Actions', '자동화'],
    learningPoints: [
      'GitHub Actions로 만드는 실전 파이프라인',
      '관측성과 알림 시스템 구성 노하우',
    ],
    creatorRole: '데브옵스 엔지니어',
    creatorBio: '다수의 스타트업 인프라를 자동화한 데브옵스 엔지니어입니다.',
  },
  'real-estate-basic-class': {
    title: '[26.5월 최신문법] 2026 모던 자바스크립트 입문 - 프론트엔드 기초반',
    summary: '모던 자바스크립트의 기본기를 탄탄히 다지는 프론트엔드 기초반입니다.',
    description: '프론트엔드 개발을 처음 시작하는 분들을 위한 입문 강의입니다. ES2024 문법, 비동기, 모듈, 브라우저 동작 원리까지 모던 자바스크립트의 핵심을 학습합니다.',
    category: 'frontend',
    instructor: '한웹기초',
    tags: ['JavaScript', 'ES2024', '프론트엔드'],
    learningPoints: [
      '모던 자바스크립트 핵심 문법',
      '비동기와 이벤트 루프 이해하기',
    ],
    creatorRole: '주니어 개발자 멘토',
    creatorBio: '프론트엔드 입문자를 위한 강의로 정평이 난 시니어 개발자입니다.',
    faq: [
      { question: '개발 지식이 전혀 없어도 수강할 수 있나요?', answer: '네, 완전 초보자를 위한 기초 강의로 사전 지식 없이도 수강 가능합니다.' },
      { question: '수강 기간은 얼마인가요?', answer: '구매 후 무제한으로 수강하실 수 있습니다.' },
    ],
  },
  'blog-auto-income': {
    title: '[이번 주 모집 마감] 개발자 포트폴리오 사이트 만들기 - 첫 채용까지',
    summary: 'Next.js 기반 개발자 포트폴리오를 직접 만들고 배포해 첫 채용까지 이어가는 실전 강의입니다.',
    description: '포트폴리오 기획, Next.js로 직접 구축, 도메인 연결, GitHub README 정리까지 개발자 첫 취업·이직에 필요한 자기 브랜딩을 배웁니다.',
    category: 'career',
    instructor: '신블로그',
    tags: ['포트폴리오', 'Next.js', '개발자취업'],
    learningPoints: [
      '실전 개발자 포트폴리오 사이트 직접 구축',
      '채용 담당자 시선의 GitHub 정리법',
    ],
    creatorRole: '시니어 개발자 · 멘토',
    creatorBio: '주니어 개발자 채용 면접관으로 활동 중인 시니어 개발자입니다.',
    faq: [
      { question: '개발 입문자도 들을 수 있나요?', answer: '네, 가장 기본적인 HTML/CSS부터 차근차근 알려드립니다.' },
    ],
  },
};

// ── 1. coursesData.json ──────────────────────────────────────────────────────
{
  const courses = readJSON('coursesData.json');
  for (const c of courses) {
    const m = COURSE_REMAP[c.slug];
    if (!m) { console.warn('⚠️ no remap for', c.slug); continue; }
    c.title = m.title;
    c.summary = m.summary;
    c.description = m.description;
    c.thumbnailAlt = `${m.title} 강의 썸네일`;
    c.category = m.category;
    c.instructor = m.instructor;
    c.tags = m.tags;
    c.learningPoints = m.learningPoints;
    if (m.faq) c.faq = m.faq;
    if (c.creator) {
      c.creator.name = m.instructor;
      c.creator.role = m.creatorRole;
      c.creator.bio = m.creatorBio;
    }
  }
  writeJSON('coursesData.json', deepRewriteImages(courses));
  console.log('✅ coursesData.json');
}

// Helpers used by the home/community/account passes ──────────────────────────
const SECTION_TITLES = {
  '지금 가장 주목받는 강의': '지금 가장 주목받는 강의',
  'BEST 재테크 클래스': 'BEST 백엔드 클래스',
  '이번 달 BEST': '이번 달 BEST',
  '요즘 뜨는 부동산 지역 분석 강의': '요즘 뜨는 데브옵스·클라우드 강의',
  '새로 나온 강의': '새로 나온 강의',
};

const HOME_CATEGORIES = [
  { icon: 'star', label: '첫강의추천', href: '/courses?tag=first', ariaLabel: '첫강의추천 카테고리' },
  { icon: 'mic', label: '인기강사특강', href: '/courses?tag=special', ariaLabel: '인기강사특강 카테고리' },
  { icon: 'crown', label: '오리지널', href: '/courses?tag=original', ariaLabel: '오리지널 카테고리' },
  { icon: 'pen', label: '프론트엔드', href: '/courses?category=frontend', ariaLabel: '프론트엔드 카테고리' },
  { icon: 'briefcase', label: '백엔드', href: '/courses?category=backend', ariaLabel: '백엔드 카테고리' },
  { icon: 'ticket', label: '내쿠폰', href: '/mypage/coupons', ariaLabel: '내쿠폰 카테고리' },
  { icon: 'calendar', label: '이달의강의', href: '/courses?tag=monthly', ariaLabel: '이달의강의 카테고리' },
  { icon: 'tag', label: '첫구매특가', href: '/courses?tag=first-buy', ariaLabel: '첫구매특가 카테고리' },
  { icon: 'book', label: '전문가칼럼', href: '/community?tab=expert', ariaLabel: '전문가칼럼 카테고리' },
  { icon: 'building', label: '데브옵스', href: '/courses?category=devops', ariaLabel: '데브옵스 카테고리' },
];

const BEST_CHIP_CATEGORIES = [
  { value: 'all', label: '전체' },
  { value: 'frontend', label: '프론트엔드' },
  { value: 'backend', label: '백엔드' },
  { value: 'mobile', label: '모바일' },
  { value: 'devops', label: '데브옵스' },
  { value: 'data', label: '데이터' },
  { value: 'ai', label: 'AI' },
  { value: 'cs', label: 'CS·알고리즘' },
  { value: 'design', label: '디자인' },
  { value: 'career', label: '커리어' },
];

const HOME_INSTRUCTORS = [
  { id: 'inst1', name: '김리액트', specialty: '프론트엔드', courseCount: 12, rating: 4.98, reviewCount: 17191, color: '#0ea5e9', ariaLabel: '김리액트 강사 프로필' },
  { id: 'inst2', name: '박타입',   specialty: '타입스크립트', courseCount: 8, rating: 4.97, reviewCount: 8205, color: '#7c3aed', ariaLabel: '박타입 강사 프로필' },
  { id: 'inst3', name: '최노드',   specialty: '백엔드',     courseCount: 15, rating: 4.95, reviewCount: 12340, color: '#16a34a', ariaLabel: '최노드 강사 프로필' },
  { id: 'inst4', name: '강도커',   specialty: '데브옵스',   courseCount: 6,  rating: 4.93, reviewCount: 9870,  color: '#f59e0b', ariaLabel: '강도커 강사 프로필' },
  { id: 'inst5', name: '오에이아이', specialty: 'AI 엔지니어링', courseCount: 4, rating: 4.96, reviewCount: 5430, color: '#dc2626', ariaLabel: '오에이아이 강사 프로필' },
  { id: 'inst6', name: '서모바일', specialty: '모바일',     courseCount: 9,  rating: 4.94, reviewCount: 7650,  color: '#06b6d4', ariaLabel: '서모바일 강사 프로필' },
];

const TESTIMONIALS = [
  { id: 'r1',  nickname: '리액트입문탈출',   title: '비전공자가 첫 프론트엔드 취업 성공기',         content: '강의를 듣기 전엔 React가 너무 어렵게 느껴졌는데, 이제는 직접 컴포넌트를 설계하고 사이드 프로젝트도 만들 수 있게 됐어요. 첫 회사 입사에 성공했습니다!' },
  { id: 'r2',  nickname: '백엔드성장기',     title: '신입 백엔드 개발자가 알아두면 좋은 NestJS 패턴', content: '막연하게 백엔드는 어렵다고만 생각했는데, 이 강의 덕분에 실무에서 쓰는 NestJS 패턴을 제대로 배울 수 있었습니다.' },
  { id: 'r3',  nickname: '주니어개발일기',   title: '비전공 주니어가 시니어로 성장하기까지',         content: '비전공이라 개발은 남의 이야기인 줄 알았어요. 강의에서 알려준 학습법을 꾸준히 실천했더니 시니어 트랙에 올라설 수 있었습니다. 정말 감사합니다.' },
  { id: 'r4',  nickname: '직장인개발자',     title: '직장인 10년차, 드디어 개발자로 전직했습니다',   content: '사무직만 하던 제가 코딩을 시작할 수 있게 됐어요. 강사님의 설명이 너무 명쾌해서 처음 듣는 개념도 쉽게 이해됐습니다.' },
  { id: 'r5',  nickname: '코드새싹',         title: '처음 접하는 분들도 쉽게 이해할 수 있는 강의',   content: '코딩을 처음 시작하는 입장에서 기초부터 차근차근 알려줘서 정말 도움이 많이 됐어요. 강의 퀄리티가 기대 이상입니다.' },
  { id: 'r6',  nickname: '풀스택도전기',     title: '마인드셋부터 실전까지, 완벽한 학습 로드맵',     content: '단순한 코딩 강의가 아니라 개발자 마인드셋부터 시작해서 실전 프로젝트까지 체계적으로 가르쳐줘요. 개발 인생이 달라졌습니다.' },
  { id: 'r7',  nickname: '코드분석러',       title: '복잡한 코드 베이스 분석이 이렇게 쉬울 수가 없어요', content: '복잡하게만 보였던 오픈소스 코드 읽기를 이렇게 단순하게 할 수 있다니 놀라웠어요. 매주 새로운 라이브러리를 분석하는 게 즐거워졌습니다.' },
  { id: 'r8',  nickname: '커리어성공기',     title: '개발 커리어를 시작하려는 모든 분에게 강력 추천', content: '연봉 협상부터 포트폴리오 작성까지 이 강의를 통해 본격적으로 개발자 커리어를 시작했어요. 강의 내용이 실용적이고 따라 하기 쉬워서 바로 적용할 수 있었습니다.' },
  { id: 'r9',  nickname: '주니어개발자',     title: '주니어에서 미들로, 인생을 바꿔준 강의',         content: '회사에 다니면서도 꾸준히 성장할 수 있다는 걸 이 강의에서 배웠어요. 지금은 매달 사이드 프로젝트를 출시하며 실력을 키워가고 있습니다.' },
  { id: 'r10', nickname: '처음엔반신반의',   title: '처음엔 반신반의했는데 결과가 달라졌습니다',     content: '솔직히 처음에는 \"이게 정말 될까?\" 싶었어요. 그런데 강의 내용을 하나하나 실천하다 보니 어느새 GitHub 잔디가 가득 차 있었습니다.' },
  { id: 'r11', nickname: '실무알짜정보',     title: '실전에서 바로 써먹을 수 있는 알짜 내용만 담겨 있어요', content: '다른 강의들은 이론만 많은데, 이 강의는 실제로 회사에서 쓸 수 있는 내용만 담겨 있어서 바로 실무에 적용할 수 있었습니다.' },
  { id: 'r12', nickname: '데브옵스시작',     title: '데브옵스 입문, 이 강의로 시작하세요',           content: '인프라는 무섭고 어렵다고만 생각했는데 강의를 들으니 생각보다 접근하기 쉬웠어요. 현재 첫 쿠버네티스 클러스터를 운영 중입니다!' },
];

// ── 2. homeData.json ─────────────────────────────────────────────────────────
{
  const home = readJSON('homeData.json');
  home.homeCategories.items = HOME_CATEGORIES;

  for (const sec of home.homeSections) {
    if (SECTION_TITLES[sec.title]) sec.title = SECTION_TITLES[sec.title];
  }

  // upcomingCourses + bestCourses share fields with COURSE_REMAP — sync them
  const syncCourseEntry = (e) => {
    const m = COURSE_REMAP[e.slug];
    if (!m) return e;
    e.title = m.title;
    e.thumbnailAlt = `${m.title} 강의 썸네일`;
    e.instructor = m.instructor;
    if ('category' in e) e.category = m.category;
    if ('categoryLabel' in e) {
      e.categoryLabel = (
        m.category === 'frontend' ? '프론트엔드' :
        m.category === 'backend' ? '백엔드' :
        m.category === 'mobile' ? '모바일' :
        m.category === 'devops' ? '데브옵스' :
        m.category === 'data' ? '데이터' :
        m.category === 'ai' ? 'AI 엔지니어링' :
        m.category === 'cs' ? 'CS·알고리즘' :
        m.category === 'design' ? '디자인 시스템' :
        m.category === 'career' ? '개발자 커리어' : '강의'
      );
    }
    e.tags = m.tags.slice(0, e.tags?.length || 2);
    return e;
  };
  home.upcomingCourses = home.upcomingCourses.map(syncCourseEntry);
  home.bestCourses = home.bestCourses.map(syncCourseEntry);

  home.bestChipCategories = BEST_CHIP_CATEGORIES;

  home.testimonials.meta.title = 'LectureHub 수강생 후기';
  home.testimonials.meta.description = '나도 할 수 있을까? 고민이 된다면 수강생들의 성장 경험을 들어보세요.';
  home.testimonials.items = home.testimonials.items.map((t, i) => ({
    ...t,
    nickname: TESTIMONIALS[i].nickname,
    title: TESTIMONIALS[i].title,
    content: TESTIMONIALS[i].content,
    ariaLabel: `${TESTIMONIALS[i].nickname} 님의 수강 후기`,
  }));

  // popularArticles / homeBestArticles / homeCommunity → generic dev article titles
  const ARTICLE_TITLES = [
    '비전공자가 6개월 만에 첫 개발자 취업에 성공한 비결',
    '주니어 개발자가 시니어로 성장하기 위한 5가지 습관',
    '실무에서 자주 쓰이는 React 패턴 베스트 10',
    '백엔드 개발자가 알아두면 좋은 데이터베이스 인덱스 정리',
    '코드 리뷰가 두려운 주니어를 위한 실전 가이드',
  ];
  home.popularArticles.featured.title = ARTICLE_TITLES[0];
  home.popularArticles.featured.thumbnailAlt = `${ARTICLE_TITLES[0]} 아티클 이미지`;
  home.popularArticles.featured.authorNickname = '신블로그';
  home.popularArticles.featured.category = '님의';
  home.popularArticles.featured.ariaLabel = `1위 인기 아티클: ${ARTICLE_TITLES[0]}`;
  home.popularArticles.ranked = home.popularArticles.ranked.map((r, i) => ({
    ...r,
    title: ARTICLE_TITLES[i + 1] || ARTICLE_TITLES[0],
    authorNickname: '신블로그',
    category: '님의',
    ariaLabel: `${r.rank}위 인기 아티클`,
  }));
  const CARD_TITLES = [
    '시니어 개발자가 매일 실천하는 3가지 습관',
    '코드 품질을 높이는 시니어들의 6가지 코드 리뷰 전략',
    '주니어가 시니어로 성장하기 위한 학습 로드맵',
  ];
  home.popularArticles.cards = home.popularArticles.cards.map((c, i) => ({
    ...c,
    authorNickname: '강아키텍트',
    category: '개발',
    title: CARD_TITLES[i] || CARD_TITLES[0],
    content: '실력 있는 개발자들이 공통적으로 가지고 있는 습관과 학습 방법, 그리고 코드 리뷰 문화에 대한 인사이트를 공유합니다. 매일 조금씩 실천 가능한 구체적인 가이드를 정리했어요.',
    thumbnailAlt: `${CARD_TITLES[i] || CARD_TITLES[0]} 아티클 이미지`,
    ariaLabel: `강아키텍트 님의 아티클: ${CARD_TITLES[i] || CARD_TITLES[0]}`,
  }));

  const BEST_ARTICLE_TITLES = [
    '오프라인 특강 - 모던 자바스크립트 핵심',
    '코드 품질을 무너뜨리는 5가지 안티 패턴',
    '주니어 개발자가 흔히 빠지는 3가지 함정',
    '리팩터링이 두려운 개발자를 위한 안전 장치',
    '대규모 코드 베이스를 처음 만났을 때의 생존 가이드',
  ];
  home.homeBestArticles.articles = home.homeBestArticles.articles.map((a, i) => ({
    ...a,
    title: BEST_ARTICLE_TITLES[i] || BEST_ARTICLE_TITLES[0],
    thumbnailAlt: `${BEST_ARTICLE_TITLES[i] || BEST_ARTICLE_TITLES[0]} 썸네일`,
    ariaLabel: `${a.rank}위 베스트 인기글: ${BEST_ARTICLE_TITLES[i] || BEST_ARTICLE_TITLES[0]}`,
  }));

  home.homeInstructors.instructors = HOME_INSTRUCTORS;

  // Promo banners — give them meaningful titles
  const PROMO_TITLES = [
    '신규 회원 첫 강의 무료 이벤트',
    '프론트엔드 로드맵 강의 30% 할인',
    '백엔드 풀패키지 한정 할인',
    '데브옵스 입문 강의 오픈 기념',
    'AI 사이드 프로젝트 챌린지 모집',
    '커리어 멘토링 프리미엄 개강',
  ];
  home.homePromoBanners.banners = home.homePromoBanners.banners.map((b, i) => ({
    ...b,
    title: PROMO_TITLES[i] || PROMO_TITLES[0],
    thumbnailAlt: PROMO_TITLES[i] || PROMO_TITLES[0],
    ariaLabel: `프로모션 배너: ${PROMO_TITLES[i] || PROMO_TITLES[0]}`,
  }));

  home.ctaBanner.title = '지금 시작하면, 첫 강의 무료';
  home.ctaBanner.description = '회원가입만 해도 베스트 IT 강의 1개를 무료로 수강할 수 있습니다';

  writeJSON('homeData.json', deepRewriteImages(home));
  console.log('✅ homeData.json');
}

// ── 3. communityData.json ────────────────────────────────────────────────────
{
  const cm = readJSON('communityData.json');

  // sidebarProfile
  cm.sidebarProfile.dummyUser.nickname = '코드굽는사람';
  cm.sidebarProfile.dummyUser.role = '개발자 멘토';
  cm.sidebarProfile.dummyUser.statValues = {
    investGrade: '시니어',
    expertise: '프론트엔드',
    investPeriod: '10년차',
  };
  cm.sidebarProfile.stats = [
    { key: 'investGrade', label: '개발자 등급' },
    { key: 'expertise', label: '전문분야' },
    { key: 'investPeriod', label: '개발 경력' },
  ];

  // sidebarNav rename
  for (const item of cm.sidebarNav) {
    if (item.id === 'expert-insight') item.title = '전문가 인사이트';
    if (item.id === 'investment-review') item.title = '학습 후기';
    if (item.id === 'challenge') item.title = 'LectureHub 챌린지';
    if (item.id === 'notice') {
      item.items = [
        { id: 'notice-schedule', label: '강의일정' },
        { id: 'notice-promo', label: '할인 및 프로모션' },
        { id: 'notice-newcourse', label: '신규강의배포' },
        { id: 'notice-event', label: '이벤트/시즌' },
      ];
    }
  }

  // feedSections
  for (const fs of cm.feedSections) {
    if (fs.id === 'series') fs.title = 'LectureHub 시리즈';
    if (fs.id === 'qna') fs.title = '개발 Q&A';
  }

  // dummyPopularPosts
  const POP_POSTS = [
    '주니어 개발자가 자주 묻는 질문 TOP 10',
    'D-day 30일, 신입 개발자 첫 코드 리뷰 준비법',
    '실무에서 자주 쓰는 React 훅 베스트 정리',
    '비전공자 신입 개발자 첫 회사 적응기',
    '주말 안에 끝내는 사이드 프로젝트 아이디어 5선',
  ];
  cm.dummyPopularPosts = cm.dummyPopularPosts.map((p, i) => ({
    ...p,
    title: POP_POSTS[i] || POP_POSTS[0],
    authorNickname: '코드굽는사람',
    category: '코드굽는사람',
  }));

  // dummySeriesCards
  cm.dummySeriesCards = cm.dummySeriesCards.map((c, i) => ({
    ...c,
    thumbnailAlt: `LectureHub 시리즈 썸네일 ${i + 1}`,
    title: i === 0 ? '주니어 개발자 성장 시리즈' : '시니어가 알려주는 코드 리뷰 시리즈',
    description: '경력별로 마주치는 고민과 성장 포인트를 시리즈로 정리했습니다. 주니어부터 시니어까지 단계별 학습 가이드를 제공합니다.',
    tags: ['#개발자성장', '#커리어'],
  }));

  // dummyArticles
  const ARTICLE_TITLES = [
    '시니어가 직접 알려주는 코드 리뷰의 정석 - [실전편]',
    '"이렇게 코드 짜면 안 됩니다" 흔한 안티 패턴 정리',
    '[실무공유] 백엔드 API 100개 만들 때 꼭 알아야 할 것',
    'D-day 30일, 신입 개발자 코드 리뷰 준비 가이드',
  ];
  cm.dummyArticles = cm.dummyArticles.map((a, i) => ({
    ...a,
    authorNickname: '강아키텍트',
    title: ARTICLE_TITLES[i] || ARTICLE_TITLES[0],
    description: '시니어 개발자가 실무에서 직접 겪은 사례를 바탕으로 정리한 인사이트입니다. 코드 품질, 협업, 커리어에 대한 구체적인 가이드를 함께 다룹니다.',
    thumbnailAlt: `전문가 칼럼 썸네일 ${i + 1}`,
  }));

  // dummyQnaPosts
  const QNA_TITLES = [
    'Promise와 async/await 차이가 헷갈려요',
    'TypeScript 제네릭은 어떤 상황에 써야 하나요?',
    '리팩터링은 언제 시작해야 할까요?',
    'Git 리베이스와 머지 중 어떤 걸 써야 하나요?',
    '신입 개발자 사이드 프로젝트 추천 부탁드려요',
  ];
  cm.dummyQnaPosts = cm.dummyQnaPosts.map((p, i) => ({
    ...p,
    title: QNA_TITLES[i] || QNA_TITLES[0],
    answererNickname: '강아키텍트',
  }));

  // dummyRecommendedProfiles
  const PROFILES = [
    { nickname: '코드굽는사람',   followerCount: '팔로워 35,502' },
    { nickname: '시니어개발일기', followerCount: '팔로워 22,145' },
    { nickname: '주니어성장기',   followerCount: '팔로워 520' },
    { nickname: '강아키텍트',     followerCount: '팔로워 62,940' },
    { nickname: '데브옵스러버',   followerCount: '팔로워 442' },
  ];
  cm.dummyRecommendedProfiles = cm.dummyRecommendedProfiles.map((p, i) => ({
    ...p,
    nickname: PROFILES[i].nickname,
    followerCount: PROFILES[i].followerCount,
  }));

  // dummyCommentRanking
  const RANKING = ['코드굽는사람', '리팩터링장인', '주말사이드프로젝트'];
  cm.dummyCommentRanking = cm.dummyCommentRanking.map((r, i) => ({ ...r, nickname: RANKING[i] }));

  // searchFilters scope default
  cm.searchFilters.scopeDefault = '전체 + 제목 + 내용';

  writeJSON('communityData.json', deepRewriteImages(cm));
  console.log('✅ communityData.json');
}

// ── 4. accountData.json ──────────────────────────────────────────────────────
{
  const ac = readJSON('accountData.json');

  ac.expiredCoupons = [
    { id: 'cpn-expired-1', amount: 30000, description: '[오픈알림 혜택] 프론트엔드 입문반 단 하루 3만원 쿠폰', validFrom: '2026.02.27', validTo: '2026.02.27', status: '기간만료' },
    { id: 'cpn-expired-2', amount: 20000, description: '[오픈알림 혜택 특별연장] 백엔드 기초반 2만원 쿠폰', validFrom: '2026.02.28', validTo: '2026.03.02', status: '기간만료' },
  ];

  ac.giftcards = [
    { id: 'gc-001', name: 'LectureHub 수강 상품권', balance: 50000, originalAmount: 50000, validFrom: '2026-01-15', validTo: '2026-07-15', status: 'active' },
    { id: 'gc-002', name: '신규가입 축하 상품권',     balance: 10000, originalAmount: 30000, validFrom: '2026-02-01', validTo: '2026-05-01', status: 'active' },
    { id: 'gc-003', name: '이벤트 당첨 상품권',       balance: 0,     originalAmount: 20000, validFrom: '2025-11-01', validTo: '2026-02-01', status: 'used' },
  ];

  ac.giftcardHistory = ac.giftcardHistory.map((h) => ({
    ...h,
    description: h.description
      .replace('재테크 기초반', '코딩테스트 기초반')
      .replace('열반스쿨 수강 상품권', 'LectureHub 수강 상품권')
      .replace('부동산 입문반', '프론트엔드 입문반'),
  }));

  const FOLLOWERS = [
    { nickname: '리액트장인',      bio: '10년차 프론트엔드 개발자', verified: true },
    { nickname: '백엔드초보탈출',  bio: 'Spring/NestJS 공부중인 직장인', verified: false },
    { nickname: '데이터과학생',    bio: '데이터 분석 전공 대학원생', verified: true },
    { nickname: '주말사이드프로젝트', bio: '매주 사이드 프로젝트 출시 기록', verified: false },
  ];
  ac.followers = ac.followers.map((f, i) => ({ ...f, ...FOLLOWERS[i] }));

  const FOLLOWING = [
    { nickname: '시니어개발자박코치', bio: '풀스택 개발 멘토 15년차', verified: true },
    { nickname: '클라우드아키텍트이대표', bio: 'AWS 솔루션 아키텍트', verified: true },
    { nickname: '데브옵스의신',        bio: 'CI/CD & 인프라 자동화 팁 공유', verified: false },
  ];
  ac.following = ac.following.map((f, i) => ({ ...f, ...FOLLOWING[i] }));

  if (ac.mypage?.classroom) ac.mypage.classroom.promoBannerAlt = 'LectureHub 프로모션 배너';
  ac.profileCard.otherUserMode.infoRows = [
    { key: 'followers', label: '팔로워' },
    { key: 'specialty', label: '전문분야' },
    { key: 'experience', label: '개발 경력' },
  ];

  writeJSON('accountData.json', deepRewriteImages(ac));
  console.log('✅ accountData.json');
}

// ── 5. siteData.json ─────────────────────────────────────────────────────────
{
  const site = readJSON('siteData.json');

  // nav.main rebrand
  site.nav.main = [
    { label: '카테고리', href: '/courses', ariaLabel: '카테고리별 강의 보기' },
    { label: '프론트엔드', href: '/courses/real-estate-basic-class', ariaLabel: '프론트엔드 입문 강의 상세 보기' },
    { label: '오리지널', href: '/courses?category=original', ariaLabel: '오리지널 강의 보기' },
    { label: '베스트', href: '/best', ariaLabel: '베스트 강의 보기' },
    { label: '커리큘럼', href: '/curriculum', ariaLabel: '커리큘럼 보기' },
    { label: '오픈예정', href: '/upcoming', ariaLabel: '오픈예정 강의 보기' },
  ];

  // categoryMenu.groups
  site.nav.categoryMenu.groups = [
    {
      label: '오리지널', href: '/courses?category=original',
      items: [
        { label: '오리지널 정규', href: '/courses?category=original&sub=regular' },
        { label: '프론트엔드 부트캠프', href: '/courses?category=original&sub=frontend-bootcamp' },
        { label: '백엔드 부트캠프', href: '/courses?category=original&sub=backend-bootcamp' },
        { label: '풀스택 마스터', href: '/courses?category=original&sub=fullstack' },
      ],
    },
    {
      label: '프론트엔드', href: '/courses?category=frontend',
      items: [
        { label: '입문 (HTML/CSS/JS)', href: '/courses?category=frontend&sub=basic' },
        { label: 'React', href: '/courses?category=frontend&sub=react' },
        { label: 'Vue', href: '/courses?category=frontend&sub=vue' },
        { label: 'Next.js', href: '/courses?category=frontend&sub=nextjs' },
        { label: 'TypeScript', href: '/courses?category=frontend&sub=typescript' },
      ],
    },
    {
      label: '백엔드', href: '/courses?category=backend',
      items: [
        { label: 'Node.js / NestJS', href: '/courses?category=backend&sub=node' },
        { label: 'Spring', href: '/courses?category=backend&sub=spring' },
        { label: '데이터베이스', href: '/courses?category=backend&sub=database' },
        { label: '마이크로서비스', href: '/courses?category=backend&sub=msa' },
      ],
    },
    {
      label: '데브옵스 · 클라우드', href: '/courses?category=devops',
      items: [
        { label: 'Docker · Kubernetes', href: '/courses?category=devops&sub=docker' },
        { label: 'AWS · GCP', href: '/courses?category=devops&sub=cloud' },
        { label: 'CI/CD', href: '/courses?category=devops&sub=cicd' },
      ],
    },
    {
      label: '커리어 · 도서모임', href: '/courses?category=career',
      items: [
        { label: '개발자 도서모임', href: '/courses?category=career&sub=book-club' },
      ],
    },
  ];

  // footer mainLinks
  site.footer.mainLinks = [
    { label: '카테고리', href: '/courses', ariaLabel: '카테고리별 강의 보기' },
    { label: '프론트엔드', href: '/courses/real-estate-basic-class', ariaLabel: '프론트엔드 입문 강의 상세 보기' },
    { label: '오리지널', href: '/courses?category=original', ariaLabel: '오리지널 강의 보기' },
    { label: '베스트', href: '/best', ariaLabel: '베스트 강의 보기' },
    { label: '커리큘럼', href: '/curriculum', ariaLabel: '커리큘럼 보기' },
    { label: '오픈예정', href: '/upcoming', ariaLabel: '오픈예정 강의 보기' },
    { label: '커뮤니티', href: '/community', ariaLabel: '커뮤니티로 이동' },
  ];

  site.footer.copyright = '© LECTUREHUB. ALL RIGHTS RESERVED.';

  writeJSON('siteData.json', deepRewriteImages(site));
  console.log('✅ siteData.json');
}

// ── 6. pagesData.json ────────────────────────────────────────────────────────
{
  const pg = readJSON('pagesData.json');

  pg.courses.list.categories = [
    { value: '', label: '전체' },
    { value: 'original', label: '오리지널' },
    { value: 'frontend', label: '프론트엔드' },
    { value: 'backend', label: '백엔드' },
    { value: 'mobile', label: '모바일' },
    { value: 'devops', label: '데브옵스' },
    { value: 'data', label: '데이터' },
    { value: 'ai', label: 'AI' },
    { value: 'cs', label: 'CS·알고리즘' },
    { value: 'design', label: '디자인' },
    { value: 'career', label: '커리어' },
  ];

  pg.courses.detail.categoryLabels = {
    frontend: '프론트엔드',
    backend: '백엔드',
    mobile: '모바일',
    devops: '데브옵스',
    data: '데이터',
    ai: 'AI 엔지니어링',
    cs: 'CS·알고리즘',
    design: '디자인',
    career: '개발자 커리어',
  };

  pg.courses.detail.banners = {
    '': { src: '/images/banners/course-banner.svg', alt: '강의 프로모션 배너' },
    frontend: { src: '/images/banners/course-banner.svg', alt: '프론트엔드 강의 배너' },
    backend: { src: '/images/banners/course-banner.svg', alt: '백엔드 강의 배너' },
    devops: { src: '/images/banners/course-banner.svg', alt: '데브옵스 강의 배너' },
    original: { src: '/images/banners/course-banner.svg', alt: '오리지널 강의 배너' },
  };

  pg.curriculum.steps = [
    { step: 1, title: '입문 클래스',   subtitle: '개발자가 되기 위한 첫 걸음', courseCount: 3 },
    { step: 2, title: '중급 클래스',   subtitle: '실무에서 바로 쓰는 핵심 기술', courseCount: 2 },
    { step: 3, title: '실전 클래스',   subtitle: '실전 프로젝트로 성장하는 개발자', courseCount: 2 },
    { step: 4, title: '마스터 클래스', subtitle: '시니어 개발자로 도약하는 길',  courseCount: 1 },
  ];

  pg.curriculum.roadmap = [
    {
      goal: '개발자가 되고 싶다면?',
      highlight: '',
      items: ['웹 개발 기초반', '자바스크립트 기초반', '프론트엔드 실전반'],
    },
    {
      goal: '실무 개발자로 성장하고 싶다면?',
      highlight: '실전 프로젝트 완성!',
      items: ['React 고급 패턴', 'NestJS 백엔드', 'Next.js 풀스택', 'TypeScript 심화', 'Git 협업 마스터'],
    },
    {
      goal: '시니어 개발자로 도약하고 싶다면',
      highlight: '아키텍처 설계 역량!',
      items: ['마이크로서비스 아키텍처', '도커·쿠버네티스', 'CI/CD 데브옵스'],
    },
  ];

  pg.curriculum.footer = {
    title: '실무 개발자가 되는 가장 빠른 길',
    cards: [
      '비전공자도 개발자로 성장할 수 있는\n체계적인 학습 시스템',
      '수강생을 시니어 개발자로 키우는\n실효적이고 구체적인 강의',
      '국내 유일! 직장인을 위한\n주말·저녁 라이브 코칭',
      '함께 성장하는 동료가 있는\n프로젝트 기반 커뮤니티',
    ],
  };

  // SEO copy on each page that mentions the brand
  pg.home.seo.description = '실무 중심의 IT/개발 강의를 만나보세요.';
  pg.home.seo.og.description = '실무 중심의 IT/개발 강의 플랫폼';
  pg.home.hero.subtitle = '실무에서 바로 쓰는 IT/개발 기술을 배워보세요';

  writeJSON('pagesData.json', deepRewriteImages(pg));
  console.log('✅ pagesData.json');
}

console.log('🎉 rebranding complete');
