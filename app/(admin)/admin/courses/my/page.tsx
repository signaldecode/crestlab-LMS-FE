/**
 * 강사 본인 담당 강좌 목록 (/admin/courses/my)
 * - 권한: INSTRUCTOR (백엔드 PreAuthorize)
 * - 백엔드: GET /api/v1/admin/courses/my
 */

import type { JSX } from 'react';
import type { Metadata } from 'next';
import InstructorMyCoursesContainer, {
  type InstructorMyCoursesCopy,
} from '@/components/admin/courses/InstructorMyCoursesContainer';
import { getPageData } from '@/lib/data';

interface PageData extends InstructorMyCoursesCopy {
  seo: { title: string; description: string };
}

function getCopy(): PageData | null {
  const adminPage = getPageData('admin') as { instructorMyCourses?: PageData } | null;
  return adminPage?.instructorMyCourses ?? null;
}

export function generateMetadata(): Metadata {
  const copy = getCopy();
  if (!copy) return { title: '내 강좌 — 강사' };
  return { title: copy.seo.title, description: copy.seo.description };
}

export default function InstructorMyCoursesPage(): JSX.Element {
  const copy = getCopy();
  if (!copy) {
    return <main>강좌 데이터를 불러올 수 없습니다.</main>;
  }
  return <InstructorMyCoursesContainer copy={copy} />;
}
