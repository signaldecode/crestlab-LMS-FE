/**
 * 강사 상세 페이지 컨테이너 (InstructorDetailContainer)
 */

'use client';

import type { JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchInstructor } from '@/lib/userApi';

const SK = 'instructor-detail';

interface Props {
  instructorId: number;
}

export default function InstructorDetailContainer({ instructorId }: Props): JSX.Element {
  const { data, loading, error } = useAdminQuery(
    () => fetchInstructor(instructorId),
    [instructorId],
  );

  if (loading && !data) return <main className={SK}><p>불러오는 중…</p></main>;
  if (error && !data) return <main className={SK}><p>{error.message}</p></main>;
  if (!data) return <main className={SK} />;

  return (
    <div className={SK}>
      <div className={`${SK}__inner`}>
        <Link href="/instructors" className={`${SK}__back`}>← 강사 목록</Link>

        <header className={`${SK}__profile`}>
          <div className={`${SK}__avatar`}>
            {data.profileImageUrl && (
              <Image
                src={data.profileImageUrl}
                alt={data.name}
                width={160}
                height={160}
                className={`${SK}__avatar-img`}
              />
            )}
          </div>
          <div className={`${SK}__profile-info`}>
            <h1 className={`${SK}__name`}>{data.name}</h1>
            <p className={`${SK}__specialty`}>{data.specialty}</p>
            <p className={`${SK}__follower`}>팔로워 {data.followerCount.toLocaleString('ko-KR')}</p>
          </div>
        </header>

        <section className={`${SK}__section`}>
          <h2 className={`${SK}__section-title`}>경력</h2>
          <p className={`${SK}__section-body`}>{data.career}</p>
        </section>

        <section className={`${SK}__section`}>
          <h2 className={`${SK}__section-title`}>소개</h2>
          <p className={`${SK}__section-body`}>{data.description}</p>
        </section>

        {data.representativeCourses.length > 0 && (
          <section className={`${SK}__section`}>
            <h2 className={`${SK}__section-title`}>대표 강의</h2>
            <ul className={`${SK}__courses`} role="list">
              {data.representativeCourses.map((c) => (
                <li key={c.courseId} className={`${SK}__course`}>
                  <Link href={`/courses/${c.courseId}`} className={`${SK}__course-link`}>
                    {c.thumbnailUrl && (
                      <Image
                        src={c.thumbnailUrl}
                        alt={c.title}
                        width={240}
                        height={140}
                        className={`${SK}__course-thumb`}
                      />
                    )}
                    <span className={`${SK}__course-title`}>{c.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
