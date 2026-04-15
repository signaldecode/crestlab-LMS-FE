/**
 * 강사 지원 페이지 (/instructors/apply)
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import pagesData from '@/data/pagesData.json';
import InstructorApplicationContainer from '@/components/instructors/InstructorApplicationContainer';

const seo = pagesData.instructorApply.seo;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
};

export default function Page(): JSX.Element {
  return (
    <main>
      <InstructorApplicationContainer />
    </main>
  );
}
