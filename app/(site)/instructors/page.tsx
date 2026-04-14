/**
 * 강사 소개 목록 페이지 (/instructors)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import InstructorListContainer from '@/components/instructors/InstructorListContainer';

export const metadata: Metadata = {
  title: '강사 소개 — 강의 플랫폼',
  description: '플랫폼에서 활동 중인 강사들을 만나보세요.',
};

export default function InstructorsPage(): JSX.Element {
  return (
    <main>
      <InstructorListContainer />
    </main>
  );
}
