/**
 * 강의 상세 컨테이너 (CourseDetailContainer)
 * - 2칸 레이아웃: 왼쪽(썸네일+후기+탭) / 오른쪽(가격+구매)
 */

import type { JSX } from 'react';
import type { Course } from '@/types';
import CourseDetailContent from '@/components/courses/CourseDetailContent';
import CourseDetailSidebar from '@/components/courses/CourseDetailSidebar';

interface CourseDetailContainerProps {
  course: Course | null;
}

export default function CourseDetailContainer({ course }: CourseDetailContainerProps): JSX.Element {
  return (
    <div className="course-detail-layout">
      <CourseDetailContent />
      <CourseDetailSidebar />
    </div>
  );
}
