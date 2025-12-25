import HeroSection from '../components/homepage/HeroSection';
import HowItWorksSection from '../components/homepage/HowItWorksSection';
import CatalogTeaserSection from '../components/homepage/CatalogTeaserSection';
import FooterSection from '../components/homepage/FooterSection';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary-50 via-white via-accent-50/30 to-primary-100">
      <HeroSection />
      <HowItWorksSection />
      <CatalogTeaserSection />
      <FooterSection />
    </div>
  );
}
