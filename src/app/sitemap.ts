import type { MetadataRoute } from "next";

import { getDocSlugAll } from "@/lib/docs";
import { getGameSlugAll } from "@/lib/games";
import { getToolDataAll } from "@/lib/tools";

export const dynamic = "force-static";

const BASE_URL = (process.env.BASE_URL || "https://ittokunvim.site").replace(
  /\/$/,
  "",
);

function toUrl(path: string): string {
  return new URL(path, `${BASE_URL}/`).href;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const docSlugs = await getDocSlugAll();
  const gameSlugs = await getGameSlugAll();
  const tools = getToolDataAll();
  const staticRoutes = ["/", "/nextjs", "/music", "/pictures"];

  const routes = staticRoutes.map((path) => ({
    url: toUrl(path),
    lastModified,
  }));
  const docPages = docSlugs.map((slug) => ({
    url: toUrl(`/docs/${slug}`),
    lastModified,
  }));
  const gamePages = gameSlugs.map((slug) => ({
    url: toUrl(`/games/${slug}`),
    lastModified,
  }));
  const toolPages = tools.map((tool) => ({
    url: toUrl(`/tools/${tool.slug}`),
    lastModified,
  }));

  return [...routes, ...docPages, ...gamePages, ...toolPages];
}
