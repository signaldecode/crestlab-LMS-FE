import type { JSX } from 'react';

interface Instructor {
  name: string;
  followers: number;
  active?: boolean;
}

export interface AboutProfessionalsData {
  eyebrow: string;
  title: string;
  body: string;
  followLabel: string;
  listAriaLabel: string;
  instructors: Instructor[];
}

interface Props {
  data: AboutProfessionalsData;
}

const AVATAR_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#BB8FCE'];

function AvatarSvg({ name, index }: { name: string; index: number }) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const initial = name.charAt(0);
  return (
    <svg
      className="about-professionals__avatar"
      viewBox="0 0 44 44"
      role="img"
      aria-label={`${name} 프로필 이미지`}
    >
      <circle cx="22" cy="22" r="22" fill={color} opacity="0.18" />
      <circle cx="22" cy="17" r="7" fill={color} />
      <ellipse cx="22" cy="33" rx="11" ry="8" fill={color} />
      <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{initial}</text>
    </svg>
  );
}

export default function AboutProfessionals({ data }: Props): JSX.Element {
  return (
    <section className="about__section about-professionals" aria-label={data.eyebrow}>
      <div className="about-professionals__inner">
        <div className="about-professionals__copy">
          <span className="about__eyebrow">{data.eyebrow}</span>
          <h2 className="about-professionals__title">{data.title}</h2>
          <p className="about-professionals__body">{data.body}</p>
        </div>

        <div className="about-professionals__card">
          <ul className="about-professionals__list" aria-label={data.listAriaLabel}>
            {data.instructors.map((ins, idx) => (
              <li
                key={ins.name}
                className={`about-professionals__item${ins.active ? ' about-professionals__item--active' : ''}`}
              >
                <div className="about-professionals__profile">
                  <AvatarSvg name={ins.name} index={idx} />
                  <div className="about-professionals__meta">
                    <span className="about-professionals__name">{ins.name}</span>
                    <span className="about-professionals__followers">팔로워 {ins.followers.toLocaleString('ko-KR')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="about-professionals__follow-btn"
                  aria-label={`${ins.name} ${data.followLabel}`}
                >
                  {data.followLabel}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
