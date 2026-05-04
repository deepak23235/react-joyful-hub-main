import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactButtons from "@/components/ContactButtons";
import { fetchLocationBySlug, fetchAreaBySlug, fetchModelsByArea } from "@/lib/store";
import { ArrowRight, Loader2 } from "lucide-react";
import NotFound from "./NotFound";

const AreaPage = () => {
  const { locationSlug, areaSlug } = useParams<{ locationSlug: string; areaSlug: string }>();
  const [location, setLocation] = useState<any>(null);
  const [area, setArea] = useState<any>(null);
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [locationSlug, areaSlug]);

  const loadData = async () => {
    if (!locationSlug || !areaSlug) return;
    
    try {
      const locationData = await fetchLocationBySlug(locationSlug);
      if (!locationData) {
        setLoading(false);
        return;
      }
      
      setLocation(locationData);
      const areaData = await fetchAreaBySlug(locationData.id, areaSlug);
      if (!areaData) {
        setLoading(false);
        return;
      }
      
      setArea(areaData);
      const modelsData = await fetchModelsByArea(areaData.id);
      setModels(modelsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
       
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      
      </div>
    );
  }

  if (!location || !area) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
  
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={area.image} alt={area.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-sm text-primary-foreground/70 mb-1">{location.name}</p>
            <h1 className="text-3xl md:text-4xl  font-bold text-primary-foreground">{area.name}</h1>
          </div>
        </div>
      </div>
      <section className="py-12 flex-1">
        <div className="container">
          <Breadcrumbs items={[
            { label: location.name, href: `/${locationSlug}` },
            { label: area.name },
          ]} />
          <p className="text-muted-foreground mb-8 max-w-2xl">{area.description}</p>
          <h2 className="text-xl  font-semibold mb-6">Models in {area.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {models.map((model) => (
              <Link
                key={model.id}
                to={`/${locationSlug}/${areaSlug}/${model.slug}`}
                className="group block rounded-lg overflow-hidden bg-card card-elevated"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={model.image} alt={model.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg  font-semibold text-card-foreground group-hover:text-accent transition-colors">{model.name}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{model.shortDescription}</p>
                  <ContactButtons phoneNumber={model.phoneNumber} size="sm" />
                </div>
              </Link>
            ))}
          </div>
          {models.length === 0 && <p className="text-center text-muted-foreground py-12">No models added yet.</p>}
        </div>
      </section>
   
    </div>
  );
};

export default AreaPage;
