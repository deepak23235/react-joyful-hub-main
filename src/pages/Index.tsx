import SEO from "@/components/SEO";
import HeroSection from "@/components/HeroSection";
import LocationModelCarousel from "@/components/LocationModelCarousel";
import AboutUs from "@/components/AboutUs";
import FaqSection from "@/components/FaqSection";
import { FAQS } from "@/data/faqs";
import { useAreas, useLocations, useModels } from "@/hooks/use-queries";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const { data: locations = [], isLoading: loadingLocations } = useLocations();
  const { data: areas = [], isLoading: loadingAreas } = useAreas();
  const { data: models = [], isLoading: loadingModels } = useModels();
  const loading = loadingLocations || loadingAreas || loadingModels;

  return (
    <main className="flex min-h-screen flex-col">
      <SEO
        title="Call Girls Near You | Escort Service Across India"
        description="Browse location-based profiles across Mumbai, Pune, Banglore, Hyderabad, Chennai, Thane and other live directory locations. Direct contact, no browsing registration required."
        url="/"
        faqs={FAQS}
      />
      <HeroSection />
      {loading ? (
        <section className="section-padding"><div className="container"><Skeleton className="mb-5 h-10 w-72" /><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="aspect-[4/5] w-full rounded-xl" />)}</div></div></section>
      ) : (
        <LocationModelCarousel locations={locations} areas={areas} models={models} />
      )}
      <AboutUs locations={locations} compact />
      <FaqSection />
    </main>
  );
};

export default Index;
