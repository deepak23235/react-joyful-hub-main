import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { escortsPath } from "@/lib/seo";

/** Keeps every /escorts/* URL in its canonical lowercase, trailing-slash form. */
export const EscortsCanonical = () => {
  const { pathname, search, hash } = useLocation();
  const { locationSlug, areaSlug, modelSlug } = useParams();
  const canonical = escortsPath(locationSlug, areaSlug, modelSlug);
  if (pathname !== canonical) return <Navigate to={`${canonical}${search}${hash}`} replace />;
  return <Outlet />;
};

/** Sends old /{location}/{area}/{model} URLs to their /escorts/ equivalent. */
export const LegacyRedirect = () => {
  const { search, hash } = useLocation();
  const { locationSlug, areaSlug, modelSlug } = useParams();
  return <Navigate to={`${escortsPath(locationSlug, areaSlug, modelSlug)}${search}${hash}`} replace />;
};
