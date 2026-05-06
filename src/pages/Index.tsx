import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContactButtons from "@/components/ContactButtons";
import { MapPin, ArrowRight, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ModelCardSkeleton } from "@/components/ModelCardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocations, useAreas, useModels } from "@/hooks/use-queries";

const Index = () => {
  const navigate = useNavigate();
  const { data: locations = [], isLoading: loadingLocations } = useLocations();
  const { data: allAreas = [], isLoading: loadingAreas } = useAreas();
  const { data: allModels = [], isLoading: loadingModels } = useModels();
  
  const loading = loadingLocations || loadingAreas || loadingModels;

  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

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

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
  };

  const handleExplore = () => {
    if (selectedLocation === "all") return;
    const selectedLoc = locations.find((loc) => loc.id === selectedLocation);
    if (!selectedLoc) return;
    if (selectedArea === "all") {
      navigate(`/${selectedLoc.slug}`);
      return;
    }
    const selectedAr = filteredAreas.find((area) => area.id === selectedArea);
    if (selectedAr) navigate(`/${selectedLoc.slug}/${selectedAr.slug}`);
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="hero-gradient border-b py-16 md:py-24">
        <div className="container text-center">
          <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-semibold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl animate-fade-in">
            Find Models Near You
          </h1>
          <p
            className="mx-auto mb-8 max-w-2xl text-base text-primary-foreground/80 md:text-lg animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            Select your location and area to discover the perfect model for your needs.
          </p>
          <div className="surface-panel mx-auto max-w-4xl border-primary-foreground/20 bg-primary-foreground/10 p-4 backdrop-blur animate-fade-in md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </>
              ) : (
                <>
                  <Select value={selectedLocation} onValueChange={handleLocationChange}>
                    <SelectTrigger className="w-full bg-background text-foreground">
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Select Location</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedArea} onValueChange={handleAreaChange} disabled={selectedLocation === "all"}>
                    <SelectTrigger className="w-full bg-background text-foreground">
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

                  <button
                    type="button"
                    onClick={handleExplore}
                    disabled={selectedLocation === "all"}
                    className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground px-4 py-2 text-sm font-medium transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    Explore
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Models Grid */}
      <section className="section-padding flex-1">
        <div className="container">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Featured Models</h2>
            {loading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredModels.length}</span>{" "}
                result{filteredModels.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ModelCardSkeleton key={i} />)
            ) : (
              filteredModels.map((model) => {
                const { area, location } = getModelMeta(model.areaId);
                const locationSlug = location?.slug || "";
                const areaSlug = area?.slug || "";

                return (
                  <Link
                    key={model.id}
                    to={`/${locationSlug}/${areaSlug}/${model.slug}`}
                    className="group block overflow-hidden rounded-xl border bg-card card-elevated"
                  >
                    {model.images && model.images.length > 1 ? (
                      <div className="grid grid-cols-2 gap-1 aspect-[16/10] overflow-hidden">
                        {model.images.slice(0, 4).map((img: string, idx: number) => (
                          <img
                            key={`${model.id}-img-${idx}`}
                            src={img}
                            alt={`${model.name} ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={(model.images && model.images[0]) || model.image}
                          alt={model.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-card-foreground transition-colors group-hover:text-accent">
                          {model.name}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-accent" />
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
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
              })
            )}
          </div>
          {!loading && filteredModels.length === 0 && (
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
