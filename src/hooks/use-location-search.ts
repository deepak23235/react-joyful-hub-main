import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Model } from "@/types";

export const useLocationSearch = (
  models: Model[],
  locationName: string,
  areaNameFor: (areaId: string) => string,
) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timeout = window.setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const trimmed = query.trim();
      if (trimmed) next.set("q", trimmed);
      else next.delete("q");
      setSearchParams(next, { replace: true });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [query, searchParams, setSearchParams]);

  const filteredModels = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    if (!needle) return models;
    return models.filter((model) =>
      [model.name, areaNameFor(model.areaId), locationName]
        .some((value) => value.toLocaleLowerCase().includes(needle)),
    );
  }, [areaNameFor, locationName, models, query]);

  return { query, setQuery, filteredModels };
};

