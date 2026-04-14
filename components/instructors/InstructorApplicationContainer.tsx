/**
 * 강사 지원 컨테이너 (InstructorApplicationContainer)
 * - 기존 지원이 있으면 상태 표시, 없으면 지원 폼 노출
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import { useAdminMutation, useAdminQuery } from '@/hooks/useAdminQuery';
import { applyInstructor, fetchMyInstructorApplication, UserApiError } from '@/lib/userApi';

const SK = 'instructor-apply';

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

const STATUS_LABELS = {
  PENDING: '심사 중',
  APPROVED: '승인됨',
  REJECTED: '반려됨',
} as const;

export default function InstructorApplicationContainer(): JSX.Element {
  const myAppQuery = useAdminQuery(
    () => fetchMyInstructorApplication().catch((e) => {
      if (e instanceof UserApiError && e.status === 404) return null;
      throw e;
    }),
    [],
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [career, setCareer] = useState('');
  const [lecturePlan, setLecturePlan] = useState('');

  const mutation = useAdminMutation(
    () => applyInstructor({
      name: name.trim(),
      phone: phone.trim(),
      specialty: specialty.trim(),
      career: career.trim(),
      lecturePlan: lecturePlan.trim(),
    }),
    () => myAppQuery.refetch(),
  );

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !specialty.trim() || !career.trim() || !lecturePlan.trim()) return;
    void mutation.run();
  }, [name, phone, specialty, career, lecturePlan, mutation]);

  if (myAppQuery.loading && !myAppQuery.data) {
    return <div className={SK}><p>불러오는 중…</p></div>;
  }

  // 기존 지원이 있는 경우: 상태 표시
  if (myAppQuery.data) {
    const app = myAppQuery.data;
    return (
      <div className={SK}>
        <div className={`${SK}__inner`}>
          <h1 className={`${SK}__title`}>강사 지원 현황</h1>
          <div className={`${SK}__status-card`}>
            <div className={`${SK}__status-row`}>
              <span className={`${SK}__status-label`}>상태</span>
              <span className={`${SK}__status-badge ${SK}__status-badge--${app.status.toLowerCase()}`}>
                {STATUS_LABELS[app.status]}
              </span>
            </div>
            <div className={`${SK}__status-row`}>
              <span className={`${SK}__status-label`}>지원일</span>
              <span>{formatDate(app.createdAt)}</span>
            </div>
            <div className={`${SK}__status-row`}>
              <span className={`${SK}__status-label`}>전문 분야</span>
              <span>{app.specialty}</span>
            </div>
            {app.status === 'REJECTED' && app.rejectReason && (
              <div className={`${SK}__status-row`}>
                <span className={`${SK}__status-label`}>반려 사유</span>
                <span className={`${SK}__reject-reason`}>{app.rejectReason}</span>
              </div>
            )}
          </div>
          <Link href="/" className={`${SK}__home-link`}>홈으로</Link>
        </div>
      </div>
    );
  }

  // 신규 지원 폼
  return (
    <div className={SK}>
      <div className={`${SK}__inner`}>
        <h1 className={`${SK}__title`}>강사 지원</h1>
        <p className={`${SK}__subtitle`}>강사로 지원하여 본인의 강의를 등록하세요. 심사 결과는 영업일 기준 3~5일 내 알림으로 안내됩니다.</p>

        <form className={`${SK}__form`} onSubmit={handleSubmit}>
          <label className={`${SK}__field`}>
            <span className={`${SK}__label`}>이름</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`${SK}__input`} required />
          </label>

          <label className={`${SK}__field`}>
            <span className={`${SK}__label`}>휴대폰 번호</span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="01012345678"
              className={`${SK}__input`}
              required
            />
          </label>

          <label className={`${SK}__field`}>
            <span className={`${SK}__label`}>전문 분야</span>
            <input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="예: 주식 가치투자, 부동산 경매"
              className={`${SK}__input`}
              required
            />
          </label>

          <label className={`${SK}__field`}>
            <span className={`${SK}__label`}>경력</span>
            <textarea
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              placeholder="경력 사항을 자세히 작성해 주세요."
              rows={5}
              className={`${SK}__textarea`}
              required
            />
          </label>

          <label className={`${SK}__field`}>
            <span className={`${SK}__label`}>강의 계획</span>
            <textarea
              value={lecturePlan}
              onChange={(e) => setLecturePlan(e.target.value)}
              placeholder="제작하실 강의 주제와 커리큘럼을 간략히 설명해 주세요."
              rows={5}
              className={`${SK}__textarea`}
              required
            />
          </label>

          {mutation.error && <p className={`${SK}__error`} role="alert">{mutation.error.message}</p>}

          <button
            type="submit"
            className={`${SK}__submit`}
            disabled={mutation.submitting}
          >
            지원하기
          </button>
        </form>
      </div>
    </div>
  );
}
