/**
 * 강의별 상담 페이지 (/learn/[courseId]/consultation)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import CourseConsultationContent from '@/components/learn/CourseConsultationContent';
import accountData from '@/data/accountData.json';

const pageData = accountData.mypage.learnConsultationPage;

export const metadata: Metadata = {
  title: pageData.title,
  robots: { index: false, follow: false },
};

interface Props {
  params: Promise<{ courseId: string }>;
}

export default async function CourseConsultationPage({ params }: Props): Promise<JSX.Element> {
  const { courseId } = await params;

  return (
    <main className="course-consultation-page">
      <div className="course-consultation-page__inner">
        <CourseConsultationContent courseId={Number(courseId)} />
      </div>
    </main>
  );
}
