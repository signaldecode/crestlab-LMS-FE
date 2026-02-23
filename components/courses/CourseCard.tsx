/**
 * 강의 카드 (CourseCard)
 * - 개별 강의를 카드 형태로 표시한다
 * - 썸네일 + 제목 + 가격 + 뱃지 영역으로 구성된다
 * - 실제 데이터는 추후 props로 주입한다
 */

import type { JSX } from 'react';

export default function CourseCard(): JSX.Element {
  return (
    <article className="course-card">
      <div className="course-card__thumbnail">
        {/* 썸네일 이미지 영역 */}
      </div>
      <div className="course-card__body">
        <div className="course-card__badges">
          {/* 뱃지 (BEST, NEW 등) 영역 */}
        </div>
        <h3 className="course-card__title">
          {/* 강의 제목 */}
        </h3>
        <p className="course-card__instructor">
          {/* 강사명 */}
        </p>
        <span className="course-card__price">
          {/* 가격 */}
        </span>
      </div>
    </article>
  );
}
