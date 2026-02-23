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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}



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
          지금 가입 하고
        </p>
        <p className="auth-modal__subtitle">
          <span className="auth-modal__highlight">ㅇㅇㅇ님 칼럼과 자료를 무료로 받으세요!</span>
        </p>

        {/* 카카오 로그인 버튼 */}
        <div className="auth-modal__social">
          <button type="button" className="auth-modal__social-btn auth-modal__social-btn--kakao">
            💬 {login?.socialKakao ?? '카카오로 3초만에 시작하기'}
          </button>
        </div>

        {/* 소셜 아이콘 (네이버, 구글, 애플) */}
        <div className="auth-modal__social-icons">
          <button type="button" className="auth-modal__social-icon auth-modal__social-icon--naver" aria-label="네이버 로그인">
            N
          </button>
          <button type="button" className="auth-modal__social-icon auth-modal__social-icon--google" aria-label="구글 로그인">
            G
          </button>
          <button type="button" className="auth-modal__social-icon auth-modal__social-icon--apple" aria-label="애플 로그인">
            A
          </button>
        </div>

        {/* 이메일/비밀번호 폼 */}
        <form className="auth-modal__form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            className="auth-modal__input"
            placeholder={login?.emailPlaceholder ?? '이메일 또는 아이디'}
            aria-label={login?.emailLabel ?? '이메일'}
          />
          <input
            type="password"
            className="auth-modal__input"
            placeholder={login?.passwordPlaceholder ?? '비밀번호'}
            aria-label={login?.passwordLabel ?? '비밀번호'}
          />
          <button type="submit" className="auth-modal__submit">
            {login?.submitLabel ?? '로그인'}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="auth-modal__links">
          <button type="button" className="auth-modal__link" onClick={() => {}}>
            아이디(계정)·비밀번호 찾기
          </button>
          <span className="auth-modal__divider">|</span>
          <button type="button" className="auth-modal__link" onClick={() => {}}>
            이메일 회원가입
          </button>
        </div>
      </div>
    </Modal>
  );
}
