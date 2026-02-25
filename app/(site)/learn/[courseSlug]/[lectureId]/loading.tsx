/**
 * 강의 플레이어 스켈레톤 UI (loading.tsx)
 * - 강의 플레이어 페이지가 로드되는 동안 표시되는 스켈레톤 로딩 상태
 * - 상단바 / 비디오 영역 / 사이드바 / 컨트롤바 / 하단 네비게이션 구조
 * - Next.js App Router의 loading.jsx 컨벤션을 활용한다
 */

import Skeleton from '@/components/ui/Skeleton';

export default function LecturePlayerLoading() {
  return (
    <div className="lp-skeleton" role="status" aria-label="강의 플레이어를 불러오는 중">

      {/* ── 상단 헤더바 ── */}
      <header className="lp-skeleton__header">
        <div className="lp-skeleton__header-left">
          <Skeleton variant="rect" width={32} height={32} className="lp-skeleton__back-btn" />
          <Skeleton variant="text" width={240} height={18} />
        </div>
        <div className="lp-skeleton__header-right">
          <Skeleton variant="rect" width={100} height={36} className="lp-skeleton__review-btn" />
          <Skeleton variant="circle" width={36} height={36} />
        </div>
      </header>

      {/* ── 메인 콘텐츠 (비디오 + 사이드바) ── */}
      <div className="lp-skeleton__body">

        {/* 비디오 영역 */}
        <div className="lp-skeleton__video-area">
          <div className="lp-skeleton__video">
            <Skeleton variant="rect" width="100%" height="100%" className="lp-skeleton__video-placeholder" />
          </div>

          {/* 비디오 컨트롤 바 */}
          <div className="lp-skeleton__controls">
            <div className="lp-skeleton__controls-left">
              <Skeleton variant="rect" width={28} height={28} />
              <Skeleton variant="rect" width={28} height={28} />
              <Skeleton variant="text" width={90} height={14} />
            </div>
            <div className="lp-skeleton__controls-center">
              <Skeleton variant="text" width={120} height={14} />
            </div>
            <div className="lp-skeleton__controls-right">
              <Skeleton variant="rect" width={28} height={28} />
              <Skeleton variant="rect" width={28} height={28} />
              <Skeleton variant="rect" width={28} height={28} />
              <Skeleton variant="rect" width={28} height={28} />
              <Skeleton variant="rect" width={28} height={28} />
            </div>
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <aside className="lp-skeleton__sidebar">
          {/* 사이드바 탭 아이콘들 */}
          <nav className="lp-skeleton__sidebar-tabs">
            {['커리큘럼', 'Q&A', '노트', '채팅', '스크립트'].map((label) => (
              <div key={label} className="lp-skeleton__sidebar-tab">
                <Skeleton variant="rect" width={24} height={24} />
                <Skeleton variant="text" width={40} height={10} />
              </div>
            ))}
          </nav>

          {/* 사이드바 콘텐츠 (커리큘럼 목록) */}
          <div className="lp-skeleton__sidebar-content">
            {/* 섹션 헤더 */}
            <div className="lp-skeleton__curriculum-header">
              <Skeleton variant="text" width="70%" height={16} />
              <Skeleton variant="text" width="30%" height={12} />
            </div>

            {/* 강의 목록 아이템들 */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="lp-skeleton__curriculum-item">
                <Skeleton variant="rect" width={18} height={18} className="lp-skeleton__check-icon" />
                <div className="lp-skeleton__curriculum-info">
                  <Skeleton variant="text" width={`${75 - i * 5}%`} height={14} />
                  <Skeleton variant="text" width={50} height={11} />
                </div>
              </div>
            ))}

            {/* 섹션 구분 */}
            <div className="lp-skeleton__curriculum-divider" />

            <div className="lp-skeleton__curriculum-header">
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="25%" height={12} />
            </div>

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`s2-${i}`} className="lp-skeleton__curriculum-item">
                <Skeleton variant="rect" width={18} height={18} className="lp-skeleton__check-icon" />
                <div className="lp-skeleton__curriculum-info">
                  <Skeleton variant="text" width={`${70 - i * 8}%`} height={14} />
                  <Skeleton variant="text" width={50} height={11} />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ── 하단 네비게이션 바 ── */}
      <footer className="lp-skeleton__footer">
        <Skeleton variant="rect" width={80} height={40} className="lp-skeleton__nav-btn" />
        <div className="lp-skeleton__footer-center">
          <Skeleton variant="text" width={160} height={14} />
        </div>
        <div className="lp-skeleton__footer-right">
          <Skeleton variant="rect" width={80} height={40} className="lp-skeleton__nav-btn" />
          <Skeleton variant="rect" width={100} height={40} className="lp-skeleton__complete-btn" />
        </div>
      </footer>
    </div>
  );
}
