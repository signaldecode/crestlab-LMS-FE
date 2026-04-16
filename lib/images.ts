/**
 * 이미지 관련 상수/유틸
 */

/** 백엔드가 썸네일 URL 을 내려주지 않을 때 사용할 기본 이미지 */
export const PLACEHOLDER_THUMB = '/images/placeholder-thumb.svg';

/** 빈/ null 썸네일 URL 을 플레이스홀더로 대체 */
export function resolveThumb(url: string | null | undefined): string {
  return url && url.trim().length > 0 ? url : PLACEHOLDER_THUMB;
}

/**
 * next/image 에 넘길 수 있는 형태로 URL 을 정규화한다.
 * - http(s) 절대 URL → 그대로
 * - `/` 로 시작 → 그대로 (같은 오리진)
 * - 그 외 상대경로(`images/...`) → 앞에 `/` 를 붙여 same-origin 상대 경로로 처리
 * - 빈값 → null
 */
export function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (trimmed.length === 0) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) return trimmed;
  return `/${trimmed}`;
}
