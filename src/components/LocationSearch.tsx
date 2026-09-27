import { Search, X } from "lucide-react";

interface LocationSearchProps {
  query: string;
  onQueryChange: (value: string) => void;
  resultCount: number;
  locationName: string;
}

const LocationSearch = ({ query, onQueryChange, resultCount, locationName }: LocationSearchProps) => (
  <div className="sticky top-20 z-30 mb-8 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur md:static md:p-4">
    <label htmlFor="location-profile-search" className="sr-only">
      Search profiles by name, area, or city
    </label>
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        id="location-profile-search"
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by name, area, or city..."
        className="h-11 w-full rounded-md border bg-card pl-10 pr-11 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
      />
      {query && (
        <button
          type="button"
          onClick={() => onQueryChange("")}
          className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
    <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
      {query.trim() ? `${resultCount} result${resultCount === 1 ? "" : "s"} for “${query.trim()}”` : `${resultCount} profiles in ${locationName}`}
    </p>
  </div>
);

export default LocationSearch;

