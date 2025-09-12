import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Categories } from './components/Categories';
import { FeaturedProduct } from './components/FeaturedProduct';
import { Hero } from './components/Hero';
import { Intro } from './components/Intro';

export default function HomePage() {
  useScrollAnimation({ staggerSelectors: ['.category', '.product'] });

  return (
    <div>
      <Hero />
      <Intro />
      <Categories />
      <FeaturedProduct />
    </div>
  );
}
