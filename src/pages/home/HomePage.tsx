import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Categories } from './components/Categories';
import { Contact } from './components/Contact';
import { FeaturedProduct } from './components/FeaturedProduct';
import { Hero } from './components/Hero';
import { Instagram } from './components/Instagram';
import { Intro } from './components/Intro';
import { Testimonials } from './components/Testimonials';

export default function HomePage() {
  useScrollAnimation();

  return (
    <div>
      <Hero />
      <Intro />
      <Categories />
      <FeaturedProduct />
      <Instagram />
      <Testimonials />
      <Contact />
    </div>
  );
}
