import type { JSX } from 'react';

interface SelectItem { id: string; label: string; value: string }
interface InputItem  { id: string; label: string; value: string }

export interface AboutTrustData {
  eyebrow: string;
  title: string;
  body: string;
  mock: {
    ariaLabel: string;
    selects: SelectItem[];
    input: InputItem;
    switchLabel: string;
    cta: string;
    card: {
      brand: string;
      masked: string;
      holderLabel: string;
      holderValue: string;
      expiryLabel: string;
      expiryValue: string;
    };
  };
}

interface Props {
  data: AboutTrustData;
}

export default function AboutTrust({ data }: Props): JSX.Element {
  const { mock } = data;

  return (
    <section className="about__section about-trust" aria-label={data.eyebrow}>
      <div className="about-trust__inner">
        <div className="about-trust__card" role="group" aria-label={mock.ariaLabel}>
          <div className="about-trust__form">
            <div className="about-trust__row">
              {mock.selects.map((s) => (
                <div key={s.id} className="about-trust__select">
                  <label htmlFor={s.id} className="sr-only">{s.label}</label>
                  <span id={s.id}>{s.value}</span>
                </div>
              ))}
            </div>

            <label htmlFor={mock.input.id} className="sr-only">{mock.input.label}</label>
            <div id={mock.input.id} className="about-trust__input">{mock.input.value}</div>

            <div className="about-trust__switch">
              <span className="about-trust__switch-track" aria-hidden="true" />
              <span className="about-trust__switch-label">{mock.switchLabel}</span>
            </div>

            <button type="button" className="about-trust__cta">{mock.cta}</button>
          </div>

          <div className="about-trust__credit-card" role="img" aria-label={`${mock.card.brand} 신용카드 디자인 예시`}>
            <div className="about-trust__credit-card-brand" aria-hidden="true">
              <span />
              <span />
            </div>
            <div className="about-trust__credit-card-chip" aria-hidden="true" />
            <div className="about-trust__credit-card-number">{mock.card.masked}</div>
            <div className="about-trust__credit-card-footer">
              <div>
                <span className="about-trust__credit-card-label">{mock.card.holderLabel}</span>
                <span className="about-trust__credit-card-value">{mock.card.holderValue}</span>
              </div>
              <div>
                <span className="about-trust__credit-card-label">{mock.card.expiryLabel}</span>
                <span className="about-trust__credit-card-value">{mock.card.expiryValue}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-trust__copy">
          <span className="about__eyebrow">{data.eyebrow}</span>
          <h2 className="about-trust__title">{data.title}</h2>
          <p className="about-trust__body">{data.body}</p>
        </div>
      </div>
    </section>
  );
}
