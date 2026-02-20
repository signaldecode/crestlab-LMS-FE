/**
 * 강의 상세 페이지 (SEO 핵심, slug 기반)
 * - /courses/[slug] 경로로 접근하며, params.slug로 강의 데이터를 조회한다
 * - 강의 데이터 기반으로 title/description/OG 메타데이터를 동적 생성한다
 * - FAQ가 있으면 FAQPage JSON-LD, BreadcrumbList JSON-LD를 주입한다
 */

import CourseDetailContainer from '@/components/containers/CourseDetailContainer';
import { findCourseBySlug } from '@/lib/data';
import { generateCourseMetadata } from '@/lib/seo';

interface CourseDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = findCourseBySlug(slug);
  return generateCourseMetadata(course);
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course = findCourseBySlug(slug);

  return (
    <article className="course-detail-page">
      <CourseDetailContainer course={course} />
    </article>
  );
}
