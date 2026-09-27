import { Link } from "react-router-dom";
import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/config/site";

const HeroSection = () => (
  <section className="relative isolate min-h-[540px] overflow-hidden border-b md:min-h-[620px]">
    <div className="absolute inset-0 -z-20 bg-black">
      {SITE.hero.video ? (
        <video
          className="h-full w-full object-cover"
          muted
          autoPlay
          loop
          playsInline
          poster={SITE.hero.poster}
          aria-label={SITE.hero.imageAlt}
        >
          <source src={SITE.hero.video} />
        </video>
      ) : (
        <img
          src={SITE.hero.image}
          srcSet={`${SITE.hero.image} 1730w`}
          sizes="100vw"
          alt={SITE.hero.imageAlt}
          className="h-full w-full object-cover"
          width="1730"
          height="909"
          fetchPriority="high"
          decoding="async"
        />
      )}
    </div>
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/75 to-black/35" />
    <div className="container flex min-h-[540px] items-center py-16 md:min-h-[620px]">
      <div className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-pink-300">Browse by city and area</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
          Find verified call girls and escort service near you
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
          Explore current listings across Mumbai, Pune, Banglore, Hyderabad, Chennai, Thane and every live location in our directory.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#browse-by-location" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Browse Profiles
          </a>
          <a href={`tel:${SITE.phoneE164}`} className="inline-flex h-11 items-center gap-2 rounded-md border border-white/40 bg-black/30 px-4 font-medium text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <Phone className="h-4 w-4" /> Call {SITE.phoneDisplay}
          </a>
          <a href={`https://wa.me/${SITE.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-md bg-[#25D366] px-4 font-medium text-black hover:bg-[#20ba5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;
