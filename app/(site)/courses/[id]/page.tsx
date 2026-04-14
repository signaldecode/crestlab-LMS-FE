/**
 * 강의 상세 페이지 (/courses/[id])
 * - id 기반 라우팅. 모든 데이터는 클라이언트에서 `fetchUserCourseById` 로 조회한다
 * - SEO 메타데이터는 정적 값만 사용 (상세 제목이 필요하면 서버에서 fetch 해도 무방하나 mock 의존 제거)
 */

import type { Metadata } from 'next';
import CourseDetailContainer from '@/components/containers/CourseDetailContainer';

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: '강의 상세',
    robots: { index: true, follow: true },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = await params;
  const courseId = Number(id);

  return (
    <article className="course-detail-page">
      <CourseDetailContainer courseId={Number.isFinite(courseId) ? courseId : null} />
    </article>
  );
}
