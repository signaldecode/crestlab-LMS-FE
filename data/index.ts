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
import communityData from './communityData.json';
import accountData from './accountData.json';
import supportData from './supportData.json';

import type { MainData, CommunityData, GiftcardData, GiftcardHistoryData, FollowUserData, EnrolledCourseData } from '@/types';

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
  homeCommunity: homeData.homeCommunity,
  homePromoBanners: homeData.homePromoBanners,
  homeNews: homeData.homeNews,
  ctaBanner: homeData.ctaBanner,
  faq: homeData.faq,
  footer: siteData.footer,
  a11y: siteData.a11y,
  geo: siteData.geo,
  seo: siteData.seo,
  community: communityData as unknown as CommunityData,
  consultations: accountData.consultations,
  reviews: accountData.reviews,
  certificates: accountData.certificates,
  orders: accountData.orders,
  expiredCoupons: accountData.expiredCoupons,
  giftcards: accountData.giftcards as unknown as GiftcardData[],
  giftcardHistory: accountData.giftcardHistory as unknown as GiftcardHistoryData[],
  followers: accountData.followers as unknown as FollowUserData[],
  following: accountData.following as unknown as FollowUserData[],
  enrolledCourses: accountData.enrolledCourses as unknown as EnrolledCourseData[],
};

export { uiData, supportData };
export default mainData;
