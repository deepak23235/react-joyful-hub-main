import { SITE } from "@/config/site";

export const ESCORTS_BASE = "/escorts";

/** Misspelled stored slugs mapped to the spelling used in public URLs. */
const SLUG_FIXES: Record<string, string> = {
  banglore: "bangalore",
};

/** Lowercase, hyphenated URL segment: "B.T.M-Nagar" → "btm-nagar", "Banglore" → "bangalore". */
export const urlSlug = (value = ""): string => {
  const slug = decodeURIComponent(value)
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return SLUG_FIXES[slug] ?? slug;
};

/** True when a stored slug and a URL segment point at the same record. */
export const slugMatches = (storedSlug: string, urlSegment: string): boolean =>
  urlSlug(storedSlug) === urlSlug(urlSegment);

/** `/escorts/{location}/{area}/{model}/` — always lowercase with a trailing slash. */
export const escortsPath = (...segments: (string | undefined)[]): string => {
  const parts = segments.filter(Boolean).map((s) => urlSlug(s)).filter(Boolean);
  return parts.length ? `${ESCORTS_BASE}/${parts.join("/")}/` : "/";
};

export const canonicalPath = (value = "/"): string => {
  const withoutOrigin = value.replace(/^https?:\/\/[^/]+/i, "");
  const path = (withoutOrigin.split(/[?#]/, 1)[0] || "/").replace(/\/{2,}/g, "/");
  if (path === "/") return "/";
  const segments = path.replace(/^\/+|\/+$/g, "").split("/");
  if (segments[0].toLowerCase() === ESCORTS_BASE.slice(1)) return escortsPath(...segments.slice(1));
  return `/${segments.join("/")}`;
};

export const canonicalUrl = (path = "/"): string =>
  `${SITE.url}${canonicalPath(path)}`;

export const schemaId = (url: string, fragment: string): string =>
  `${url.replace(/\/$/, "")}#${fragment}`;
