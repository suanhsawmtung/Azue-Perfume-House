import { SEO, type SEOProps } from "@/components/shared/seo";
import { useEffect } from "react";
import { Outlet, useLocation, useMatches } from "react-router";

type Metadata = SEOProps;

type RouteHandle = {
  metadata?: Metadata;
};

const resolveMetadata = (handle: RouteHandle): SEOProps | undefined => {
  if (
    typeof handle !== "object" ||
    handle === null ||
    !("metadata" in handle)
  ) {
    return undefined;
  }

  const metadata = (handle as RouteHandle).metadata;

  if (!metadata) return undefined;

  return metadata;
};

export const RootLayout = () => {
  const matches = useMatches();

  const metadata = [...matches]
    .reverse()
    .map(({ handle }) => resolveMetadata(handle as RouteHandle))
    .find((metadata): metadata is SEOProps => Boolean(metadata));

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      {metadata && <SEO {...metadata} />}
      <Outlet />
    </>
  );
};
