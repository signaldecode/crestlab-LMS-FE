/**
 * 내가 쓴 글 보러가기 버튼 (MyPostsButton)
 * - 로그인 상태: /mypage 로 이동
 * - 비로그인 상태: 로그인 모달을 연다
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import AuthModal from '@/components/auth/AuthModal';

export default function MyPostsButton() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = useCallback(() => {
    if (isLoggedIn) {
      router.push('/mypage');
    } else {
      setIsModalOpen(true);
    }
  }, [isLoggedIn, router]);

  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <button type="button" className="community-sidebar__my-posts-btn" onClick={handleClick}>
        내가 쓴 글 보러가기
      </button>
      <AuthModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
