import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { HomeReviewType } from "@/types/home.type";
import Autoplay from "embla-carousel-autoplay";
import { NReviewCard } from "../shared/review-card";
import ContentWrapper from "../wrapper/content-wrapper";
import { HomeSectionHeader } from "./home-section-header";

export function ReviewsSlider({ reviews }: { reviews: HomeReviewType[] }) {
  return (
    <section className="py-20" id="customer-reviews">
      <ContentWrapper>
        <HomeSectionHeader
          title="What Our Customers Say"
          subtitle="Testimonials"
        />

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="mt-10 w-full"
        >
          <CarouselContent className="-ml-4">
            {reviews.map((review) => (
              <CarouselItem
                key={review.id}
                className="pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <NReviewCard review={review} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-10 flex justify-center gap-4 lg:block">
            <CarouselPrevious className="static translate-y-0 lg:absolute lg:top-1/2 lg:-left-12 lg:-translate-y-1/2" />
            <CarouselNext className="static translate-y-0 lg:absolute lg:top-1/2 lg:-right-12 lg:-translate-y-1/2" />
          </div>
        </Carousel>
      </ContentWrapper>
    </section>
  );
}
