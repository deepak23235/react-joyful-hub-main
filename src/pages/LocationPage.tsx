import { useParams } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import DirectoryCard from "@/components/DirectoryCard";
import { useLocationBySlug, useAreas } from "@/hooks/use-queries";
import NotFound from "./NotFound";
import { Skeleton } from "@/components/ui/skeleton";
import DirectoryCardSkeleton from "@/components/DirectoryCardSkeleton";

const LocationPage = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  
  const { data: location, isLoading: locationLoading } = useLocationBySlug(locationSlug);
  const { data: allAreas, isLoading: areasLoading } = useAreas();

  const loading = locationLoading || areasLoading;
  
  // Filter areas for this location
  const areas = allAreas && location 
    ? allAreas.filter(area => area.locationId === location.id) 
    : [];

  if (!loading && !location) return <NotFound />;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-48 md:h-64 overflow-hidden bg-muted">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : location ? (
          <>
            <img src={location.image} alt={location.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-3xl md:text-4xl  font-bold text-primary-foreground">{location.name}</h1>
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
              <h2 className="text-xl  font-semibold mb-6">Areas in {location.name}</h2>
            </>
          ) : null}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <DirectoryCardSkeleton key={i} />)
            ) : (
              areas.map((area) => (
                <DirectoryCard
                  key={area.id}
                  title={area.name}
                  description={area.description}
                  image={area.image}
                  href={`/${locationSlug}/${area.slug}`}
                />
              ))
            )}
          </div>
          {!loading && areas.length === 0 && <p className="text-center text-muted-foreground py-12">No areas added yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default LocationPage;
