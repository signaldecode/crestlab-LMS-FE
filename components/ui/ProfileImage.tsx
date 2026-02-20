/**
 * 프로필 이미지 (ProfileImage)
 * - 사용자 프로필 사진을 표시하는 공통 이미지 컴포넌트
 * - alt 텍스트는 반드시 props(data)에서 받는다
 * - 이미지가 없을 경우 기본 아바타를 표시한다
 */

import Image from 'next/image';

interface ProfileImageProps {
  src?: string;
  alt: string;
  size?: number;
}

export default function ProfileImage({ src, alt, size = 48 }: ProfileImageProps) {
  return (
    <div className="profile-image" style={{ width: size, height: size }}>
      {src ? (
        <Image
          className="profile-image__img"
          src={src}
          alt={alt}
          width={size}
          height={size}
        />
      ) : (
        <span className="profile-image__placeholder" aria-label={alt} />
      )}
    </div>
  );
}
