/**
 * 강의 후기 페이지 (/courses/[id]/reviews)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import CourseReviewsContent from '@/components/courses/CourseReviewsContent';
import accountData from '@/data/accountData.json';

const pageData = accountData.mypage.courseReviewsPage;

interface Props {
  params: Promise<{ id: string }>;
}

export function generateMetadata(): Metadata {
  return {
    title: pageData.title,
    robots: { index: false, follow: false },
  };
}

export default async function CourseReviewsPage({ params }: Props): Promise<JSX.Element> {
  const { id } = await params;

  return (
    <main className="course-reviews-page">
      <div className="course-reviews-page__inner">
        <CourseReviewsContent courseId={Number(id)} />
      </div>
    </main>
  );
}
