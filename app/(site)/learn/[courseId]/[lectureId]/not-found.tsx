/**
 * 강의 접근 불가 / 없음 UI
 * - 존재하지 않거나 접근 권한이 없는 강의에 접근 시 표시되는 화면
 * - Next.js App Router의 not-found.jsx 컨벤션을 활용한다
 */

import Link from 'next/link';
import pagesData from '@/data/pagesData.json';

const notFoundData = pagesData.learn.notFound;

export default function LectureNotFound() {
  return (
    <div className="lecture-not-found">
      <h2>{notFoundData.title}</h2>
      <p>{notFoundData.description}</p>
      <Link href={notFoundData.linkHref}>{notFoundData.linkLabel}</Link>
    </div>
  );
}
