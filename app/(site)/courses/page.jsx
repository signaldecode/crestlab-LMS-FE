/**
 * 강의 목록 페이지
 * - 전체 강의를 카드 그리드로 보여주는 페이지
 * - 카테고리/레벨/정렬 필터, 검색, 페이지네이션을 포함한다
 * - 강의 데이터는 data 또는 API에서 로드한다
 */

import CourseGridContainer from '@/components/containers/CourseGridContainer';

export default function CoursesPage() {
  return (
    <section className="courses-page">
      <CourseGridContainer />
    </section>
  );
}
