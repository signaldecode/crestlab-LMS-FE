/**
 * 강의 상세 컨테이너 (CourseDetailContainer)
 * - 강의 상세 페이지의 메인 콘텐츠를 조립한다
 * - 강의 정보(제목/요약/썸네일/커리큘럼/FAQ), CTA, JSON-LD 등을 렌더링한다
 * - course 데이터를 props로 받는다
 */

import type { JSX } from 'react';
import type { Course } from '@/types';

interface CourseDetailContainerProps {
  course: Course | null;
}

export default function CourseDetailContainer({ course }: CourseDetailContainerProps): JSX.Element {
  return (
    <section className="course-detail-container">
      {/* course data 기반 상세 정보가 렌더링된다 */}
    </section>
  );
}
