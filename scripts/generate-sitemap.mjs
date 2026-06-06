/**
 * Build-time sitemap generator.
 * Run: node scripts/generate-sitemap.mjs
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 *
 * Add to package.json scripts:
 *   "build:sitemap": "node scripts/generate-sitemap.mjs"
 *   "prebuild": "node scripts/generate-sitemap.mjs"
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";

const SITE_URL = "https://selviescortservice.com";
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function escapeXml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlEntry(loc, lastmod) {
  const date = lastmod ? new Date(lastmod).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`;
}

async function generate() {
  const entries = [];

  // Homepage
  entries.push(urlEntry(SITE_URL, null));

  // Locations
  const { data: locations, error: locErr } = await supabase
    .from("locations")
    .select("slug, updated_at");
  if (locErr) throw locErr;

  for (const loc of locations ?? []) {
    entries.push(urlEntry(`${SITE_URL}/${loc.slug}`, loc.updated_at));
  }

  // Areas
  const { data: areas, error: areaErr } = await supabase
    .from("areas")
    .select("slug, updated_at, location:locations(slug)");
  if (areaErr) throw areaErr;

  for (const area of areas ?? []) {
    const locSlug = area.location?.slug;
    if (!locSlug) continue;
    entries.push(urlEntry(`${SITE_URL}/${locSlug}/${area.slug}`, area.updated_at));
  }

  // Models
  const { data: models, error: modelErr } = await supabase
    .from("models")
    .select("slug, updated_at, area:areas(slug, location:locations(slug))");
  if (modelErr) throw modelErr;

  for (const model of models ?? []) {
    const areaSlug = model.area?.slug;
    const locSlug = model.area?.location?.slug;
    if (!areaSlug || !locSlug) continue;
    entries.push(urlEntry(`${SITE_URL}/${locSlug}/${areaSlug}/${model.slug}`, model.updated_at));
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>`;

  writeFileSync("public/sitemap.xml", xml, "utf-8");
  console.log(`Sitemap generated: ${entries.length} URLs → public/sitemap.xml`);
}

generate().catch((err) => {
  console.error("Sitemap generation failed:", err);
  process.exit(1);
});
