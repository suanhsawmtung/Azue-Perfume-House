import HeroImage from "@/assets/images/azue-perfume-house-hero-image.jpeg";
import { Button } from "@/components/ui/button";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { getProductListPageHref } from "@/lib/utils";
import { usePreferenceStore } from "@/stores/preference.store";
import { ArrowRight, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router";

const HERO_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Authenticity",
    subtitle: "Guaranteed",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    subtitle: "On-time arrival",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    subtitle: "& Exchanges",
  },
];

export function HeroSection() {
  const gender = usePreferenceStore((state) => state.gender);

  return (
    <section className="relative min-h-[94vh] overflow-hidden lg:min-h-[91vh]">
      <div className="absolute inset-0">
        <img
          src={HeroImage}
          alt="Luxury perfume bottles"
          className="h-full w-full object-cover"
        />
        <div className="from-background/95 via-background/70 absolute inset-0 bg-gradient-to-r to-transparent" />
      </div>

      <ContentWrapper className="relative flex min-h-[94vh] items-center lg:min-h-[91vh]">
        <div className="max-w-2xl">
          <span className="text-muted-foreground inline-block text-xs font-medium tracking-[0.3em] uppercase">
            {`New Collection ${new Date().getFullYear()}`}
          </span>
          <h1 className="mt-4 font-serif text-5xl leading-tight font-medium tracking-tight text-balance md:text-6xl lg:text-7xl">
            Discover Your Signature Scent
          </h1>
          <p className="text-muted-foreground mt-6 max-w-lg text-lg leading-relaxed">
            Immerse yourself in a world of exquisite fragrances. Each perfume is
            crafted with the finest ingredients to create unforgettable
            experiences.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link to={getProductListPageHref(gender)}>
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/blogs">Our Story</Link>
            </Button>
          </div>

          {/* <div className="mt-16 flex gap-12">
            <div>
              <p className="text-3xl font-semibold">150+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Unique Fragrances
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold">50k+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Happy Customers
              </p>
            </div>
            <div>
              <p className="text-3xl font-semibold">25+</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Awards Won
              </p>
            </div>
          </div> */}

          {/* Hero Info Section */}
          <div className="border-border/40 mt-16 flex flex-wrap items-center justify-between gap-x-2 gap-y-8 border-t pt-10 sm:justify-start sm:gap-x-12">
            {HERO_FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group flex flex-col items-center gap-4 sm:flex-row"
              >
                <div className="bg-secondary/50 text-foreground group-hover:bg-foreground group-hover:text-background flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-all duration-300">
                  <feature.icon className="h-5 w-5" strokeWidth={1.5} />
                </div>
                <div className="space-y-0.5 text-center sm:text-start">
                  <p className="text-sm font-semibold tracking-wide">
                    {feature.title}
                  </p>
                  <p className="text-muted-foreground text-xs tracking-wider uppercase">
                    {feature.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ContentWrapper>
    </section>
  );
}
