/**
 * 오픈예정 강의 카드 스켈레톤 (UpcomingCourseCardSkeleton)
 * - 데이터 로딩 전 플레이스홀더 UI
 * - 실제 카드와 동일한 레이아웃 구조를 유지한다
 */

export default function UpcomingCourseCardSkeleton() {
  return (
    <article className="upcoming-card upcoming-card--skeleton" aria-hidden="true">
      <div className="upcoming-card__thumbnail upcoming-card__skeleton-pulse" />

      <div className="upcoming-card__body">
        <div className="upcoming-card__skeleton-line upcoming-card__skeleton-line--title" />
        <div className="upcoming-card__skeleton-line upcoming-card__skeleton-line--title-sub" />

        <div className="upcoming-card__meta">
          <span className="upcoming-card__skeleton-line upcoming-card__skeleton-line--rating" />
          <span className="upcoming-card__skeleton-line upcoming-card__skeleton-line--instructor" />
        </div>

        <div className="upcoming-card__skeleton-line upcoming-card__skeleton-line--btn" />
      </div>
    </article>
  );
}
