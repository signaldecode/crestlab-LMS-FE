/**
 * 베스트 강의 카드 스켈레톤 (BestCourseCardSkeleton)
 * - 데이터 로딩 전 플레이스홀더 UI
 * - 실제 카드와 동일한 레이아웃 구조를 유지한다
 */

export default function BestCourseCardSkeleton() {
  return (
    <article className="best-card best-card--skeleton" aria-hidden="true">
      <div className="best-card__thumbnail best-card__skeleton-pulse" />

      <div className="best-card__body">
        <div className="best-card__skeleton-line best-card__skeleton-line--title" />
        <div className="best-card__skeleton-line best-card__skeleton-line--title-sub" />

        <div className="best-card__meta">
          <span className="best-card__skeleton-line best-card__skeleton-line--rating" />
          <span className="best-card__skeleton-line best-card__skeleton-line--instructor" />
        </div>
      </div>
    </article>
  );
}
