import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useLocations } from "@/hooks/use-queries";

const Footer = () => {
  const { data: locations = [], isLoading: loading } = useLocations();

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container py-10 text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-lg font-semibold text-foreground">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent/15">
            <MapPin className="h-4 w-4 text-accent" />
          </span>
          ModelDir
        </div>

        <div className="mx-auto mb-5 max-w-3xl">
          <p className="text-sm font-medium text-foreground mb-2">Browse by location</p>
          {loading ? (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          ) : locations.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {locations.map((location) => (
                <Link
                  key={location.id}
                  to={`/${location.slug}`}
                  className="rounded-full border bg-background px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {location.name}
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No locations available.</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ModelDir. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
