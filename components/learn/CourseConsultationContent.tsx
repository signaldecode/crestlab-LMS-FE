/**
 * 강의별 상담 페이지 콘텐츠 (CourseConsultationContent)
 * - 백엔드 상담 API 미구현 — 안내 문구만 표시
 */

'use client';

import type { JSX } from 'react';
import accountData from '@/data/accountData.json';

const SK = 'course-consultation';
const pageData = accountData.mypage.learnConsultationPage;

interface Props {
  courseId: number;
}

export default function CourseConsultationContent(_props: Props): JSX.Element {
  return (
    <div className={SK}>
      <h2 className={`${SK}__title`}>{pageData.title}</h2>
      <p className={`${SK}__empty`}>{pageData.emptyText}</p>
    </div>
  );
}
