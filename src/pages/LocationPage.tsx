import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import DirectoryCard from "@/components/DirectoryCard";
import { fetchLocationBySlug, fetchAreasByLocation } from "@/lib/store";
import { Loader2 } from "lucide-react";
import NotFound from "./NotFound";

const LocationPage = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const [location, setLocation] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [locationSlug]);

  const loadData = async () => {
    if (!locationSlug) return;
    
    try {
      const locationData = await fetchLocationBySlug(locationSlug);
      if (!locationData) {
        setLoading(false);
        return;
      }
      
      setLocation(locationData);
      const areasData = await fetchAreasByLocation(locationData.id);
      setAreas(areasData);
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

  if (!location) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
     
      <div className="relative h-48 md:h-64 overflow-hidden">
        <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground">{location.name}</h1>
        </div>
      </div>
      <section className="py-12 flex-1">
        <div className="container">
          <Breadcrumbs items={[{ label: location.name }]} />
          <p className="text-muted-foreground mb-8 max-w-2xl">{location.description}</p>
          <h2 className="text-xl font-display font-semibold mb-6">Areas in {location.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {areas.map((area) => (
              <DirectoryCard
                key={area.id}
                title={area.name}
                description={area.description}
                image={area.image}
                href={`/${locationSlug}/${area.slug}`}
              />
            ))}
          </div>
          {areas.length === 0 && <p className="text-center text-muted-foreground py-12">No areas added yet.</p>}
        </div>
      </section>
      
    </div>
  );
};

export default LocationPage;
