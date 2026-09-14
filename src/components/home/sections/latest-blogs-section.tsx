import { BlogGrid } from "@/components/blog/blog-grid";
import ContentWrapper from "@/components/wrapper/content-wrapper";
import type { HomePostType } from "@/types/home.type";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { HomeSectionHeader } from "../home-section-header";

export function LatestBlogsSection({ posts }: { posts: HomePostType[] }) {
  if (posts?.length === 0) {
    return null;
  }

  return (
    <section className="py-20" id="latest-blogs">
      <ContentWrapper>
        <HomeSectionHeader
          title="Latest Stories"
          subtitle="From the Journal"
          linkHref="/blogs"
          linkLabel="Read All"
        />

        <BlogGrid posts={posts} columns={2} />

        <Link
          to="/blogs"
          className="mt-8 flex items-center justify-center gap-2 text-sm font-medium hover:underline md:hidden"
        >
          Read All Stories
          <ArrowRight className="h-4 w-4" />
        </Link>
      </ContentWrapper>
    </section>
  );
}
