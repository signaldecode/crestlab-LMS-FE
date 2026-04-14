/**
 * 강사 상세 페이지 (/instructors/[id])
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import InstructorDetailContainer from '@/components/instructors/InstructorDetailContainer';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: '강사 소개 — 강의 플랫폼',
};

export default async function Page({ params }: Props): Promise<JSX.Element> {
  const { id } = await params;
  return (
    <main>
      <InstructorDetailContainer instructorId={Number(id)} />
    </main>
  );
}
