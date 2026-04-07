/**
 * SVG asset generator — creates branded placeholder banners/thumbnails for the LMS template.
 * Run: node scripts/generate-assets.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const ensure = (p) => mkdirSync(dirname(p), { recursive: true });
const writeBoth = (rel, content) => {
  const a = join(ROOT, 'public', rel);
  const b = join(ROOT, 'assets', rel);
  ensure(a); writeFileSync(a, content);
  ensure(b); writeFileSync(b, content);
};
const writePublic = (rel, content) => {
  const a = join(ROOT, 'public', rel);
  ensure(a); writeFileSync(a, content);
};

// ── 11 themed banners (1200x630, 16:9-ish) ────────────────────────────────────
// Each banner = gradient background + geometric shape + topic label + tech glyph.
const BANNERS = [
  { id: 1,  topic: 'React',         tag: 'FRONTEND',  glyph: '⚛',   c1: '#0ea5e9', c2: '#1e3a8a', accent: '#7dd3fc' },
  { id: 2,  topic: 'TypeScript',    tag: 'LANGUAGE',  glyph: 'TS',  c1: '#1e40af', c2: '#0f172a', accent: '#60a5fa' },
  { id: 3,  topic: 'Design System', tag: 'DESIGN',    glyph: '◑',   c1: '#7c3aed', c2: '#312e81', accent: '#c4b5fd' },
  { id: 4,  topic: 'Next.js',       tag: 'FULLSTACK', glyph: 'N',   c1: '#0f172a', c2: '#1e293b', accent: '#94a3b8' },
  { id: 5,  topic: 'Vue 3',         tag: 'FRONTEND',  glyph: 'V',   c1: '#16a34a', c2: '#064e3b', accent: '#86efac' },
  { id: 6,  topic: 'NestJS',        tag: 'BACKEND',   glyph: '◆',   c1: '#dc2626', c2: '#7f1d1d', accent: '#fca5a5' },
  { id: 7,  topic: 'HTML · CSS',    tag: 'WEB BASIC', glyph: '</>', c1: '#f97316', c2: '#9a3412', accent: '#fed7aa' },
  { id: 8,  topic: 'Docker · K8s',  tag: 'DEVOPS',    glyph: '🐳',  c1: '#0891b2', c2: '#155e75', accent: '#67e8f9' },
  { id: 9,  topic: 'AWS Cloud',     tag: 'CLOUD',     glyph: '☁',   c1: '#f59e0b', c2: '#78350f', accent: '#fde68a' },
  { id: 10, topic: 'AI Engineering',tag: 'AI',        glyph: '✦',   c1: '#db2777', c2: '#581c87', accent: '#f9a8d4' },
  { id: 11, topic: 'Flutter',       tag: 'MOBILE',    glyph: 'F',   c1: '#06b6d4', c2: '#0e7490', accent: '#a5f3fc' },
];

const bannerSvg = ({ id, topic, tag, glyph, c1, c2, accent }) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${topic} 강의 배너">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
    <radialGradient id="glow${id}" cx="0.8" cy="0.2" r="0.8">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg${id})"/>
  <rect width="1200" height="630" fill="url(#glow${id})"/>
  <g opacity="0.18" stroke="${accent}" stroke-width="1.5" fill="none">
    <circle cx="980" cy="140" r="180"/>
    <circle cx="980" cy="140" r="120"/>
    <circle cx="980" cy="140" r="60"/>
    <path d="M 0 480 Q 300 380 600 480 T 1200 480"/>
    <path d="M 0 540 Q 300 440 600 540 T 1200 540"/>
  </g>
  <g font-family="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif">
    <text x="80" y="180" font-size="28" font-weight="600" fill="${accent}" letter-spacing="6">${tag}</text>
    <text x="80" y="320" font-size="96" font-weight="800" fill="#ffffff">${topic}</text>
    <text x="80" y="380" font-size="26" font-weight="500" fill="#ffffff" opacity="0.85">실무 중심의 온라인 강의 · LectureHub</text>
    <text x="1050" y="560" font-size="180" font-weight="900" fill="#ffffff" opacity="0.18" text-anchor="middle">${glyph}</text>
  </g>
</svg>
`;

for (const b of BANNERS) {
  writeBoth(`images/banners/banner${b.id}.svg`, bannerSvg(b));
}

// ── Top promo belt (narrow strip) ─────────────────────────────────────────────
const beltSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 80" preserveAspectRatio="xMidYMid slice" role="img" aria-label="프로모션 띠 배너">
  <defs>
    <linearGradient id="beltbg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="0.5" stop-color="#1e3a8a"/>
      <stop offset="1" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="80" fill="url(#beltbg)"/>
  <g font-family="ui-sans-serif, system-ui, sans-serif" fill="#ffffff">
    <text x="800" y="50" font-size="26" font-weight="700" text-anchor="middle">🚀  지금 회원가입하면 첫 강의 무료 — LectureHub  ·  실무 중심 IT/개발 교육</text>
  </g>
</svg>
`;
writeBoth('images/banners/banner-belt.svg', beltSvg);

// ── Course detail default banner ──────────────────────────────────────────────
const courseBannerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 360" preserveAspectRatio="xMidYMid slice" role="img" aria-label="강의 상세 배너">
  <defs>
    <linearGradient id="cb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1e293b"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="360" fill="url(#cb)"/>
  <g opacity="0.35" stroke="#38bdf8" fill="none" stroke-width="1.2">
    <path d="M 0 260 Q 400 160 800 260 T 1600 260"/>
    <path d="M 0 300 Q 400 200 800 300 T 1600 300"/>
  </g>
  <g font-family="ui-monospace, 'SFMono-Regular', Menlo, monospace" fill="#94a3b8" font-size="20">
    <text x="80" y="100">$ npm run learn</text>
    <text x="80" y="140" fill="#7dd3fc">→ Welcome to LectureHub</text>
    <text x="80" y="180" fill="#cbd5e1">학습은 코드로 증명된다.</text>
  </g>
  <text x="1480" y="320" font-family="ui-sans-serif, system-ui, sans-serif" font-size="28" font-weight="700" fill="#ffffff" opacity="0.6" text-anchor="end">LectureHub</text>
</svg>
`;
writeBoth('images/banners/course-banner.svg', courseBannerSvg);

// ── Mypage banner ─────────────────────────────────────────────────────────────
const mypageBannerSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="마이페이지 배너">
  <defs>
    <linearGradient id="mp" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#312e81"/>
      <stop offset="1" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="240" fill="url(#mp)"/>
  <g opacity="0.25" fill="#ffffff">
    <circle cx="1300" cy="120" r="160"/>
    <circle cx="1480" cy="60" r="60"/>
  </g>
  <g font-family="ui-sans-serif, system-ui, sans-serif" fill="#ffffff">
    <text x="80" y="110" font-size="24" font-weight="600" opacity="0.85">MY LEARNING</text>
    <text x="80" y="170" font-size="44" font-weight="800">오늘도 한 줄, 한 강의씩 성장하기</text>
  </g>
</svg>
`;
writeBoth('images/banners/mypage-banner.svg', mypageBannerSvg);

// ── OG images ─────────────────────────────────────────────────────────────────
const ogSvg = (title, subtitle) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="ogbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e3a8a"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#ogbg)"/>
  <g opacity="0.3" fill="#38bdf8">
    <circle cx="950" cy="160" r="180"/>
    <circle cx="120" cy="520" r="140"/>
  </g>
  <g font-family="ui-sans-serif, system-ui, sans-serif" fill="#ffffff">
    <text x="80" y="280" font-size="32" font-weight="600" opacity="0.85" letter-spacing="4">LECTUREHUB</text>
    <text x="80" y="380" font-size="76" font-weight="800">${title}</text>
    <text x="80" y="450" font-size="30" font-weight="500" opacity="0.85">${subtitle}</text>
  </g>
</svg>
`;
writePublic('images/banners/og-default.svg', ogSvg('실무 중심 IT 교육', '개발자로 성장하는 가장 빠른 길'));
writePublic('images/banners/og-home.svg', ogSvg('LectureHub', '프론트엔드 · 백엔드 · 데브옵스 · AI'));

// ── Profile avatars (5) ───────────────────────────────────────────────────────
const avatarColors = [
  ['#0ea5e9', '#1e3a8a'],
  ['#7c3aed', '#312e81'],
  ['#16a34a', '#064e3b'],
  ['#f59e0b', '#7c2d12'],
  ['#db2777', '#581c87'],
];
const initials = ['DV', 'CD', 'AI', 'OP', 'UX'];
avatarColors.forEach(([c1, c2], i) => {
  const id = i + 1;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="프로필 이미지 ${id}">
  <defs><linearGradient id="av${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="200" height="200" rx="100" fill="url(#av${id})"/>
  <text x="100" y="125" text-anchor="middle" font-family="ui-sans-serif, system-ui, sans-serif" font-size="72" font-weight="800" fill="#ffffff">${initials[i]}</text>
</svg>
`;
  writePublic(`images/testIMG/profile${id}.svg`, svg);
});

// ── Verified bluecheck icon ──────────────────────────────────────────────────
const blueCheck = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-label="인증 뱃지">
  <path fill="#1d9bf0" d="M22 12l-2.4-2.8.4-3.7-3.6-.8-1.9-3.2L11 3l-3.5-1.5-1.9 3.2-3.6.8.4 3.7L0 12l2.4 2.8-.4 3.7 3.6.8 1.9 3.2L11 21l3.5 1.5 1.9-3.2 3.6-.8-.4-3.7L22 12z"/>
  <path d="M9.5 16.2L5.8 12.5l1.4-1.4 2.3 2.3 6.3-6.3 1.4 1.4-7.7 7.7z" fill="#ffffff"/>
</svg>
`;
writePublic('images/community/Bluecheck.svg', blueCheck);

console.log('✅ generated SVG assets');
