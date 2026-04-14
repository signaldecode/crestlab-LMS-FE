/**
 * 이미지 관련 상수/유틸
 */

/** 백엔드가 썸네일 URL 을 내려주지 않을 때 사용할 기본 이미지 */
export const PLACEHOLDER_THUMB = '/images/placeholder-thumb.svg';

/** 빈/ null 썸네일 URL 을 플레이스홀더로 대체 */
export function resolveThumb(url: string | null | undefined): string {
  return url && url.trim().length > 0 ? url : PLACEHOLDER_THUMB;
}
