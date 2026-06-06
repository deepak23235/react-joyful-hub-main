import { Helmet } from "react-helmet-async";

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface ListItem {
  name: string;
  url: string;
  image?: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

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
  /** Suppress indexing (404, login, admin pages) */
  noindex?: boolean;
  /** Breadcrumb trail for BreadcrumbList schema – omit Home, it's added automatically */
  breadcrumbs?: BreadcrumbItem[];
  /** Person name for model detail pages – adds Person schema */
  personName?: string;
  personDescription?: string;
  /** Ordered list of items for listing pages – adds ItemList schema */
  itemList?: ListItem[];
  /** FAQ pairs for homepage / content pages – adds FAQPage schema */
  faqs?: FaqItem[];
}

const SITE_NAME = "Selviescortservice";
const SITE_URL = "https://selviescortservice.com";
const DEFAULT_TITLE = "Selviescortservice – Escort Service Near You";
const DEFAULT_DESCRIPTION =
  "Find verified escort service near you. Browse profiles with contact details across all major cities and areas.";
const DEFAULT_KEYWORDS =
  "call girls near me, escort service near me, call girl number, escort service India, independent escort India, female escort near me, VIP escort service, verified call girls India";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const toAbsoluteImage = (image?: string): string => {
  if (!image) return DEFAULT_IMAGE;
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const buildKeywords = (locationName?: string, areaName?: string): string => {
  if (!locationName) return DEFAULT_KEYWORDS;
  const loc = locationName;
  const area = areaName ?? "";
  return [
    `call girls in ${loc}`,
    `escort service in ${loc}`,
    `${loc} call girl number`,
    `${loc} escort service`,
    `independent escort in ${loc}`,
    `female escort ${loc}`,
    `verified call girls ${loc}`,
    `VIP escort service ${loc}`,
    `call girl near me ${loc}`,
    `escort near me ${loc}`,
    area ? `call girls in ${area} ${loc}` : "",
    area ? `escort service in ${area} ${loc}` : "",
    area ? `${area} ${loc} call girl number` : "",
    area ? `escort near ${area}` : "",
    "escort service near me",
    "call girls near me",
  ]
    .filter(Boolean)
    .join(", ");
};

const buildSchema = ({
  description,
  canonicalUrl,
  absoluteImage,
  locationName,
  areaName,
  breadcrumbs,
  personName,
  personDescription,
  itemList,
  faqs,
}: {
  description: string;
  canonicalUrl: string;
  absoluteImage: string;
  locationName?: string;
  areaName?: string;
  breadcrumbs?: BreadcrumbItem[];
  personName?: string;
  personDescription?: string;
  itemList?: ListItem[];
  faqs?: FaqItem[];
}) => {
  const graph: object[] = [];

  // Organization – always present, referenced by other nodes
  graph.push({
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo.png`,
      width: 200,
      height: 60,
    },
  });

  // WebSite with sitelinks SearchBox
  graph.push({
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  });

  // WebPage
  graph.push({
    "@type": "WebPage",
    "@id": `${canonicalUrl}/#webpage`,
    url: canonicalUrl,
    name: SITE_NAME,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteImage,
    },
  });

  // LocalBusiness on location-specific pages
  if (locationName) {
    graph.push({
      "@type": "LocalBusiness",
      "@id": `${canonicalUrl}/#localbusiness`,
      name: SITE_NAME,
      description,
      url: canonicalUrl,
      image: absoluteImage,
      priceRange: "$$",
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
    });
  }

  // BreadcrumbList – Home is prepended automatically
  if (breadcrumbs && breadcrumbs.length > 0) {
    const crumbs = [
      { name: "Home", url: SITE_URL },
      ...breadcrumbs.map((b) => ({
        name: b.name,
        url: b.url ? `${SITE_URL}${b.url}` : canonicalUrl,
      })),
    ];
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}/#breadcrumb`,
      itemListElement: crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  // Person schema for model profile pages
  if (personName) {
    graph.push({
      "@type": "Person",
      "@id": `${canonicalUrl}/#person`,
      name: personName,
      ...(personDescription && { description: personDescription }),
      url: canonicalUrl,
      ...(absoluteImage !== DEFAULT_IMAGE && {
        image: { "@type": "ImageObject", url: absoluteImage },
      }),
      ...(locationName && {
        address: {
          "@type": "PostalAddress",
          addressLocality: areaName ?? locationName,
          addressRegion: locationName,
          addressCountry: "IN",
        },
      }),
    });
  }

  // ItemList for listing pages (location, area)
  if (itemList && itemList.length > 0) {
    graph.push({
      "@type": "ItemList",
      "@id": `${canonicalUrl}/#itemlist`,
      url: canonicalUrl,
      numberOfItems: itemList.length,
      itemListElement: itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${SITE_URL}${item.url}`,
        ...(item.image && { image: item.image }),
      })),
    });
  }

  // FAQPage for homepage / content pages
  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${canonicalUrl}/#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image,
  url,
  type = "website",
  locationName,
  areaName,
  noindex = false,
  breadcrumbs,
  personName,
  personDescription,
  itemList,
  faqs,
}: SEOProps) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const absoluteImage = toAbsoluteImage(image);
  const resolvedKeywords = keywords ?? buildKeywords(locationName, areaName);

  const schema = buildSchema({
    description,
    canonicalUrl,
    absoluteImage,
    locationName,
    areaName,
    breadcrumbs,
    personName,
    personDescription,
    itemList,
    faqs,
  });

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={resolvedKeywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <meta name="theme-color" content="#d4216b" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Geo tags for "near me" signals */}
      {locationName && <meta name="geo.region" content="IN" />}
      {locationName && (
        <meta
          name="geo.placename"
          content={areaName ? `${areaName}, ${locationName}` : locationName}
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteImage} />

      {/* JSON-LD structured data */}
      <script type="application/ld+json">{schema}</script>
    </Helmet>
  );
};

export default SEO;
