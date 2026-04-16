import type { JSX } from 'react';
import Image from 'next/image';

interface Card {
  icon: string;
  iconAlt: string;
  title: string;
  body: string;
}

export interface AboutExperienceData {
  eyebrow: string;
  title: string;
  cards: Card[];
  banner: { top: string; bottom: string };
}

interface Props {
  data: AboutExperienceData;
}

export default function AboutExperience({ data }: Props): JSX.Element {
  return (
    <section className="about__section about-experience" aria-label={data.eyebrow}>
      <header className="about-experience__header">
        <span className="about__eyebrow about__eyebrow--on-dark">{data.eyebrow}</span>
        <h2 className="about__heading about__heading--on-dark about-experience__title">{data.title}</h2>
      </header>

      <div className="about-experience__cards">
        {data.cards.map((card) => (
          <article key={card.title} className="about-experience__card">
            <Image
              className="about-experience__card-icon"
              src={card.icon}
              alt={card.iconAlt}
              width={160}
              height={200}
            />
            <h3 className="about-experience__card-title">{card.title}</h3>
            <p className="about-experience__card-body">{card.body}</p>
          </article>
        ))}
      </div>

      <div className="about-experience__banner">
        <div className="about-experience__banner-top">{data.banner.top}</div>
        <div className="about-experience__banner-bottom">{data.banner.bottom}</div>
      </div>
    </section>
  );
}
