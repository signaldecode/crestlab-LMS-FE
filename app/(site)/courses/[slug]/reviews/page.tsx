/**
 * 강의 후기 페이지 (/courses/[slug]/reviews)
 * - 해당 강의의 수강 후기 조회 및 후기 작성
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import { findCourseBySlug } from '@/lib/data';
import CourseReviewsContent from '@/components/courses/CourseReviewsContent';
import accountData from '@/data/accountData.json';

const pageData = accountData.mypage.courseReviewsPage;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = findCourseBySlug(slug);
  return {
    title: course ? `${pageData.title} - ${course.title}` : pageData.title,
    robots: { index: false, follow: false },
  };
}

export default async function CourseReviewsPage({ params }: Props): Promise<JSX.Element> {
  const { slug } = await params;

  return (
    <main className="course-reviews-page">
      <div className="course-reviews-page__inner">
        <CourseReviewsContent slug={slug} />
      </div>
    </main>
  );
}
