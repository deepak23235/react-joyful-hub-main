import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ContactButtons from "@/components/ContactButtons";
import { cn } from "@/lib/utils";
import type { Area, Location, Model } from "@/types";

interface Props {
  locations: Location[];
  areas: Area[];
  models: Model[];
}

const LocationModelCarousel = ({ locations, areas, models }: Props) => {
  const availableLocations = useMemo(() => locations.map((location) => {
    const areaIds = new Set(areas.filter((area) => area.locationId === location.id).map((area) => area.id));
    return { location, models: models.filter((model) => areaIds.has(model.areaId)) };
  }).filter((entry) => entry.models.length > 0), [areas, locations, models]);

  const defaultId = availableLocations.find(({ location }) => location.name.toLowerCase() === "mumbai")?.location.id
    ?? availableLocations[0]?.location.id ?? "";
  const [selectedId, setSelectedId] = useState(defaultId);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [slideCount, setSlideCount] = useState(0);

  useEffect(() => {
    if (!selectedId && defaultId) setSelectedId(defaultId);
  }, [defaultId, selectedId]);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCurrent(api.selectedScrollSnap());
      setSlideCount(api.scrollSnapList().length);
    };
    update();
    api.on("select", update);
    api.on("reInit", update);
    return () => { api.off("select", update); api.off("reInit", update); };
  }, [api]);

  const selected = availableLocations.find(({ location }) => location.id === selectedId) ?? availableLocations[0];
  if (!selected) return null;

  const visibleModels = selected.models.slice(0, 12);
  const areaFor = (areaId: string) => areas.find((area) => area.id === areaId);

  return (
    <section id="browse-by-location" className="section-padding scroll-mt-24" aria-labelledby="browse-location-heading">
      <div className="container">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-accent">Real profiles, grouped by city</p>
            <h2 id="browse-location-heading" className="text-3xl font-semibold tracking-tight">Browse by Location</h2>
          </div>
          <Link to={`/${selected.location.slug}`} className="text-sm font-medium text-accent hover:underline">View all in {selected.location.name}</Link>
        </div>
        <div className="mb-7 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Profile locations">
          {availableLocations.map(({ location, models: locationModels }) => (
            <button
              key={location.id}
              type="button"
              role="tab"
              aria-selected={selected.location.id === location.id}
              onClick={() => setSelectedId(location.id)}
              className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected.location.id === location.id ? "border-accent bg-accent text-accent-foreground" : "bg-card text-muted-foreground hover:text-foreground")}
            >
              {location.name} <span className="ml-1 opacity-80">({locationModels.length})</span>
            </button>
          ))}
        </div>
        <Carousel key={selected.location.id} setApi={setApi} opts={{ align: "start", loop: visibleModels.length > 4 }} aria-label={`${selected.location.name} profiles`}>
          <CarouselContent>
            {visibleModels.map((model, index) => {
              const area = areaFor(model.areaId);
              if (!area) return null;
              const profileUrl = `/${selected.location.slug}/${area.slug}/${model.slug}`;
              return (
                <CarouselItem key={model.id} className="sm:basis-1/2 lg:basis-1/4" aria-label={`${index + 1} of ${visibleModels.length}`}>
                  <article className="h-full overflow-hidden rounded-xl border bg-card card-elevated">
                    <Link to={profileUrl} className="group block">
                      <div className="aspect-[4/5] overflow-hidden bg-muted">
                        <img src={model.images?.[0] || model.image} alt={`${model.name} in ${area.name}, ${selected.location.name}`} width="480" height="600" loading={index === 0 ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="px-4 pt-4">
                        <h3 className="text-lg font-semibold group-hover:text-accent">{model.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {area.name}, {selected.location.name}</p>
                        <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{model.shortDescription}</p>
                      </div>
                    </Link>
                    <div className="p-4"><ContactButtons phoneNumber={model.phoneNumber} size="sm" /></div>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="left-2 top-1/2" />
          <CarouselNext className="right-2 top-1/2" />
        </Carousel>
        {slideCount > 1 && (
          <div className="mt-6 flex justify-center gap-2" aria-label="Carousel pages">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button key={index} type="button" onClick={() => api?.scrollTo(index)} aria-label={`Go to carousel page ${index + 1}`} aria-current={current === index ? "true" : undefined} className={cn("h-2.5 rounded-full transition-all", current === index ? "w-7 bg-accent" : "w-2.5 bg-muted-foreground/40")} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationModelCarousel;
