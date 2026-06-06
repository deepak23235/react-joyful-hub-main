import { useParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEO from "@/components/SEO";
import ContactButtons from "@/components/ContactButtons";
import { useLocationBySlug, useAreaBySlug, useModelBySlug } from "@/hooks/use-queries";
import { CheckCircle } from "lucide-react";
import NotFound from "./NotFound";
import { Skeleton } from "@/components/ui/skeleton";

const ModelDetailPage = () => {
  const { locationSlug, areaSlug, modelSlug } = useParams<{ locationSlug: string; areaSlug: string; modelSlug: string }>();
  
  const { data: location, isLoading: locationLoading } = useLocationBySlug(locationSlug);
  const { data: area, isLoading: areaLoading } = useAreaBySlug(location?.id, areaSlug);
  const { data: model, isLoading: modelLoading } = useModelBySlug(area?.id, modelSlug);

  const loading = locationLoading || areaLoading || modelLoading;

  if (!loading && (!location || !area || !model)) return <NotFound />;

  const modelImages = model ? (model.images && model.images.length > 0 ? model.images : [model.image]).filter(Boolean) : [];

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={model && area && location ? `${model.name} – Escort in ${area.name}, ${location.name}` : "Model"}
        description={model && area && location ? `${model.shortDescription || model.description || `Independent escort and call girl in ${area.name}, ${location.name}`}. Contact directly for escort service in ${area.name}, ${location.name}.` : undefined}
        image={model?.images?.[0] || model?.image}
        url={model ? `/${locationSlug}/${areaSlug}/${modelSlug}` : undefined}
        type="article"
        locationName={location?.name}
        areaName={area?.name}
        breadcrumbs={model && area && location ? [
          { name: location.name, url: `/${locationSlug}` },
          { name: area.name, url: `/${locationSlug}/${areaSlug}` },
          { name: model.name },
        ] : undefined}
        personName={model?.name}
        personDescription={model?.shortDescription || model?.description}
      />
      <section className="section-padding flex-1">
        <div className="container">
          {loading ? (
            <div className="mb-6">
              <Skeleton className="h-6 w-64" />
            </div>
          ) : location && area && model ? (
            <Breadcrumbs items={[
              { label: location.name, href: `/${locationSlug}` },
              { label: area.name, href: `/${locationSlug}/${areaSlug}` },
              { label: model.name },
            ]} />
          ) : null}

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Images */}
            <div className="space-y-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="aspect-square rounded-lg" />
                </div>
              ) : model && modelImages.length > 1 ? (
                <div className="grid grid-cols-2 gap-3">
                  {modelImages.map((img: string, i: number) => (
                    <div key={i} className="aspect-square overflow-hidden rounded-lg border bg-card">
                      <img
                        src={img}
                        alt={`${model.name} ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? undefined : "lazy"}
                        fetchPriority={i === 0 ? "high" : undefined}
                      />
                    </div>
                  ))}
                </div>
              ) : model ? (
                <div className="aspect-[4/3] overflow-hidden rounded-xl border bg-card">
                  <img src={modelImages[0]} alt={model.name} className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>

            {/* Info */}
            <div className="surface-panel p-6 md:p-8">
              {loading ? (
                <>
                  <Skeleton className="mb-3 h-10 w-3/4" />
                  <div className="mb-5 flex items-center gap-3">
                    <Skeleton className="h-12 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-2 h-4 w-full" />
                  <Skeleton className="mb-6 h-4 w-2/3" />
                  
                  <Skeleton className="mb-3 h-6 w-24" />
                  <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  
                  <Skeleton className="mb-3 h-6 w-32" />
                  <div className="space-y-1">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : model ? (
                <>
                  <h1 className="mb-3 text-3xl font-semibold tracking-tight md:text-4xl">{model.name}</h1>
                  
                  {/* Contact Buttons */}
                  <div className="mb-5 flex items-center gap-3">
                    <ContactButtons phoneNumber={model.phoneNumber} size="lg" />
                    <span className="text-sm text-muted-foreground">Contact us for details</span>
                  </div>
                  
                  <p className="mb-6 leading-relaxed text-muted-foreground">{model.description}</p>

                  {/* Features */}
                  <h3 className="mb-3 text-lg font-semibold">Features</h3>
                  <div className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {model.features.map((f: string) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>

                  {/* Specs */}
                  <h3 className="mb-3 text-lg font-semibold">Specifications</h3>
                  <div className="mb-1 overflow-hidden rounded-lg border">
                    {Object.entries(model.specifications).map(([key, val]: [string, any], i: number) => (
                      <div key={key} className={`flex justify-between px-4 py-2.5 text-sm ${i % 2 === 0 ? "bg-muted/50" : ""}`}>
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModelDetailPage;
