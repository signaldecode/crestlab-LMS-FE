/**
 * 커뮤니티 프로필 모달 (CommunityProfileModal)
 * - 게시글/댓글 작성자를 클릭했을 때 표시되는 간략 프로필 모달
 * - 프로필 이미지, 닉네임, 활동 내역 요약 등을 보여준다
 * - Modal 공용 컴포넌트를 활용한다
 */

import Modal from '@/components/layout/Modal';

export default function CommunityProfileModal({ isOpen, onClose, user }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="프로필">
      {/* 사용자 프로필 정보가 렌더링된다 */}
    </Modal>
  );
}
