/**
 * 플레이어 유틸 (player.js)
 * - 이어보기/진행률 계산 등 강의 플레이어 관련 헬퍼 함수를 제공한다
 * - localStorage를 활용한 진행률 캐싱, 이어보기 위치 복원 등을 처리한다
 */

const STORAGE_KEY_PREFIX = 'lecture_progress_';

/** 진행률을 localStorage에 저장 */
export function saveProgress(courseSlug, lectureId, position) {
  const key = `${STORAGE_KEY_PREFIX}${courseSlug}_${lectureId}`;
  const data = { position, updatedAt: Date.now() };

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage 용량 초과 등 예외 처리
  }
}

/** localStorage에서 이어보기 위치 복원 */
export function getLastPosition(courseSlug, lectureId) {
  const key = `${STORAGE_KEY_PREFIX}${courseSlug}_${lectureId}`;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const data = JSON.parse(raw);
    return data.position || 0;
  } catch {
    return 0;
  }
}

/** 진행률 퍼센트 계산 */
export function calcProgress(currentTime, duration) {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.round((currentTime / duration) * 100), 100);
}

/** 시간(초)을 mm:ss 형식으로 변환 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
