import { useParams, Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import ContactButtons from "@/components/ContactButtons";
import { useLocationBySlug, useAreaBySlug, useModels } from "@/hooks/use-queries";
import { ArrowRight } from "lucide-react";
import NotFound from "./NotFound";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelCardSkeleton } from "@/components/ModelCardSkeleton";

const AreaPage = () => {
  const { locationSlug, areaSlug } = useParams<{ locationSlug: string; areaSlug: string }>();
  
  const { data: location, isLoading: locationLoading } = useLocationBySlug(locationSlug);
  const { data: area, isLoading: areaLoading } = useAreaBySlug(location?.id, areaSlug);
  const { data: allModels, isLoading: modelsLoading } = useModels();

  const loading = locationLoading || areaLoading || modelsLoading;
  
  // Filter models for this area
  const models = allModels && area
    ? allModels.filter(model => model.areaId === area.id)
    : [];

  if (!loading && (!location || !area)) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={area && location ? `Call Girls in ${area.name}, ${location.name} | Escort Service Near Me` : "Area"}
        description={area && location ? `Find call girls and escort service in ${area.name}, ${location.name}. Verified female escorts near ${area.name} with direct contact numbers and photos. Call or WhatsApp directly.` : undefined}
        image={area?.image}
        url={area ? `/${locationSlug}/${areaSlug}` : undefined}
        locationName={location?.name}
        areaName={area?.name}
        breadcrumbs={area && location ? [
          { name: location.name, url: `/${locationSlug}` },
          { name: area.name },
        ] : undefined}
        itemList={models.slice(0, 50).map((m) => ({
          name: m.name,
          url: `/${locationSlug}/${areaSlug}/${m.slug}`,
          image: (m.images && m.images[0]) || m.image,
        }))}
      />
      <div className="relative h-52 md:h-72 hero-gradient">
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 mx-auto" />
              <Skeleton className="h-10 w-48 mx-auto" />
            </div>
          ) : area && location ? (
            <div>
              <p className="mb-2 text-sm text-primary-foreground/75">{location.name}</p>
              <h1 className="text-3xl font-semibold tracking-tight text-primary-foreground md:text-4xl drop-shadow">{area.name}</h1>
            </div>
          ) : null}
        </div>
      </div>
      <section className="section-padding flex-1">
        <div className="container">
          {loading ? (
            <div className="mb-6">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full max-w-2xl mb-2" />
              <Skeleton className="h-4 w-full max-w-xl mb-8" />
              <Skeleton className="h-6 w-32 mb-6" />
            </div>
          ) : area && location ? (
            <>
              <Breadcrumbs items={[
                { label: location.name, href: `/${locationSlug}` },
                { label: area.name },
              ]} />
              <p className="mb-8 max-w-2xl text-muted-foreground">{area.description}</p>
              <h2 className="mb-6 text-xl font-semibold tracking-tight">Models in {area.name}</h2>
            </>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ModelCardSkeleton key={i} />)
            ) : (
              models.map((model) => (
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
                          loading="lazy"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={(model.images && model.images[0]) || model.image}
                        alt={model.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-card-foreground transition-colors group-hover:text-accent">{model.name}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{model.shortDescription}</p>
                    <ContactButtons phoneNumber={model.phoneNumber} size="sm" />
                  </div>
                </Link>
              ))
            )}
          </div>
          {!loading && models.length === 0 && <p className="text-center text-muted-foreground py-12">No models added yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default AreaPage;
