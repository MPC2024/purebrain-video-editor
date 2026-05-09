import type { Metadata } from "next/types";

export function createMetadata(override: Metadata): Metadata {
  return {
    ...override,
    openGraph: {
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      url: "https://purebrain.ai",
      images: "/banner.png",
      siteName: "PureBrain Video Editor",
      ...override.openGraph
    },
    twitter: {
      card: "summary_large_image",
      creator: "@PureBrain",
      title: override.title ?? undefined,
      description: override.description ?? undefined,
      images: "/banner.png",
      ...override.twitter
    },
    icons: {
      icon: "/icon.svg"
    }
  };
}

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? new URL("http://localhost:3000")
    : new URL("https://purebrain.ai");
