import type { MetadataRoute } from "next";

function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.passprotector.in";
  return envUrl.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  // Public, indexable routes only. Auth-protected/dashboard and API routes are excluded.
  const routes: Array<MetadataRoute.Sitemap[number]> = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/generate/password`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/generate/passphrase`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/login`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  return routes;
}


