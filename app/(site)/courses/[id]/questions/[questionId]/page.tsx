/**
 * 강의 질문 상세 페이지 (/courses/[id]/questions/[questionId])
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import CourseQuestionDetailContent from '@/components/courses/CourseQuestionDetailContent';

interface Props {
  params: Promise<{ id: string; questionId: string }>;
}

export const metadata: Metadata = {
  title: '질문 상세',
  robots: { index: false, follow: false },
};

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const { id, questionId } = await params;
  return (
    <main>
      <CourseQuestionDetailContent
        courseId={Number(id)}
        questionId={Number(questionId)}
      />
    </main>
  );
}
