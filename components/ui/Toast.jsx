/**
 * 토스트 알림 (Toast)
 * - 사용자 액션 결과를 일시적으로 알려주는 알림 메시지 UI
 * - role="alert"로 스크린리더 접근성을 지원한다
 * - type(success/error/info)에 따라 스타일을 분기한다
 */

export default function Toast({ message, type = 'info', isVisible }) {
  if (!isVisible) return null;

  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <p className="toast__message">{message}</p>
    </div>
  );
}
