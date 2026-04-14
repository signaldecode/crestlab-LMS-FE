/**
 * 관리자 대시보드 컨테이너 (AdminDashboardContainer)
 * - 매출/신규가입자/인기강의/리뷰/결제 5개 섹션을 표시한다
 * - 백엔드 GET /api/v1/admin/dashboard 실 API 연동
 */

'use client';

import type { JSX } from 'react';
import { AdminError, AdminLoading } from '@/components/admin/AdminDataState';
import { useAdminQuery } from '@/hooks/useAdminQuery';
import { fetchAdminDashboard } from '@/lib/adminApi';

interface PeriodLabels {
  today: string;
  monthly: string;
  total: string;
}

interface RevenueSection {
  title: string;
  description: string;
  trendTitle: string;
  trendAriaLabel: string;
}

interface NewUsersSection {
  title: string;
  description: string;
  trendTitle: string;
  trendAriaLabel: string;
}

interface CourseEnrollmentsSection {
  title: string;
  description: string;
  columnRank: string;
  columnTitle: string;
  columnEnrollment: string;
  columnProgress: string;
  emptyText: string;
}

interface ReviewsSection {
  title: string;
  description: string;
  avgRatingLabel: string;
  totalLabel: string;
  monthlyLabel: string;
  recentTitle: string;
  emptyText: string;
}

interface PaymentsSection {
  title: string;
  description: string;
  todayOrderLabel: string;
  todayRefundLabel: string;
  monthlyOrderLabel: string;
  monthlyRefundLabel: string;
}

export interface DashboardCopy {
  title: string;
  subtitle: string;
  currencyUnit: string;
  countUnit: string;
  personUnit: string;
  ratingUnit: string;
  periodLabels: PeriodLabels;
  sections: {
    revenue: RevenueSection;
    newUsers: NewUsersSection;
    courseEnrollments: CourseEnrollmentsSection;
    reviews: ReviewsSection;
    payments: PaymentsSection;
  };
}

interface CommonCopy {
  loadingText: string;
  errorTitle: string;
  errorRetryLabel: string;
}

interface AdminDashboardContainerProps {
  copy: DashboardCopy;
  common: CommonCopy;
}

const formatNumber = (n: number): string => n.toLocaleString('ko-KR');
const formatDateMd = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
const formatDateTime = (iso: string): string => {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

export default function AdminDashboardContainer({
  copy,
  common,
}: AdminDashboardContainerProps): JSX.Element {
  const { data, loading, error, refetch } = useAdminQuery(fetchAdminDashboard);

  if (loading && !data) return <AdminLoading label={common.loadingText} />;
  if (error && !data) {
    return (
      <AdminError
        title={common.errorTitle}
        message={error.message}
        retryLabel={common.errorRetryLabel}
        onRetry={refetch}
      />
    );
  }
  if (!data) return <AdminLoading label={common.loadingText} />;

  const { revenue, newUsers, courseEnrollments, reviews, payments } = data;
  const { sections, periodLabels, currencyUnit, countUnit, personUnit, ratingUnit } = copy;

  const maxDailyRevenue = Math.max(...revenue.dailyRevenues.map((d) => d.amount), 1);
  const maxDailyUsers = Math.max(...newUsers.dailyCounts.map((d) => d.count), 1);

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">{copy.title}</h1>
        <p className="admin-dashboard__subtitle">{copy.subtitle}</p>
      </header>

      {/* 매출 */}
      <section className="admin-dashboard__section" aria-labelledby="dashboard-revenue-title">
        <div className="admin-dashboard__section-head">
          <h2 id="dashboard-revenue-title" className="admin-dashboard__section-title">
            {sections.revenue.title}
          </h2>
          <p className="admin-dashboard__section-desc">{sections.revenue.description}</p>
        </div>
        <div className="admin-dashboard__stat-grid">
          <StatCard
            label={periodLabels.today}
            value={formatNumber(revenue.todayRevenue)}
            unit={currencyUnit}
          />
          <StatCard
            label={periodLabels.monthly}
            value={formatNumber(revenue.monthlyRevenue)}
            unit={currencyUnit}
          />
          <StatCard
            label={periodLabels.total}
            value={formatNumber(revenue.totalRevenue)}
            unit={currencyUnit}
          />
        </div>
        <div className="admin-dashboard__trend">
          <h3 className="admin-dashboard__trend-title">{sections.revenue.trendTitle}</h3>
          <ul className="admin-dashboard__bar-chart" aria-label={sections.revenue.trendAriaLabel}>
            {revenue.dailyRevenues.map((d) => {
              const heightPercent = (d.amount / maxDailyRevenue) * 100;
              return (
                <li key={d.date} className="admin-dashboard__bar-item">
                  <div
                    className="admin-dashboard__bar"
                    style={{ height: `${heightPercent}%` }}
                    title={`${formatDateMd(d.date)} · ${formatNumber(d.amount)}${currencyUnit}`}
                  />
                  <span className="admin-dashboard__bar-label">{formatDateMd(d.date)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 신규 가입자 */}
      <section className="admin-dashboard__section" aria-labelledby="dashboard-users-title">
        <div className="admin-dashboard__section-head">
          <h2 id="dashboard-users-title" className="admin-dashboard__section-title">
            {sections.newUsers.title}
          </h2>
          <p className="admin-dashboard__section-desc">{sections.newUsers.description}</p>
        </div>
        <div className="admin-dashboard__stat-grid">
          <StatCard
            label={periodLabels.today}
            value={formatNumber(newUsers.todayCount)}
            unit={personUnit}
          />
          <StatCard
            label={periodLabels.monthly}
            value={formatNumber(newUsers.monthlyCount)}
            unit={personUnit}
          />
          <StatCard
            label={periodLabels.total}
            value={formatNumber(newUsers.totalCount)}
            unit={personUnit}
          />
        </div>
        <div className="admin-dashboard__trend">
          <h3 className="admin-dashboard__trend-title">{sections.newUsers.trendTitle}</h3>
          <ul className="admin-dashboard__bar-chart" aria-label={sections.newUsers.trendAriaLabel}>
            {newUsers.dailyCounts.map((d) => {
              const heightPercent = (d.count / maxDailyUsers) * 100;
              return (
                <li key={d.date} className="admin-dashboard__bar-item">
                  <div
                    className="admin-dashboard__bar admin-dashboard__bar--alt"
                    style={{ height: `${heightPercent}%` }}
                    title={`${formatDateMd(d.date)} · ${formatNumber(d.count)}${personUnit}`}
                  />
                  <span className="admin-dashboard__bar-label">{formatDateMd(d.date)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 인기 강의 */}
      <section className="admin-dashboard__section" aria-labelledby="dashboard-courses-title">
        <div className="admin-dashboard__section-head">
          <h2 id="dashboard-courses-title" className="admin-dashboard__section-title">
            {sections.courseEnrollments.title}
          </h2>
          <p className="admin-dashboard__section-desc">{sections.courseEnrollments.description}</p>
        </div>
        {courseEnrollments.length === 0 ? (
          <p className="admin-dashboard__empty">{sections.courseEnrollments.emptyText}</p>
        ) : (
          <table className="admin-dashboard__table">
            <thead>
              <tr>
                <th scope="col" className="admin-dashboard__th admin-dashboard__th--narrow">
                  {sections.courseEnrollments.columnRank}
                </th>
                <th scope="col" className="admin-dashboard__th">
                  {sections.courseEnrollments.columnTitle}
                </th>
                <th scope="col" className="admin-dashboard__th admin-dashboard__th--num">
                  {sections.courseEnrollments.columnEnrollment}
                </th>
                <th scope="col" className="admin-dashboard__th admin-dashboard__th--num">
                  {sections.courseEnrollments.columnProgress}
                </th>
              </tr>
            </thead>
            <tbody>
              {courseEnrollments.map((c, idx) => (
                <tr key={c.courseId}>
                  <td className="admin-dashboard__td admin-dashboard__td--rank">{idx + 1}</td>
                  <td className="admin-dashboard__td">{c.title}</td>
                  <td className="admin-dashboard__td admin-dashboard__td--num">
                    {formatNumber(c.enrollmentCount)}
                  </td>
                  <td className="admin-dashboard__td admin-dashboard__td--num">
                    {c.avgProgressPercent.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* 리뷰 */}
      <section className="admin-dashboard__section" aria-labelledby="dashboard-reviews-title">
        <div className="admin-dashboard__section-head">
          <h2 id="dashboard-reviews-title" className="admin-dashboard__section-title">
            {sections.reviews.title}
          </h2>
          <p className="admin-dashboard__section-desc">{sections.reviews.description}</p>
        </div>
        <div className="admin-dashboard__stat-grid">
          <StatCard
            label={sections.reviews.avgRatingLabel}
            value={reviews.overallAvgRating.toFixed(1)}
            unit={ratingUnit}
          />
          <StatCard
            label={sections.reviews.totalLabel}
            value={formatNumber(reviews.totalReviewCount)}
            unit={countUnit}
          />
          <StatCard
            label={sections.reviews.monthlyLabel}
            value={formatNumber(reviews.monthlyReviewCount)}
            unit={countUnit}
          />
        </div>
        <div className="admin-dashboard__recent">
          <h3 className="admin-dashboard__recent-title">{sections.reviews.recentTitle}</h3>
          {reviews.recentReviews.length === 0 ? (
            <p className="admin-dashboard__empty">{sections.reviews.emptyText}</p>
          ) : (
            <ul className="admin-dashboard__review-list">
              {reviews.recentReviews.map((r) => (
                <li key={r.id} className="admin-dashboard__review-item">
                  <div className="admin-dashboard__review-meta">
                    <span className="admin-dashboard__review-rating">
                      {'★'.repeat(r.rating)}
                      <span className="admin-dashboard__review-rating-empty">
                        {'★'.repeat(5 - r.rating)}
                      </span>
                    </span>
                    <span className="admin-dashboard__review-course">{r.courseTitle}</span>
                    <span className="admin-dashboard__review-author">{r.nickname}</span>
                    <span className="admin-dashboard__review-date">{formatDateTime(r.createdAt)}</span>
                  </div>
                  <p className="admin-dashboard__review-content">{r.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* 결제 */}
      <section className="admin-dashboard__section" aria-labelledby="dashboard-payments-title">
        <div className="admin-dashboard__section-head">
          <h2 id="dashboard-payments-title" className="admin-dashboard__section-title">
            {sections.payments.title}
          </h2>
          <p className="admin-dashboard__section-desc">{sections.payments.description}</p>
        </div>
        <div className="admin-dashboard__stat-grid admin-dashboard__stat-grid--four">
          <StatCard
            label={sections.payments.todayOrderLabel}
            value={formatNumber(payments.todayOrderCount)}
            unit={countUnit}
          />
          <StatCard
            label={sections.payments.todayRefundLabel}
            value={formatNumber(payments.todayRefundCount)}
            unit={countUnit}
          />
          <StatCard
            label={sections.payments.monthlyOrderLabel}
            value={formatNumber(payments.monthlyOrderCount)}
            unit={countUnit}
          />
          <StatCard
            label={sections.payments.monthlyRefundLabel}
            value={formatNumber(payments.monthlyRefundCount)}
            unit={countUnit}
          />
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
}

function StatCard({ label, value, unit }: StatCardProps): JSX.Element {
  return (
    <div className="admin-dashboard__stat-card">
      <span className="admin-dashboard__stat-label">{label}</span>
      <span className="admin-dashboard__stat-value">
        {value}
        <span className="admin-dashboard__stat-unit">{unit}</span>
      </span>
    </div>
  );
}
