/**
 * 데이터 진입점 (data/index.ts)
 * - 카테고리별로 분리된 JSON 파일들을 합쳐서 MainData 타입으로 export한다
 * - lib/data.ts에서 이 파일을 import하여 사용한다
 */

import siteData from './siteData.json';
import uiData from './uiData.json';
import pagesData from './pagesData.json';
import coursesData from './coursesData.json';
import homeData from './homeData.json';
import accountData from './accountData.json';
import supportData from './supportData.json';
import boardData from './boardData.json';

import type { MainData, GiftcardData, GiftcardHistoryData, EnrolledCourseData, BoardData } from '@/types';

const mainData: MainData = {
  site: siteData.site,
  nav: siteData.nav,
  ui: uiData,
  pages: pagesData,
  courses: coursesData,
  homeSections: homeData.homeSections,
  homeTabbedSections: homeData.homeTabbedSections,
  homeCategories: homeData.homeCategories,
  upcomingCourses: homeData.upcomingCourses,
  bestCourses: homeData.bestCourses,
  bestChipCategories: homeData.bestChipCategories,
  bestReviews: homeData.bestReviews,
  popularArticles: homeData.popularArticles,
  homeBestArticles: homeData.homeBestArticles,
  liveCounter: homeData.liveCounter,
  homeInstructors: homeData.homeInstructors,
  homePromoBanners: homeData.homePromoBanners,
  homeNews: homeData.homeNews,
  ctaBanner: homeData.ctaBanner,
  faq: homeData.faq,
  footer: siteData.footer,
  a11y: siteData.a11y,
  geo: siteData.geo,
  seo: siteData.seo,
  consultations: accountData.consultations,
  reviews: accountData.reviews,
  certificates: accountData.certificates,
  orders: accountData.orders,
  expiredCoupons: accountData.expiredCoupons,
  giftcards: accountData.giftcards as unknown as GiftcardData[],
  giftcardHistory: accountData.giftcardHistory as unknown as GiftcardHistoryData[],
  enrolledCourses: accountData.enrolledCourses as unknown as EnrolledCourseData[],
  board: boardData as unknown as BoardData,
};

export { uiData, supportData };
export default mainData;
