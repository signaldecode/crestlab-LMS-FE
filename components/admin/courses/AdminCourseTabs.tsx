/**
 * 관리자 강의 편집 통합 탭 (AdminCourseTabs)
 * - 기본정보 / 커리큘럼 / 영상 / 설정 4개 탭을 URL query `?tab=`로 전환한다
 * - 각 탭은 자립 컨테이너 컴포넌트를 렌더링한다
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminCourseFormContainer, {
  type CourseFormCopy,
} from '@/components/admin/courses/AdminCourseFormContainer';
import AdminCourseEditContainer from '@/components/admin/AdminCourseEditContainer';
import CurriculumEditor, {
  type CurriculumEditorCopy,
} from '@/components/admin/courses/CurriculumEditor';
import { fetchAdminCourse, updateAdminCourseStatus } from '@/lib/adminApi';
import useAuthStore, { selectIsAdmin } from '@/stores/useAuthStore';
import type { AdminCourseStatus } from '@/types';

export type CourseTabKey = 'basic' | 'curriculum' | 'video' | 'settings';

export interface AdminCourseTabsCopy {
  tabs: Record<CourseTabKey, string>;
  settings: {
    statusTitle: string;
    statusDescription: string;
    statusLabels: Record<AdminCourseStatus, string>;
    publishLabel: string;
    unpublishLabel: string;
    hideLabel: string;
    statusUpdateSuccess: string;
    statusUpdateError: string;
  };
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface Props {
  courseId: number;
  /** 초기 상태 — 미지정 시 마운트 후 fetchAdminCourse로 동기화 */
  initialStatus?: AdminCourseStatus;
  formCopy: CourseFormCopy;
  common: CommonCopy;
  notFoundText: string;
  curriculumCopy: CurriculumEditorCopy;
  tabsCopy: AdminCourseTabsCopy;
  videoTexts: Parameters<typeof AdminCourseEditContainer>[0]['texts'];
}

const TAB_KEYS: CourseTabKey[] = ['basic', 'curriculum', 'video', 'settings'];
/** INSTRUCTOR 가 편집 가능한 탭만 — basic/settings 는 ADMIN 전용 */
const INSTRUCTOR_TAB_KEYS: CourseTabKey[] = ['curriculum', 'video'];

export default function AdminCourseTabs({
  courseId,
  initialStatus,
  formCopy,
  common,
  notFoundText,
  curriculumCopy,
  tabsCopy,
  videoTexts,
}: Props): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAdmin = useAuthStore(selectIsAdmin);
  const visibleTabs = isAdmin ? TAB_KEYS : INSTRUCTOR_TAB_KEYS;
  const defaultTab: CourseTabKey = isAdmin ? 'basic' : 'curriculum';
  const rawTab = searchParams.get('tab');
  const activeTab: CourseTabKey = (visibleTabs as string[]).includes(rawTab ?? '')
    ? (rawTab as CourseTabKey)
    : defaultTab;

  const [status, setStatus] = useState<AdminCourseStatus>(initialStatus ?? 'DRAFT');

  useEffect(() => {
    if (initialStatus) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchAdminCourse(courseId);
        if (!cancelled) setStatus(detail.status);
      } catch {
        /* 초기 상태 로드 실패는 조용히 무시 */
      }
    })();
    return () => { cancelled = true; };
  }, [courseId, initialStatus]);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const changeTab = useCallback(
    (tab: CourseTabKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handleStatusChange = useCallback(
    async (next: AdminCourseStatus) => {
      setStatusUpdating(true);
      setStatusError(null);
      setStatusMessage(null);
      try {
        await updateAdminCourseStatus(courseId, next);
        setStatus(next);
        setStatusMessage(tabsCopy.settings.statusUpdateSuccess);
      } catch {
        setStatusError(tabsCopy.settings.statusUpdateError);
      } finally {
        setStatusUpdating(false);
      }
    },
    [courseId, tabsCopy.settings.statusUpdateSuccess, tabsCopy.settings.statusUpdateError],
  );

  return (
    <div className="admin-course-tabs">
      <nav className="admin-course-tabs__nav" role="tablist" aria-label="course editor tabs">
        {visibleTabs.map((key) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`admin-course-tabs__tab${isActive ? ' admin-course-tabs__tab--active' : ''}`}
              onClick={() => changeTab(key)}
            >
              {tabsCopy.tabs[key]}
            </button>
          );
        })}
      </nav>

      <div className="admin-course-tabs__panel" role="tabpanel">
        {activeTab === 'basic' && (
          <AdminCourseFormContainer
            mode="edit"
            courseId={courseId}
            copy={formCopy}
            common={common}
            notFoundText={notFoundText}
          />
        )}
        {activeTab === 'curriculum' && (
          <CurriculumEditor courseId={courseId} copy={curriculumCopy} />
        )}
        {activeTab === 'video' && (
          <AdminCourseEditContainer courseId={String(courseId)} texts={videoTexts} />
        )}
        {activeTab === 'settings' && (
          <div className="admin-course-tabs__settings">
            <h2 className="admin-user-detail__section-title">{tabsCopy.settings.statusTitle}</h2>
            <p className="admin-form-page__subtitle">{tabsCopy.settings.statusDescription}</p>

            <p className="admin-course-tabs__status-current">
              {tabsCopy.settings.statusLabels[status]}
            </p>

            <div className="admin-course-tabs__status-actions">
              {status !== 'PUBLISHED' && (
                <button
                  type="button"
                  className="admin-modal__btn admin-modal__btn--primary"
                  disabled={statusUpdating}
                  onClick={() => void handleStatusChange('PUBLISHED')}
                >
                  {tabsCopy.settings.publishLabel}
                </button>
              )}
              {status !== 'DRAFT' && (
                <button
                  type="button"
                  className="admin-modal__btn admin-modal__btn--ghost"
                  disabled={statusUpdating}
                  onClick={() => void handleStatusChange('DRAFT')}
                >
                  {tabsCopy.settings.unpublishLabel}
                </button>
              )}
              {status !== 'HIDDEN' && (
                <button
                  type="button"
                  className="admin-modal__btn admin-modal__btn--ghost"
                  disabled={statusUpdating}
                  onClick={() => void handleStatusChange('HIDDEN')}
                >
                  {tabsCopy.settings.hideLabel}
                </button>
              )}
            </div>

            {statusMessage && <p className="admin-course-tabs__status-msg" role="status">{statusMessage}</p>}
            {statusError && <p className="admin-course-tabs__status-error" role="alert">{statusError}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
