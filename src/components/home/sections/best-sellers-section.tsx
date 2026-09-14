import { ProductCard } from "@/components/product/product-card";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import { getProductListPageHref } from "@/lib/utils";
import { usePreferenceStore } from "@/stores/preference.store";
import type { HomeProductType } from "@/types/home.type";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { HomeSectionHeader } from "../home-section-header";

export function BestSellersSection({
  products,
}: {
  products: HomeProductType[];
}) {
  if (!products) {
    return null;
  }

  const gender = usePreferenceStore((state) => state.gender);

  return (
    <section className="bg-secondary/30 py-20" id="best-sellers">
      <ContentWrapper>
        <HomeSectionHeader
          title="Best Sellers"
          subtitle="Most Popular"
          linkHref={getProductListPageHref(gender)}
          linkLabel="View All"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          to={getProductListPageHref(gender)}
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium hover:underline md:hidden"
        >
          Shop All Best Sellers
          <ArrowRight className="h-4 w-4" />
        </Link>
      </ContentWrapper>
    </section>
  );
}
