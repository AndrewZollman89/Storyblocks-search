export function buildStoryblocksUrl(
    type: "images" | "videos" | "audio",
    keywords: string,
    page = 1,
    perPage = 24
  ) {
    const url = new URL(`https://api.storyblocks.com/${type}/search`);
    url.searchParams.set("keywords", keywords.trim());
    url.searchParams.set("page", String(page));
    url.searchParams.set("results_per_page", String(perPage));
    return url.toString();
  }