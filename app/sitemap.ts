import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";

const routes = [
  "",
  "/how-it-works",
  "/membership",
  "/safety",
  "/about",
  "/faq",
  "/apply",
  "/contact",
  "/terms",
  "/privacy",
  "/refunds",
  "/accessibility"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}
