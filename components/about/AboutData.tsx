import type { JSX } from 'react';

interface Bar {
  label: string;
  height: number;
  caption: string;
  tone: 'muted' | 'accent';
}

interface Card {
  title: string;
  body: string;
  chartAriaLabel: string;
  bars: Bar[];
}

export interface AboutDataData {
  eyebrow: string;
  title: string;
  cards: Card[];
}

interface Props {
  data: AboutDataData;
}

export default function AboutData({ data }: Props): JSX.Element {
  return (
    <section className="about__section about-data" aria-label={data.eyebrow}>
      <header className="about-data__header">
        <span className="about__eyebrow about__eyebrow--on-dark">{data.eyebrow}</span>
        <h2 className="about__heading about__heading--on-dark about-data__title">{data.title}</h2>
      </header>

      <div className="about-data__cards">
        {data.cards.map((card, idx) => (
          <article key={idx} className="about-data__card">
            <div>
              <h3 className="about-data__card-heading">{card.title}</h3>
              <p className="about-data__card-body">{card.body}</p>
            </div>
            <div
              className="about-data__chart"
              role="img"
              aria-label={card.chartAriaLabel}
            >
              {card.bars.map((bar) => (
                <div key={bar.caption} className={`about-data__bar about-data__bar--${bar.tone}`}>
                  <span className="about-data__bar-label">{bar.label}</span>
                  <span
                    className="about-data__bar-shape"
                    style={{ height: `${bar.height / 16}rem` }}
                    aria-hidden="true"
                  />
                  <span className="about-data__bar-caption">{bar.caption}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
