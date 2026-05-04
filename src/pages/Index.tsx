import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactButtons from "@/components/ContactButtons";
import { fetchLocations, fetchAreas, fetchModels } from "@/lib/store";
import { MapPin, ArrowRight, Filter, Search, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Location, Area, Model } from "@/types";

const Index = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [allAreas, setAllAreas] = useState<Area[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [locationsData, areasData, modelsData] = await Promise.all([
        fetchLocations(),
        fetchAreas(),
        fetchModels(),
      ]);
      setLocations(locationsData);
      setAllAreas(areasData);
      setAllModels(modelsData);
    } catch (error) {
      toast.error("Failed to load data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter areas based on selected location
  const filteredAreas = useMemo(() => {
    if (selectedLocation === "all") return allAreas;
    return allAreas.filter((a) => a.locationId === selectedLocation);
  }, [selectedLocation, allAreas]);

  // Reset area when location changes
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setSelectedArea("all");
  };

  // Filter models based on selections
  const filteredModels = useMemo(() => {
    let models = allModels;

    if (selectedArea !== "all") {
      models = models.filter((m) => m.areaId === selectedArea);
    } else if (selectedLocation !== "all") {
      const locationAreaIds = allAreas
        .filter((a) => a.locationId === selectedLocation)
        .map((a) => a.id);
      models = models.filter((m) => locationAreaIds.includes(m.areaId));
    }

    return models;
  }, [selectedLocation, selectedArea, allModels, allAreas]);

  // Helper to get area and location info for a model
  const getModelMeta = (modelAreaId: string) => {
    const area = allAreas.find((a) => a.id === modelAreaId);
    const location = area ? locations.find((l) => l.id === area.locationId) : undefined;
    return { area, location };
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

  return (
    <div className="flex flex-col min-h-screen">
 

      {/* Hero */}
      <section className="hero-gradient py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl  font-bold text-primary-foreground mb-4 animate-fade-in">
            Find Models Near You
          </h1>
          <p
            className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Select your location and area to discover the perfect model for your needs.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="py-6 border-b bg-card sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              Filter:
            </div>

            <Select value={selectedLocation} onValueChange={handleLocationChange}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {filteredAreas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="ml-auto text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredModels.length}</span>{" "}
              model{filteredModels.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="py-12 flex-1">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => {
              const { area, location } = getModelMeta(model.areaId);
              const locationSlug = location?.slug || "";
              const areaSlug = area?.slug || "";

              return (
                <Link
                  key={model.id}
                  to={`/${locationSlug}/${areaSlug}/${model.slug}`}
                  className="group block rounded-lg overflow-hidden bg-card card-elevated"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={model.image}
                      alt={model.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg  font-semibold text-card-foreground group-hover:text-accent transition-colors">
                        {model.name}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {model.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <ContactButtons phoneNumber={model.phoneNumber} size="sm" />
                      {location && area && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {area.name}, {location.name}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {filteredModels.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No models found for the selected filters.</p>
              <p className="text-sm text-muted-foreground mt-1">Try changing the location or area.</p>
            </div>
          )}
        </div>
      </section>

  
    </div>
  );
};

export default Index;
