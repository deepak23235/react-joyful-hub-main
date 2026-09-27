import { SITE } from "@/config/site";

/** Keeps stored slug spelling/case and dots while removing duplicate-only URL parts. */
export const canonicalPath = (value = "/"): string => {
  const withoutOrigin = value.replace(/^https?:\/\/[^/]+/i, "");
  const path = (withoutOrigin.split(/[?#]/, 1)[0] || "/").replace(/\/{2,}/g, "/");
  if (path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
};

export const canonicalUrl = (path = "/"): string =>
  `${SITE.url}${canonicalPath(path)}`;

export const schemaId = (url: string, fragment: string): string =>
  `${url.replace(/\/$/, "")}#${fragment}`;

