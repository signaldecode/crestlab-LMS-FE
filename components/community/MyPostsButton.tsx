/**
 * 내가 쓴 글 보러가기 버튼 (MyPostsButton)
 * - /mypage/me 프로필 페이지로 이동한다
 */

import Link from 'next/link';

export default function MyPostsButton() {
  return (
    <Link href="/mypage/me" className="community-sidebar__my-posts-btn">
      내가 쓴 글 보러가기
    </Link>
  );
}
