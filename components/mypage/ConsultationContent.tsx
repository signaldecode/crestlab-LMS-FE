/**
 * 강의 상담 콘텐츠 (ConsultationContent)
 * - /mypage/consultations 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getConsultations, getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';

const consultsPageData = accountData.mypage.consultationsPage;
const SK = 'mypage-classroom';

export default function ConsultationContent(): JSX.Element {
  const consults = getConsultations();
  const allCourses = getCourses();

  const consultsWithCourse = useMemo(() => {
    return consults.map((c) => ({
      ...c,
      course: allCourses.find((course) => course.slug === c.courseSlug) ?? null,
    }));
  }, [consults, allCourses]);

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>{consultsPageData.title}</h2>
        {consultsWithCourse.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>{consultsPageData.emptyText}</p>
          </div>
        ) : (
          <div className={`${SK}__consult-list`}>
            {consultsWithCourse.map((item) => (
              <Link key={item.id} href={`/learn/${item.courseSlug}/consultation`} className={`${SK}__consult-card`}>
                {item.course ? (
                  <div className={`${SK}__consult-thumb-link`}>
                    <Image
                      src={item.course.thumbnail}
                      alt={item.course.thumbnailAlt}
                      width={80}
                      height={80}
                      className={`${SK}__consult-img`}
                    />
                  </div>
                ) : (
                  <div className={`${SK}__consult-thumb`} />
                )}
                <div className={`${SK}__consult-body`}>
                  <span className={`${SK}__consult-question`}>{item.question}</span>
                  <div className={`${SK}__course-meta`}>
                    <span className={`${SK}__consult-course-name`}>{item.course?.title}</span>
                    <span className={`${SK}__consult-instructor`}>{item.course?.instructor}</span>
                  </div>
                  <span className={`${SK}__consult-date`}>{item.createdAt}</span>
                </div>
                <span className={`${SK}__consult-status ${SK}__consult-status--${item.status === '답변완료' ? 'done' : 'pending'}`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
