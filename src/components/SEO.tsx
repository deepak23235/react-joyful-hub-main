import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  /** City / locality name – adds geo meta tags and LocalBusiness JSON-LD */
  locationName?: string;
  /** Sub-area / neighbourhood inside the location */
  areaName?: string;
}

const SITE_NAME = "Selviescortservice";
const SITE_URL = "https://selviescortservice.com";
const DEFAULT_TITLE = "Selviescortservice – Escort Service Near You";
const DEFAULT_DESCRIPTION =
  "Find verified escort service near you. Browse profiles with contact details across all major cities and areas.";
const DEFAULT_KEYWORDS =
  "escort service near me, call girls near me, escort service India, models near me";
const DEFAULT_IMAGE = "/og-image.png";

const buildKeywords = (locationName?: string, areaName?: string): string => {
  if (!locationName) return DEFAULT_KEYWORDS;
  const loc = locationName;
  const area = areaName ? `${areaName}, ` : "";
  return [
    `escort service in ${loc}`,
    `call girls in ${loc}`,
    `${loc} escort service`,
    `models near me ${loc}`,
    areaName ? `escort service in ${areaName}` : "",
    areaName ? `call girls in ${areaName} ${loc}` : "",
    `${area}${loc} call girls`,
    `${area}${loc} models`,
    `escort near me ${loc}`,
    "escort service near me",
  ]
    .filter(Boolean)
    .join(", ");
};

const buildSchema = (
  description: string,
  canonicalUrl: string,
  image: string,
  locationName?: string,
  areaName?: string
) => {
  const base = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    description,
    url: canonicalUrl,
    image,
    telephone: "",
    priceRange: "$$",
    ...(locationName && {
      address: {
        "@type": "PostalAddress",
        addressLocality: areaName ?? locationName,
        addressRegion: locationName,
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "City",
        name: locationName,
      },
    }),
  };
  return JSON.stringify(base);
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  locationName,
  areaName,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const resolvedKeywords = keywords ?? buildKeywords(locationName, areaName);
  const schema = buildSchema(description, canonicalUrl, image, locationName, areaName);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#d4216b" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Geo tags for "near me" signals */}
      {locationName && <meta name="geo.region" content="IN" />}
      {locationName && <meta name="geo.placename" content={areaName ? `${areaName}, ${locationName}` : locationName} />}
      {locationName && <meta name="ICBM" content="" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD LocalBusiness structured data */}
      <script type="application/ld+json">{schema}</script>
    </Helmet>
  );
};

export default SEO;
