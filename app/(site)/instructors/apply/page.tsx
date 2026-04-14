/**
 * 강사 지원 페이지 (/instructors/apply)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import InstructorApplicationContainer from '@/components/instructors/InstructorApplicationContainer';

export const metadata: Metadata = {
  title: '강사 지원 — 강의 플랫폼',
  description: '강사로 지원하여 본인의 강의를 등록하세요.',
};

export default function Page(): JSX.Element {
  return (
    <main>
      <InstructorApplicationContainer />
    </main>
  );
}
