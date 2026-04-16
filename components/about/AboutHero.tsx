import type { JSX } from 'react';
import Image from 'next/image';

export interface AboutHeroData {
  eyebrow: string;
  title: string;
  tablet: {
    alt: string;
    dashboardAlt: string;
    chips: string[];
    guides: string[];
  };
}

interface Props {
  data: AboutHeroData;
}

export default function AboutHero({ data }: Props): JSX.Element {
  const chipModifiers = ['a', 'b', 'c', 'd'] as const;

  return (
    <section className="about__section about-hero" aria-label={data.eyebrow}>
      <div className="about-hero__copy">
        <span className="about__eyebrow">{data.eyebrow}</span>
        <h1 className="about__heading about-hero__title">{data.title}</h1>
      </div>

      <div className="about-hero__visual" aria-hidden="true">
        <div className="about-hero__tablet-bg">
          <Image
            className="about-hero__tablet-bg-img"
            src="/images/about/tabletbg.png"
            alt=""
            width={1280}
            height={460}
            sizes="(max-width: 1024px) 100vw, 1280px"
          />
        </div>

        <div className="about-hero__guides">
          {data.tablet.guides.map((label) => (
            <span key={label} className="about-hero__guide">{label}</span>
          ))}
        </div>

        <div className="about-hero__chips">
          {data.tablet.chips.map((label, idx) => {
            const mod = chipModifiers[idx] ?? 'a';
            return (
              <span
                key={label}
                className={`about-hero__chip about-hero__chip--${mod}`}
              >
                {label}
              </span>
            );
          })}
        </div>

        <div className="about-hero__tablet">
          <Image
            className="about-hero__tablet-img"
            src="/images/about/tablet.png"
            alt={data.tablet.alt}
            width={828}
            height={553}
            priority
            sizes="(max-width: 1024px) 80vw, 828px"
          />
        </div>
      </div>
    </section>
  );
}
