import { useEffect } from 'react';

type ScrollAnimationOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  animatedClassName?: string;
  activeClassName?: string;
};

export function useScrollAnimation({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  animatedClassName = 'animate-on-scroll',
  activeClassName = 'animated',
}: ScrollAnimationOptions = {}) {
  useEffect(() => {
    const animatedElements = document.querySelectorAll<HTMLElement>(`.${animatedClassName}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add(`${activeClassName}`);
            });
          }
        });
      },
      { root, rootMargin, threshold },
    );

    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [root, rootMargin, threshold]);
}
