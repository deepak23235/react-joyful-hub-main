import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import ContactButtons from "@/components/ContactButtons";
import { useLocationBySlug, useAreas, useModels } from "@/hooks/use-queries";
import NotFound from "./NotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelCardSkeleton } from "@/components/ModelCardSkeleton";
import { ArrowRight, MapPin } from "lucide-react";

const LocationPage = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();

  const { data: location, isLoading: locationLoading } = useLocationBySlug(locationSlug);
  const { data: allAreas, isLoading: areasLoading } = useAreas();
  const { data: allModels, isLoading: modelsLoading } = useModels();

  const loading = locationLoading || areasLoading || modelsLoading;

  // Areas that belong to this location
  const locationAreas = allAreas && location
    ? allAreas.filter((a) => a.locationId === location.id)
    : [];

  // All models across every area of this location
  const locationAreaIds = locationAreas.map((a) => a.id);
  const models = allModels
    ? allModels.filter((m) => locationAreaIds.includes(m.areaId))
    : [];

  const getAreaSlug = (areaId: string) =>
    locationAreas.find((a) => a.id === areaId)?.slug ?? "";

  if (!loading && !location) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={location ? `Escort Service in ${location.name}` : "Location"}
        description={location ? `Find verified escort service and call girls in ${location.name}. Browse profiles with contact details and photos.` : undefined}
        image={location?.image}
        url={location ? `/${locationSlug}` : undefined}
        locationName={location?.name}
      />

      {/* Hero banner */}
      <div
        className="relative h-48 md:h-64 bg-muted"
        style={
          location
            ? {
                backgroundImage: `url(${location.image})`,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : undefined
        }
      >
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : location ? (
          <>
            <div className="absolute inset-0 bg-foreground/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground">{location.name}</h1>
            </div>
          </>
        ) : null}
      </div>

      <section className="py-12 flex-1">
        <div className="container">
          {loading ? (
            <div className="mb-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-4 w-full max-w-2xl mb-2" />
              <Skeleton className="h-4 w-full max-w-xl mb-8" />
              <Skeleton className="h-6 w-48 mb-6" />
            </div>
          ) : location ? (
            <>
              <Breadcrumbs items={[{ label: location.name }]} />
              <p className="text-muted-foreground mb-8 max-w-2xl">{location.description}</p>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Models in {location.name}</h2>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{models.length}</span>{" "}
                  result{models.length !== 1 ? "s" : ""}
                </p>
              </div>
            </>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ModelCardSkeleton key={i} />)
            ) : (
              models.map((model) => {
                const areaSlug = getAreaSlug(model.areaId);
                const area = locationAreas.find((a) => a.id === model.areaId);

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
                        {area && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {area.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {!loading && models.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No models available in this location yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
