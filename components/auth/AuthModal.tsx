/**
 * 인증 모달 (AuthModal)
 * - 로그인 버튼 클릭 시 표시되는 모달 (로그인 전용)
 * - 회원가입은 /auth/signup 페이지로 분리
 * - 아이디/비밀번호 자체 로그인
 */

'use client';

import { useState, useCallback, type JSX } from 'react';
import Link from 'next/link';
import Modal from '@/components/layout/Modal';
import { getMainData } from '@/lib/data';
import pagesData from '@/data/pagesData.json';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalData = pagesData.auth.modal;

/**
 * 백엔드 로그인 호출 — `/api/auth/login` 프록시를 통해 `/api/v1/auth/login`으로 전달.
 * 백엔드는 Set-Cookie 헤더로 access/refresh 토큰을 쿠키에 저장하고,
 * 응답 body에는 `{ user: { id, nickname } }` 정도만 내려준다 (role 미포함).
 */
async function callLogin(email: string, password: string): Promise<{ ok: boolean }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });
  return { ok: res.ok };
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps): JSX.Element | null {
  const data = getMainData();
  const siteName = data.site.name;
  const loginData = (data.pages as Record<string, Record<string, Record<string, string>>>)?.auth?.login;

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleLogin: React.FormEventHandler<HTMLFormElement> = useCallback(async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setLoginError('');
    try {
      // 백엔드 로그인 → 쿠키 발급
      const { ok } = await callLogin(loginEmail, loginPassword);
      if (!ok) {
        setLoginError(modalData.loginError ?? '로그인에 실패했습니다.');
        setSubmitting(false);
        return;
      }
      // 하드 리다이렉트 — 전체 페이지 리로드로 쿠키 기반 세션을 처음부터 재부팅
      // (Zustand 스토어 / 찜 목록 / 서버 컴포넌트 모두 새 상태로 자연 동기화)
      window.location.href = '/';
    } catch {
      setLoginError(modalData.loginError ?? '로그인에 실패했습니다.');
      setSubmitting(false);
    }
  }, [loginEmail, loginPassword, submitting]);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="" closeOnOverlayClick={false}>
      <div className="auth-modal">
        <h2 className="auth-modal__title">{siteName}</h2>

        <p className="auth-modal__subtitle">
          {modalData.subtitle}
        </p>

        {/* 이메일/비밀번호 폼 */}
        <form className="auth-modal__form" onSubmit={handleLogin}>
          <input
            type="email"
            className="auth-modal__input"
            placeholder={loginData?.usernamePlaceholder}
            aria-label={loginData?.usernameLabel}
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            className="auth-modal__input"
            placeholder={loginData?.passwordPlaceholder}
            aria-label={loginData?.passwordLabel}
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {loginError && (
            <p className="auth-modal__error" role="alert">{loginError}</p>
          )}
          <button type="submit" className="auth-modal__submit" disabled={submitting}>
            {loginData?.submitLabel}
          </button>
        </form>

        {/* 하단 링크 */}
        <div className="auth-modal__links">
          <button type="button" className="auth-modal__link" onClick={() => {}}>
            {modalData.findAccountLabel}
          </button>
          <span className="auth-modal__divider">|</span>
          <Link href="/auth/signup" className="auth-modal__link" onClick={handleClose}>
            {modalData.signupLabel}
          </Link>
        </div>
      </div>
    </Modal>
  );
}
