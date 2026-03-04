/**
 * 강의 상세 왼쪽 콘텐츠 (CourseDetailContent)
 * - 썸네일, 강의 소개, 앵커 탭(소개/질문·답변/커리큘럼/크리에이터/후기)
 * - ?tab= 쿼리 파라미터로 외부에서 탭 지정 가능
 */

'use client';

import { useState, useEffect, useRef, type JSX } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Course } from '@/types';

const TABS = ['소개', '질문 · 답변', '커리큘럼', '크리에이터', '후기'];

function getBadgeVariant(badge: string): string {
  if (badge === 'ORIGINAL') return 'original';
  if (badge === 'BEST') return 'best';
  if (badge === 'NEW' || badge.includes('신규')) return 'new';
  if (badge.includes('선착순') || badge.includes('마감')) return 'urgent';
  if (badge.startsWith('LV.')) return 'level';
  return 'default';
}

function formatReviewCount(count: number): string {
  if (count >= 10000) return (count / 10000).toFixed(1).replace(/\.0$/, '') + '만';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + '천';
  return count.toLocaleString('ko-KR');
}

function getLevelLabel(level: string): string {
  switch (level) {
    case 'beginner': return '입문·초급';
    case 'intermediate': return '중급';
    case 'advanced': return '고급';
    default: return level;
  }
}

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    'real-estate': '부동산',
    'finance': '재테크/주식',
    'online-store': '온라인스토어',
    'side-business': '부업',
    'coaching': '코칭',
  };
  return map[category] || category;
}

interface CourseDetailContentProps {
  course: Course;
}

export default function CourseDetailContent({ course }: CourseDetailContentProps): JSX.Element {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tabsRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState('소개');

  useEffect(() => {
    if (tabParam) {
      const matched = TABS.find((t) => t.replace(/\s/g, '') === tabParam.replace(/\s/g, ''));
      if (matched) {
        setActiveTab(matched);
        requestAnimationFrame(() => {
          tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  }, [tabParam]);

  return (
    <div className="course-detail-content">
      {/* 브레드크럼 */}
      <nav className="course-detail-content__breadcrumb" aria-label="경로">
        <Link href="/" className="course-detail-content__breadcrumb-link">홈</Link>
        <span className="course-detail-content__breadcrumb-sep">&gt;</span>
        <Link href="/courses" className="course-detail-content__breadcrumb-link">강의</Link>
        <span className="course-detail-content__breadcrumb-sep">&gt;</span>
        <Link href={`/courses?category=${course.category}`} className="course-detail-content__breadcrumb-link">
          {getCategoryLabel(course.category)}
        </Link>
        <span className="course-detail-content__breadcrumb-sep">&gt;</span>
        <span className="course-detail-content__breadcrumb-current">{course.title}</span>
      </nav>

      {/* 강의 썸네일 */}
      <div className="course-detail-content__thumb">
        <Image
          src={course.thumbnail}
          alt={course.thumbnailAlt}
          fill
          sizes="(max-width: 1023px) 100vw, 60vw"
          className="course-detail-content__thumb-image"
          priority
        />
        {course.badges.length > 0 && (
          <div className="course-detail-content__badge-overlay">
            {course.badges.map((badge) => (
              <span key={badge} className={`course-detail-content__badge course-detail-content__badge--${getBadgeVariant(badge)}`}>
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 모바일용 강의 기본 정보 */}
      <div className="course-detail-content__mobile-info">
        <h1 className="course-detail-content__course-title">{course.title}</h1>
        <p className="course-detail-content__course-summary">{course.summary}</p>
      </div>

      {/* 베스트 수강 후기 */}
      <div className="course-detail-content__reviews-section">
        <h3 className="course-detail-content__section-title">
          베스트 수강 후기
          {course.reviewCount != null && (
            <span className="course-detail-content__review-total">
              ({formatReviewCount(course.reviewCount)}개)
            </span>
          )}
        </h3>
        <div className="course-detail-content__reviews-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="course-detail-content__review-card">
              <div className="course-detail-content__review-header">
                <div className="course-detail-content__review-avatar">
                  <span className="course-detail-content__review-avatar-text">
                    {['김', '이', '박', '최'][i]}
                  </span>
                </div>
                <div className="course-detail-content__review-meta">
                  <span className="course-detail-content__review-name">
                    {['김**', '이**', '박**', '최**'][i]}
                  </span>
                  <span className="course-detail-content__review-stars">
                    {'★'.repeat(5)} 5.0
                  </span>
                </div>
              </div>
              <div className="course-detail-content__review-body">
                <p className="course-detail-content__review-text">
                  {[
                    '실무에서 바로 적용할 수 있는 내용이 가득했습니다. 강사님의 설명이 정말 이해하기 쉬웠어요.',
                    '기대 이상으로 만족스러운 강의였습니다. 특히 실전 사례가 많아서 좋았습니다.',
                    '초보자도 쉽게 따라할 수 있는 커리큘럼이 좋았어요. 강추합니다!',
                    '이 가격에 이런 퀄리티의 강의를 들을 수 있다니, 정말 감사합니다.',
                  ][i]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="course-detail-content__reviews-all"
          onClick={() => {
            setActiveTab('후기');
            requestAnimationFrame(() => {
              tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
          }}
        >
          전체 후기 보기
        </button>
      </div>

      {/* 앵커 탭 */}
      <div ref={tabsRef} className="course-detail-content__tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`course-detail-content__tab${tab === activeTab ? ' course-detail-content__tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 영역 */}
      <div className="course-detail-content__tab-panel">
        {activeTab === '소개' && (
          <>
            <h3 className="course-detail-content__section-title">수강 정보</h3>
            <div className="course-detail-content__info-grid">
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">수강 기간</span>
                <span className="course-detail-content__info-value">무제한</span>
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">총 강의 시간</span>
                <span className="course-detail-content__info-value">{course.duration}</span>
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">난이도</span>
                <span className="course-detail-content__info-value">{getLevelLabel(course.level)}</span>
              </div>
              <div className="course-detail-content__info-item">
                <span className="course-detail-content__info-label">강사</span>
                <span className="course-detail-content__info-value">{course.instructor}</span>
              </div>
            </div>

            <h3 className="course-detail-content__section-title">강의 설명</h3>
            <div className="course-detail-content__description">
              <p>{course.description}</p>
            </div>

            {course.faq.length > 0 && (
              <>
                <h3 className="course-detail-content__section-title">자주 묻는 질문</h3>
                <div className="course-detail-content__faq-list">
                  {course.faq.map((item, i) => (
                    <div key={i} className="course-detail-content__faq-item">
                      <div className="course-detail-content__faq-question">
                        <span className="course-detail-content__faq-icon">Q</span>
                        {item.question}
                      </div>
                      <div className="course-detail-content__faq-answer">
                        <span className="course-detail-content__faq-icon course-detail-content__faq-icon--answer">A</span>
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === '질문 · 답변' && (
          <div className="course-detail-content__placeholder">
            <p>아직 질문이 없습니다.</p>
          </div>
        )}

        {activeTab === '커리큘럼' && (
          <div className="course-detail-content__curriculum">
            <h3 className="course-detail-content__section-title">커리큘럼</h3>

            {/* SECTION 1 */}
            <div className="course-detail-content__curriculum-section">
              <div className="course-detail-content__curriculum-section-header">
                <span className="course-detail-content__curriculum-section-title">STEP 1. 입문</span>
                <span className="course-detail-content__curriculum-section-count">1강</span>
              </div>
              <ul className="course-detail-content__curriculum-list">
                <li className="course-detail-content__curriculum-item">
                  <Link
                    href={`/learn/${course.slug}/1`}
                    className="course-detail-content__curriculum-link"
                  >
                    <span className="course-detail-content__curriculum-play">▶</span>
                    <span className="course-detail-content__curriculum-name">오리엔테이션 - 강의 소개 및 학습 가이드</span>
                    <span className="course-detail-content__curriculum-duration">12:34</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* SECTION 2 */}
            <div className="course-detail-content__curriculum-section">
              <div className="course-detail-content__curriculum-section-header">
                <span className="course-detail-content__curriculum-section-title">STEP 2. 기본기 다지기</span>
                <span className="course-detail-content__curriculum-section-count">3강</span>
              </div>
              <ul className="course-detail-content__curriculum-list">
                {['핵심 개념 정리', '실전 사례 분석', '실습 과제 풀이'].map((name, i) => (
                  <li key={i} className="course-detail-content__curriculum-item course-detail-content__curriculum-item--locked">
                    <span className="course-detail-content__curriculum-lock">🔒</span>
                    <span className="course-detail-content__curriculum-name">{name}</span>
                    <span className="course-detail-content__curriculum-duration">
                      {['18:20', '25:45', '14:10'][i]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SECTION 3 */}
            <div className="course-detail-content__curriculum-section">
              <div className="course-detail-content__curriculum-section-header">
                <span className="course-detail-content__curriculum-section-title">STEP 3. 실전 적용</span>
                <span className="course-detail-content__curriculum-section-count">4강</span>
              </div>
              <ul className="course-detail-content__curriculum-list">
                {['실전 전략 수립', '포트폴리오 구성', '리스크 관리', '최종 정리 및 Q&A'].map((name, i) => (
                  <li key={i} className="course-detail-content__curriculum-item course-detail-content__curriculum-item--locked">
                    <span className="course-detail-content__curriculum-lock">🔒</span>
                    <span className="course-detail-content__curriculum-name">{name}</span>
                    <span className="course-detail-content__curriculum-duration">
                      {['22:30', '19:15', '16:40', '30:00'][i]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === '크리에이터' && (
          <div className="course-detail-content__creator">
            <div className="course-detail-content__creator-profile">
              <div className="course-detail-content__creator-avatar">
                <span className="course-detail-content__creator-avatar-text">
                  {course.instructor.charAt(0)}
                </span>
              </div>
              <div className="course-detail-content__creator-info">
                <h4 className="course-detail-content__creator-name">{course.instructor}</h4>
                <p className="course-detail-content__creator-role">{getCategoryLabel(course.category)} 전문 강사</p>
              </div>
            </div>
            <p className="course-detail-content__creator-bio">
              {course.instructor} 강사님은 {getCategoryLabel(course.category)} 분야에서
              다년간의 실무 경험을 바탕으로 수강생들에게 실전적인 노하우를 전달하고 있습니다.
            </p>
          </div>
        )}

        {activeTab === '후기' && (
          <div className="course-detail-content__all-reviews">
            <div className="course-detail-content__reviews-summary">
              <div className="course-detail-content__reviews-score">
                <span className="course-detail-content__reviews-score-number">
                  {course.rating?.toFixed(2) ?? '-'}
                </span>
                <span className="course-detail-content__reviews-score-stars">
                  {'★'.repeat(Math.round(course.rating ?? 0))}
                </span>
                <span className="course-detail-content__reviews-score-count">
                  {formatReviewCount(course.reviewCount ?? 0)}개 후기
                </span>
              </div>
            </div>

            {/* 베스트 후기 */}
            <h4 className="course-detail-content__section-title">베스트 수강 후기</h4>
            <div className="course-detail-content__reviews-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`best-${i}`} className="course-detail-content__review-card">
                  <div className="course-detail-content__review-header">
                    <div className="course-detail-content__review-avatar">
                      <span className="course-detail-content__review-avatar-text">
                        {['김', '이', '박', '최'][i]}
                      </span>
                    </div>
                    <div className="course-detail-content__review-meta">
                      <span className="course-detail-content__review-name">
                        {['김**', '이**', '박**', '최**'][i]}
                      </span>
                      <span className="course-detail-content__review-stars">
                        {'★'.repeat(5)} 5.0
                      </span>
                    </div>
                  </div>
                  <div className="course-detail-content__review-body">
                    <p className="course-detail-content__review-text">
                      {[
                        '실무에서 바로 적용할 수 있는 내용이 가득했습니다. 강사님의 설명이 정말 이해하기 쉬웠어요.',
                        '기대 이상으로 만족스러운 강의였습니다. 특히 실전 사례가 많아서 좋았습니다.',
                        '초보자도 쉽게 따라할 수 있는 커리큘럼이 좋았어요. 강추합니다!',
                        '이 가격에 이런 퀄리티의 강의를 들을 수 있다니, 정말 감사합니다.',
                      ][i]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 전체 후기 */}
            <h4 className="course-detail-content__section-title">전체 후기</h4>
            <div className="course-detail-content__review-list">
              {[
                { name: '정**', rating: 5, text: '부동산 투자에 대해 막연했는데, 이 강의를 듣고 체계적으로 공부할 수 있게 되었습니다. 특히 실전 사례 분석 파트가 매우 유익했어요.', date: '2026.02.15' },
                { name: '한**', rating: 5, text: '강사님이 어려운 내용도 쉽게 설명해주셔서 초보자인 저도 잘 따라갈 수 있었습니다. 수강 후 바로 실천에 옮기고 있습니다.', date: '2026.02.10' },
                { name: '윤**', rating: 4, text: '전반적으로 만족스러운 강의입니다. 다만 후반부 내용이 조금 빠르게 진행되어서 복습이 필요했어요.', date: '2026.02.05' },
                { name: '서**', rating: 5, text: '두 번째 수강인데 볼 때마다 새로운 인사이트를 얻습니다. 주변 지인들에게도 적극 추천하고 있어요!', date: '2026.01.28' },
                { name: '강**', rating: 5, text: '가성비 최고의 강의입니다. 이 정도 퀄리티의 내용을 이 가격에 들을 수 있다니 정말 감사합니다.', date: '2026.01.20' },
                { name: '임**', rating: 4, text: '커리큘럼 구성이 체계적이고 실전에 바로 적용할 수 있는 내용이 많아서 좋았습니다.', date: '2026.01.15' },
              ].map((review, i) => (
                <div key={`all-${i}`} className="course-detail-content__review-item">
                  <div className="course-detail-content__review-header">
                    <div className="course-detail-content__review-avatar">
                      <span className="course-detail-content__review-avatar-text">
                        {review.name.charAt(0)}
                      </span>
                    </div>
                    <div className="course-detail-content__review-meta">
                      <span className="course-detail-content__review-name">{review.name}</span>
                      <span className="course-detail-content__review-stars">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)} {review.rating}.0
                      </span>
                    </div>
                    <span className="course-detail-content__review-date">{review.date}</span>
                  </div>
                  <p className="course-detail-content__review-full-text">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
