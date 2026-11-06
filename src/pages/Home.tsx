import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import {
  CtaBanner,
  FeatureGrid,
  HowItWorks,
  LandingFooter,
  RolesStrip,
  StatsSection,
} from "@/components/landing/Sections";

/**
 * Public landing page: hero with product preview, roles, stats,
 * how it works, feature bento, call to action and footer.
 */
const Home = () => (
  <div className="min-h-screen bg-background font-sans text-foreground antialiased">
    <LandingNav />
    <main>
      <Hero />
      <RolesStrip />
      <StatsSection />
      <HowItWorks />
      <FeatureGrid />
      <CtaBanner />
    </main>
    <LandingFooter />
  </div>
);

export default Home;
