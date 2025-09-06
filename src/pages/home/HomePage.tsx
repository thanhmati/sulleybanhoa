import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Categories } from './components/Categories';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';

export default function HomePage() {
  useScrollAnimation({ staggerSelectors: ['.category'] });

  return (
    <div>
      <Hero />
      <Intro />
      <Categories />
    </div>
  );
}
