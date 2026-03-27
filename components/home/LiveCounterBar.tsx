/**
 * 실시간 수강 통계 카운터 (LiveCounterBar)
 * - 풀 블리드 배경, 4개 통계 아이템
 * - 스크롤 진입 시 카운트업 애니메이션
 */

'use client';

import { useState, useEffect, useRef, type JSX } from 'react';
import type { LiveCounterSection } from '@/types';
import CategoryIcon from './CategoryIcon';

interface LiveCounterBarProps {
  section: LiveCounterSection;
}

function useCountUp(target: number, active: boolean, duration = 1800): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start = 0;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * target);

      if (current !== start) {
        start = current;
        setCount(current);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(step);
  }, [active, target, duration]);

  return count;
}

function CounterItem({ icon, value, suffix, label, ariaLabel, active }: {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  ariaLabel: string;
  active: boolean;
}) {
  const displayed = useCountUp(value, active);

  return (
    <div className="home-counter__item" aria-label={ariaLabel}>
      <CategoryIcon icon={icon} className="home-counter__icon" />
      <span className="home-counter__value">
        {displayed.toLocaleString()}{suffix}
      </span>
      <span className="home-counter__label">{label}</span>
    </div>
  );
}

export default function LiveCounterBar({ section }: LiveCounterBarProps): JSX.Element {
  const { meta, items } = section;
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="home-counter" ref={ref} aria-label={meta.ariaLabel}>
      <div className="home-counter__inner">
        {items.map((item) => (
          <CounterItem key={item.label} {...item} active={active} />
        ))}
      </div>
    </section>
  );
}
