/**
 * 내 강의실 콘텐츠 (MyClassroomContent)
 * - 기본 탭(강의 / 과제 관리 / 조편성) 표시
 * - 강의 탭: 수강중 강의 목록 + 진행률 표시
 */

'use client';

import type { JSX } from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import mypageBanner from '@/assets/images/banners/mypage-banner.jpg';
import { getEnrolledCourses, getCourses } from '@/lib/data';
import accountData from '@/data/accountData.json';
import type { Course } from '@/types';

const classroomData = accountData.mypage.classroom;

const SK = 'mypage-classroom';

export default function MyClassroomContent(): JSX.Element {
  const [activeTab, setActiveTab] = useState(classroomData.tabs[0]);
  const enrolledCourses = getEnrolledCourses();
  const allCourses = getCourses();

  const coursesWithDetail = useMemo(() => {
    return enrolledCourses
      .map((ec) => {
        const course = allCourses.find((c) => c.slug === ec.courseSlug);
        if (!course) return null;
        return { ...ec, course };
      })
      .filter((item): item is { courseSlug: string; progress: number; lastLecture: string; lastAccessedAt: string; enrolledAt: string; course: Course } => item != null);
  }, [enrolledCourses, allCourses]);

  return (
    <div className="mypage-classroom">
      {/* 탭 */}
      <div className="mypage-classroom__tabs" role="tablist">
        {classroomData.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={tab === activeTab}
            className={`mypage-classroom__tab${tab === activeTab ? ' mypage-classroom__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 강의 탭 콘텐츠 */}
      {activeTab === classroomData.tabs[0] && (
        <>
          {coursesWithDetail.length === 0 ? (
            <div className={`${SK}__empty`}>
              <p className={`${SK}__empty-text`}>{classroomData.emptyText}</p>
            </div>
          ) : (
            <div className={`${SK}__course-list`}>
              {coursesWithDetail.map((item) => (
                <div key={item.courseSlug} className={`${SK}__course-card`}>
                  <Link href={`/courses/${item.course.slug}`} className={`${SK}__course-thumb-link`}>
                    <Image
                      src={item.course.thumbnail}
                      alt={item.course.thumbnailAlt}
                      width={120}
                      height={80}
                      className={`${SK}__course-thumb`}
                    />
                  </Link>
                  <div className={`${SK}__course-info`}>
                    <Link href={`/courses/${item.course.slug}`} className={`${SK}__course-title`}>
                      {item.course.title}
                    </Link>
                    <span className={`${SK}__course-instructor`}>{item.course.instructor}</span>
                    <div className={`${SK}__course-meta`}>
                      <span className={`${SK}__course-last-lecture`}>
                        {classroomData.lastLectureLabel}: {item.lastLecture}
                      </span>
                    </div>
                    {/* 진행률 바 */}
                    <div className={`${SK}__course-progress`}>
                      <div className={`${SK}__course-progress-bar`}>
                        <div
                          className={`${SK}__course-progress-fill${item.progress === 100 ? ` ${SK}__course-progress-fill--complete` : ''}`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className={`${SK}__course-progress-text`}>
                        {item.progress === 100 ? classroomData.completedLabel : `${classroomData.progressLabel} ${item.progress}%`}
                      </span>
                    </div>
                  </div>
                  <div className={`${SK}__course-actions`}>
                    {item.progress < 100 && (
                      <Link
                        href={`/learn/${item.course.slug}/l-0-0`}
                        className={`${SK}__course-continue-btn`}
                      >
                        {classroomData.continueBtnLabel}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 과제 관리 / 조편성 탭 - 빈 상태 */}
      {activeTab !== classroomData.tabs[0] && (
        <div className={`${SK}__empty`}>
          <p className={`${SK}__empty-text`}>{classroomData.emptyText}</p>
        </div>
      )}

      {/* 프로모션 배너 */}
      <div className="mypage-classroom__promo">
        <Image
          src={mypageBanner}
          alt={classroomData.promoBannerAlt}
          fill
          sizes="(max-width: 767px) 100vw, 700px"
          className="mypage-classroom__promo-img"
        />
      </div>
    </div>
  );
}
