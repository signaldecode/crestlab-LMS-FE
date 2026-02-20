/**
 * SEO 헬퍼 (seo.js)
 * - Next.js Metadata API용 메타데이터 객체를 생성한다
 * - JSON-LD 구조화 데이터(Course, FAQPage, BreadcrumbList, Organization 등)를 생성한다
 * - 모든 텍스트는 data에서 가져오며 하드코딩하지 않는다
 */

import { getSiteData } from '@/lib/data';

/** 강의 상세 페이지 메타데이터 생성 */
export function generateCourseMetadata(course) {
  if (!course) return {};

  const site = getSiteData();

  return {
    title: `${course.title} — ${site.name}`,
    description: course.summary,
    openGraph: {
      title: course.title,
      description: course.summary,
      images: [{ url: course.thumbnail, alt: course.thumbnailAlt }],
    },
  };
}

/** FAQPage JSON-LD 생성 */
export function generateFaqJsonLd(faqItems = []) {
  if (faqItems.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Course JSON-LD 생성 */
export function generateCourseJsonLd(course) {
  if (!course) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.summary,
    provider: {
      '@type': 'Organization',
      name: getSiteData().name,
    },
  };
}

/** BreadcrumbList JSON-LD 생성 */
export function generateBreadcrumbJsonLd(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.href,
    })),
  };
}
