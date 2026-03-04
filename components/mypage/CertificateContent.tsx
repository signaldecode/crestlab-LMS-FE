/**
 * 수료증 콘텐츠 (CertificateContent)
 * - /mypage/certificates 페이지에서 사용
 */

'use client';

import type { JSX } from 'react';
import { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCertificates, getCourses } from '@/lib/data';

const SK = 'mypage-classroom';

export default function CertificateContent(): JSX.Element {
  const certs = getCertificates();
  const allCourses = getCourses();

  const certsWithCourse = useMemo(() => {
    return certs.map((cert) => ({
      ...cert,
      course: allCourses.find((c) => c.slug === cert.courseSlug) ?? null,
    }));
  }, [certs, allCourses]);

  return (
    <div className="mypage-classroom">
      <div className={`${SK}__menu-content`}>
        <h2 className={`${SK}__menu-title`}>수료증</h2>
        {certsWithCourse.length === 0 ? (
          <div className={`${SK}__empty`}>
            <p className={`${SK}__empty-text`}>수료증이 없습니다.</p>
          </div>
        ) : (
          <div className={`${SK}__course-grid`}>
            {certsWithCourse.map((cert) => (
              <div key={cert.id} className={`${SK}__cert-card`}>
                {cert.course ? (
                  <Link href={`/courses/${cert.course.slug}`} className={`${SK}__cert-thumb-link`}>
                    <Image
                      src={cert.course.thumbnail}
                      alt={cert.course.thumbnailAlt}
                      width={400}
                      height={112}
                      className={`${SK}__cert-img`}
                    />
                  </Link>
                ) : (
                  <div className={`${SK}__cert-thumb`} />
                )}
                <div className={`${SK}__cert-body`}>
                  <span className={`${SK}__cert-title`}>
                    {cert.course?.title ?? '알 수 없는 강의'}
                  </span>
                  <div className={`${SK}__course-meta`}>
                    <span className={`${SK}__cert-instructor`}>{cert.course?.instructor}</span>
                  </div>
                  <div className={`${SK}__cert-footer`}>
                    <span className={`${SK}__cert-date`}>
                      {cert.issuedAt ? `발급일 ${cert.issuedAt}` : '수강 진행중'}
                    </span>
                    {cert.status === '발급완료' ? (
                      <button type="button" className={`${SK}__cert-download-btn`}>다운로드</button>
                    ) : (
                      <span className={`${SK}__cert-status`}>{cert.status}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
