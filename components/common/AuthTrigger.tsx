/**
 * 인증 트리거 (AuthTrigger)
 * - 로그인 버튼 클릭 시 AuthModal을 띄운다
 * - 회원가입 버튼은 /auth/signup 페이지로 이동한다
 * - useAuthStore의 isLoginModalOpen을 구독하여 외부에서도 모달을 열 수 있다
 */

'use client';

import { useCallback, type JSX } from 'react';
import Link from 'next/link';
import useAuthStore from '@/stores/useAuthStore';
import AuthModal from '@/components/auth/AuthModal';

interface AuthTriggerProps {
  loginLabel: string;
  signupLabel: string;
}

export default function AuthTrigger({ loginLabel, signupLabel }: AuthTriggerProps): JSX.Element {
  const isModalOpen = useAuthStore((s) => s.isLoginModalOpen);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);
  const closeLoginModal = useAuthStore((s) => s.closeLoginModal);

  const openLogin = useCallback(() => {
    openLoginModal();
  }, [openLoginModal]);

  const closeModal = useCallback(() => {
    closeLoginModal();
  }, [closeLoginModal]);

  return (
    <>
      <div className="app-header__auth">
        <button
          type="button"
          className="app-header__auth-link"
          onClick={openLogin}
        >
          {loginLabel}
        </button>
        <Link
          href="/auth/signup"
          className="app-header__auth-link app-header__auth-link--signup"
        >
          {signupLabel}
        </Link>
      </div>
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
