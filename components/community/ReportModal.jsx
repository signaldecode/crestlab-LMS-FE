/**
 * 신고 모달 (ReportModal)
 * - 게시글/댓글 신고 시 사유를 선택하는 모달 다이얼로그
 * - Modal 공용 컴포넌트를 활용한다
 * - 신고 사유 목록은 data에서 가져온다
 */

'use client';

import Modal from '@/components/layout/Modal';

export default function ReportModal({ isOpen, onClose, onSubmit, targetType }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="신고하기">
      <form className="report-modal__form" onSubmit={onSubmit}>
        {/* 신고 사유 라디오 버튼 목록 + 제출 버튼이 렌더링된다 */}
      </form>
    </Modal>
  );
}
