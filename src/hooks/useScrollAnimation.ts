import { useEffect } from 'react';

type ScrollAnimationOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
  staggerSelectors?: string[]; // cho phép truyền nhiều selector cần stagger
  staggerDelay?: number; // default 0.2s
};

export function useScrollAnimation({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  staggerSelectors = [],
  staggerDelay = 0.2,
}: ScrollAnimationOptions = {}) {
  useEffect(() => {
    const animatedElements = document.querySelectorAll<HTMLElement>('.animate-on-scroll');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            requestAnimationFrame(() => {
              entry.target.classList.add('animated');
            });
          }
        });
      },
      { root, rootMargin, threshold },
    );

    animatedElements.forEach((el) => observer.observe(el));

    // generic stagger
    staggerSelectors.forEach((selector) => {
      const elements = document.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el, i) => {
        el.style.transitionDelay = `${i * staggerDelay}s`;
      });
    });

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, staggerSelectors, staggerDelay]);
}
