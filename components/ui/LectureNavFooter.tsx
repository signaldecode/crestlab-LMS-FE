/**
 * 강의 하단 네비게이션 푸터 (LectureNavFooter)
 * - 이전 강의 / 다음 강의 이동 버튼
 * - 현재 강의 완료("봤어요") 버튼
 * - 강의 제목과 진행 상태 표시
 */

'use client';

interface LectureNavFooterProps {
  prevLecture?: { id: string; title: string } | null;
  nextLecture?: { id: string; title: string } | null;
  isCompleted?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  onMarkComplete?: () => void;
}

export default function LectureNavFooter({
  prevLecture = null,
  nextLecture = null,
  isCompleted = false,
  onPrev,
  onNext,
  onMarkComplete,
}: LectureNavFooterProps) {
  return (
    <footer className="lecture-nav-footer">
      {/* 이전 강의 */}
      <div className="lecture-nav-footer__left">
        <button
          className="lecture-nav-footer__btn lecture-nav-footer__btn--prev"
          onClick={onPrev}
          disabled={!prevLecture}
          aria-label={prevLecture ? `이전 강의: ${prevLecture.title}` : '이전 강의 없음'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
          <span>이전</span>
        </button>
      </div>

      {/* 가운데: 다음 강의 정보 */}
      <div className="lecture-nav-footer__center">
        {nextLecture && (
          <span className="lecture-nav-footer__next-info">
            다음: {nextLecture.title}
          </span>
        )}
      </div>

      {/* 오른쪽: 다음 + 봤어요 */}
      <div className="lecture-nav-footer__right">
        <button
          className="lecture-nav-footer__btn lecture-nav-footer__btn--next"
          onClick={onNext}
          disabled={!nextLecture}
          aria-label={nextLecture ? `다음 강의: ${nextLecture.title}` : '다음 강의 없음'}
        >
          <span>다음</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
          </svg>
        </button>

        <button
          className={`lecture-nav-footer__btn lecture-nav-footer__btn--complete ${isCompleted ? 'lecture-nav-footer__btn--completed' : ''}`}
          onClick={onMarkComplete}
          aria-label={isCompleted ? '수강 완료됨' : '수강 완료로 표시'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <span>{isCompleted ? '완료됨' : '봤어요'}</span>
        </button>
      </div>
    </footer>
  );
}
