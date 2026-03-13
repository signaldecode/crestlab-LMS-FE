/**
 * 플레이어 유틸 (player.ts)
 * - 이어보기/진행률 계산 등 강의 플레이어 관련 헬퍼 함수를 제공한다
 * - localStorage를 활용한 진행률 캐싱, 이어보기 위치 복원 등을 처리한다
 */

const STORAGE_KEY_PREFIX = 'lecture_progress_';

interface ProgressData {
  position: number;
  updatedAt: number;
}

/** 진행률을 localStorage에 저장 */
export function saveProgress(courseSlug: string, lectureId: string, position: number): void {
  const key = `${STORAGE_KEY_PREFIX}${courseSlug}_${lectureId}`;
  const data: ProgressData = { position, updatedAt: Date.now() };

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage 용량 초과 등 예외 처리
  }
}

/** localStorage에서 이어보기 위치 복원 */
export function getLastPosition(courseSlug: string, lectureId: string): number {
  const key = `${STORAGE_KEY_PREFIX}${courseSlug}_${lectureId}`;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const data: ProgressData = JSON.parse(raw);
    return data.position || 0;
  } catch {
    return 0;
  }
}

/** 진행률 퍼센트 계산 */
export function calcProgress(currentTime: number, duration: number): number {
  if (!duration || duration <= 0) return 0;
  return Math.min(Math.round((currentTime / duration) * 100), 100);
}

/** 시간(초)을 mm:ss 형식으로 변환 */
export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/* ── 배속 기억 (localStorage) ── */

const PLAYBACK_RATE_KEY = 'lecture_playback_rate';

/** 마지막 사용 배속을 localStorage에 저장 */
export function savePlaybackRate(rate: number): void {
  try {
    localStorage.setItem(PLAYBACK_RATE_KEY, String(rate));
  } catch {
    // localStorage 용량 초과 등 예외 무시
  }
}

/** localStorage에서 마지막 사용 배속을 복원 (기본값 1) */
export function getPlaybackRate(): number {
  try {
    const raw = localStorage.getItem(PLAYBACK_RATE_KEY);
    if (!raw) return 1;
    const rate = Number(raw);
    return rate > 0 && rate <= 4 ? rate : 1;
  } catch {
    return 1;
  }
}
