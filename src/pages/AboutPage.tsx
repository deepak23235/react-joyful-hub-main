import SEO from "@/components/SEO";
import AboutUs from "@/components/AboutUs";
import { useLocations } from "@/hooks/use-queries";

const AboutPage = () => {
  const { data: locations = [] } = useLocations();
  return (
    <main className="min-h-screen">
      <SEO title="About Us" description="Learn how Finder Girls Near Me organizes city and area listings, supports privacy-aware browsing, and provides direct profile discovery tools." url="/about-us" />
      <header className="hero-gradient border-b py-14 text-center">
        <div className="container"><h1 className="text-4xl font-semibold tracking-tight text-white">About Finder Girls Near Me</h1><p className="mx-auto mt-3 max-w-2xl text-white/75">Our services, practical expertise, areas served, and directory principles.</p></div>
      </header>
      <AboutUs locations={locations} />
    </main>
  );
};

export default AboutPage;

