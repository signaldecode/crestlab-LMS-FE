/**
 * 앱 공통 푸터 (AppFooter)
 * - 사이트 전역에서 항상 표시되는 하단 푸터
 * - 약관/정책 링크, 사업자 정보, 연락처, 소셜 링크, 카피라이트를 포함한다
 * - 텍스트/링크는 data에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getFooterData, getGeoData, getSiteData } from '@/lib/data';

export default function AppFooter(): JSX.Element {
  const footer = getFooterData();
  const geo = getGeoData();
  const site = getSiteData();

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="app-footer__inner">
        {/* 상단: 사이트명 + 약관/정책 링크 */}
        <div className="app-footer__top">
          <span className="app-footer__site-name">{site.name}</span>
          <nav className="app-footer__links" aria-label="하단 메뉴">
            <ul className="app-footer__link-list">
              {footer?.links.map((link) => (
                <li key={link.href} className="app-footer__link-item">
                  <Link
                    href={link.href}
                    className="app-footer__link"
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 중단: 사업자 정보 + 연락처 */}
        <div className="app-footer__info">
          {footer?.business && (
            <dl className="app-footer__business">
              <div className="app-footer__business-row">
                <dt className="app-footer__dt">{footer.business.label}</dt>
                <dd className="app-footer__dd">{footer.business.companyName}</dd>
              </div>
              <div className="app-footer__business-row">
                <dt className="app-footer__dt">대표</dt>
                <dd className="app-footer__dd">{footer.business.ceo}</dd>
              </div>
              <div className="app-footer__business-row">
                <dt className="app-footer__dt">사업자등록번호</dt>
                <dd className="app-footer__dd">{footer.business.registrationNumber}</dd>
              </div>
              <div className="app-footer__business-row">
                <dt className="app-footer__dt">통신판매업신고</dt>
                <dd className="app-footer__dd">{footer.business.ecommerceRegistration}</dd>
              </div>
            </dl>
          )}

          {geo && (
            <address className="app-footer__contact">
              <span className="app-footer__address">{geo.address}</span>
              <span className="app-footer__phone">{geo.phone}</span>
              <span className="app-footer__email">{geo.organization.email}</span>
            </address>
          )}
        </div>

        {/* 하단: 소셜 링크 + 카피라이트 */}
        <div className="app-footer__bottom">
          {geo?.social && geo.social.length > 0 && (
            <ul className="app-footer__social-list">
              {geo.social.map((link) => (
                <li key={link.platform} className="app-footer__social-item">
                  <a
                    href={link.url}
                    className="app-footer__social-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="app-footer__copyright">{footer?.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
