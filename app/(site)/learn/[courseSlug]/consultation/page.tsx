/**
 * 강의별 상담 페이지 (/learn/[courseSlug]/consultation)
 * - 해당 강의에 대한 상담 내역 조회 및 새 문의 제출
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
  params: Promise<{ courseSlug: string }>;
}

export default async function CourseConsultationPage({ params }: Props): Promise<JSX.Element> {
  const { courseSlug } = await params;

  return (
    <main className="course-consultation-page">
      <div className="course-consultation-page__inner">
        <CourseConsultationContent courseSlug={courseSlug} />
      </div>
    </main>
  );
}
