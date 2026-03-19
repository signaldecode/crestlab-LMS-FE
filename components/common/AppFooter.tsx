/**
 * 앱 공통 푸터 (AppFooter)
 * - 다크 배경의 3단 구조: 로고+문의 / 네비링크 / 카피라이트+소셜
 * - 텍스트/링크는 data에서 가져온다
 */

import type { JSX } from 'react';
import Link from 'next/link';
import { getFooterData, getGeoData, getSiteData } from '@/lib/data';
import siteData from '@/data/siteData.json';

/** 소셜 플랫폼별 SVG 아이콘 */
function SocialIcon({ platform }: { platform: string }): JSX.Element | null {
  switch (platform) {
    case 'youtube':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case 'x':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AppFooter(): JSX.Element {
  const footer = getFooterData();
  const geo = getGeoData();
  const site = getSiteData();

  const mainLinks = footer?.mainLinks ?? [];
  const subLinks = footer?.subLinks ?? [];
  const subLinksRow1 = subLinks.slice(0, 4);
  const subLinksRow2 = subLinks.slice(4);

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="app-footer__inner">
        {/* 상단: 로고 + 문의하기 버튼 */}
        <div className="app-footer__top">
          <span className="app-footer__logo">{site.name}</span>
          {footer?.inquiryButton && (
            <Link
              href={footer.inquiryButton.href}
              className="app-footer__inquiry-btn"
              aria-label={footer.inquiryButton.ariaLabel}
            >
              {footer.inquiryButton.label}
            </Link>
          )}
        </div>

        {/* 중단: 메인 네비 + 서브 링크 */}
        <nav className="app-footer__nav" aria-label={siteData.a11y.nav.footerMenu}>
          <ul className="app-footer__main-links">
            {mainLinks.map((link, idx) => (
              <li key={link.href + idx} className="app-footer__main-link-item">
                <Link
                  href={link.href}
                  className={`app-footer__main-link${idx === mainLinks.length - 1 ? ' app-footer__main-link--accent' : ''}`}
                  aria-label={link.ariaLabel}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {subLinksRow1.length > 0 && (
            <ul className="app-footer__sub-links">
              {subLinksRow1.map((link, idx) => (
                <li key={link.href + idx} className="app-footer__sub-link-item">
                  <Link
                    href={link.href}
                    className="app-footer__sub-link"
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {subLinksRow2.length > 0 && (
            <ul className="app-footer__sub-links">
              {subLinksRow2.map((link, idx) => (
                <li key={link.href + idx} className="app-footer__sub-link-item">
                  <Link
                    href={link.href}
                    className="app-footer__sub-link"
                    aria-label={link.ariaLabel}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* 하단: 카피라이트 + 소셜 아이콘 */}
        <div className="app-footer__bottom">
          <p className="app-footer__copyright">{footer?.copyright}</p>

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
                    <SocialIcon platform={link.platform} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
