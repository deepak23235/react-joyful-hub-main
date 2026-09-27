import { Link } from "react-router-dom";
import { CheckCircle2, LockKeyhole, MapPin, PhoneCall } from "lucide-react";
import type { Location } from "@/types";

interface AboutUsProps {
  locations: Location[];
  compact?: boolean;
}

const AboutUs = ({ locations, compact = false }: AboutUsProps) => (
  <section id="about" className="section-padding border-t" aria-labelledby="about-heading">
    <div className="container grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-accent">About our directory</p>
        <h2 id="about-heading" className="text-3xl font-semibold tracking-tight">About Finder Girls Near Me</h2>
        <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Finder Girls Near Me is a location-based directory built to make public profiles easier for adults to discover by city and neighbourhood. Visitors can browse listings and use direct contact options without creating a public browsing account.
          </p>
          <p>
            Our work focuses on clear location structure, useful profile information, privacy-aware browsing, and straightforward ways to report details that may need correction. Listing details can change, so visitors should always verify identity, availability, and claims directly.
          </p>
          {!compact && (
            <p>
              Our practical expertise is in organizing city, area, and profile data into accessible pages. Major achievements are kept factual: the site supports live city and area navigation, direct profile discovery, and structured reporting paths without publishing unconfirmed awards, revenue, or years in operation.
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-wrap gap-2" aria-label="Areas served">
          {locations.map((location) => (
            <Link key={location.id} to={`/${location.slug}`} className="rounded-full border px-3 py-1.5 text-sm text-muted-foreground hover:border-accent hover:text-accent">
              {location.name}
            </Link>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#browse-by-location" className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">Browse Profiles</a>
          <a href="tel:+918521515746" className="inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium hover:bg-muted"><PhoneCall className="h-4 w-4" /> Contact</a>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4" aria-label="Directory trust features">
        {[
          { icon: MapPin, title: "Location-led", text: "Real city and area links from the live directory." },
          { icon: LockKeyhole, title: "Privacy-aware", text: "No account is needed to browse public listings." },
          { icon: CheckCircle2, title: "Clear process", text: "Structured details with a route for correction requests." },
          { icon: PhoneCall, title: "Direct contact", text: "Call and WhatsApp actions are available on listings." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="surface-panel min-h-44 p-5">
            <Icon className="mb-4 h-7 w-7 text-accent" aria-hidden="true" />
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutUs;

