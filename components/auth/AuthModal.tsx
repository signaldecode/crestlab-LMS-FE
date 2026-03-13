/**
 * 인증 모달 (AuthModal)
 * - 로그인/회원가입 버튼 클릭 시 표시되는 모달
 * - 소셜 로그인(카카오, 네이버, 구글, 애플) + 이메일/비밀번호 폼
 * - 기존 Modal 컴포넌트를 래핑한다
 */

'use client';

import type { JSX } from 'react';
import Modal from '@/components/layout/Modal';
import { getMainData } from '@/lib/data';
import pagesData from '@/data/pagesData.json';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalData = pagesData.auth.modal;

export default function AuthModal({ isOpen, onClose }: AuthModalProps): JSX.Element | null {
  const data = getMainData();
  const siteName = data.site.name;
  const login = (data.pages as Record<string, Record<string, Record<string, string>>>)?.auth?.login;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="auth-modal">
        {/* 타이틀 */}
        <h2 className="auth-modal__title">{siteName}</h2>

        <p className="auth-modal__subtitle">
          {modalData.subtitle}
        </p>
        <p className="auth-modal__subtitle">
          <span className="auth-modal__highlight">{modalData.highlight}</span>
        </p>

        {/* 카카오 로그인 버튼 */}
        <div className="auth-modal__social">
          <button type="button" className="auth-modal__social-btn auth-modal__social-btn--kakao">
            💬 {login?.socialKakao ?? modalData.socialKakaoLabel}
          </button>
        </div>

        {/* 소셜 아이콘 (네이버, 구글, 애플) */}
        <div className="auth-modal__social-icons">
          <button type="button" className="auth-modal__social-icon auth-modal__social-icon--naver" aria-label={modalData.socialNaverAriaLabel}>
            N
          </button>
          <button type="button" className="auth-modal__social-icon auth-modal__social-icon--google" aria-label={modalData.socialGoogleAriaLabel}>
            G
          </button>
          <button type="button" className="auth-modal__social-icon auth-modal__social-icon--apple" aria-label={modalData.socialAppleAriaLabel}>
            A
          </button>
        </div>

        {/* 이메일/비밀번호 폼 */}
        <form className="auth-modal__form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            className="auth-modal__input"
            placeholder={login?.emailPlaceholder}
            aria-label={login?.emailLabel}
          />
          <input
            type="password"
            className="auth-modal__input"
            placeholder={login?.passwordPlaceholder}
            aria-label={login?.passwordLabel}
          />
          <button type="submit" className="auth-modal__submit">
            {login?.submitLabel}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="auth-modal__links">
          <button type="button" className="auth-modal__link" onClick={() => {}}>
            {modalData.findAccountLabel}
          </button>
          <span className="auth-modal__divider">|</span>
          <button type="button" className="auth-modal__link" onClick={() => {}}>
            {modalData.emailSignupLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
