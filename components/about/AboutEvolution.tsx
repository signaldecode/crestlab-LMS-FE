import type { JSX } from 'react';
import Image from 'next/image';

interface Action {
  label: string;
  variant: 'ghost' | 'primary';
  ariaLabel: string;
}

export interface AboutEvolutionData {
  eyebrow: string;
  title: string;
  watermark: string;
  phone: { frame: string; alt: string; screens: string[] };
  mock: { heading: string; body: string; actions: Action[] };
}

interface Props {
  data: AboutEvolutionData;
}

export default function AboutEvolution({ data }: Props): JSX.Element {
  return (
    <section className="about__section about-evolution" aria-label={data.eyebrow}>
      <span className="about-evolution__watermark" aria-hidden="true">{data.watermark}</span>

      <header className="about-evolution__header">
        <span className="about__eyebrow about__eyebrow--on-dark">{data.eyebrow}</span>
        <h2 className="about__heading about__heading--on-dark about-evolution__title">{data.title}</h2>
      </header>

      <div className="about-evolution__content">
        <div className="about-evolution__phone">
          <Image
            className="about-evolution__phone-img"
            src={data.phone.frame}
            alt={data.phone.alt}
            width={640}
            height={666}
            sizes="(max-width: 1024px) 80vw, 420px"
          />
        </div>

        <div className="about-evolution__mock">
          <div className="about-evolution__mock-banner" aria-hidden="true" />
          <div className="about-evolution__mock-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <h3 className="about-evolution__mock-heading">{data.mock.heading}</h3>
          <p className="about-evolution__mock-body">{data.mock.body}</p>
          <div className="about-evolution__mock-actions">
            {data.mock.actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`about-evolution__mock-btn about-evolution__mock-btn--${action.variant}`}
                aria-label={action.ariaLabel}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
