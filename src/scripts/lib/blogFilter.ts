export const PAGE_SIZE = 6;

export const normalize = (text: string): string => text.trim().toLowerCase();

export const matchesQuery = (searchText: string, query: string): boolean =>
  normalize(query)
    .split(/\s+/)
    .every((term) => normalize(searchText).includes(term));

/** Returns, for each item, whether it should be visible. */
export const visibility = (searchTexts: string[], query: string, limit: number): boolean[] => {
  let shown = 0;
  return searchTexts.map((text) => {
    const visible = matchesQuery(text, query) && shown < limit;
    if (visible) shown += 1;
    return visible;
  });
};

export const countMatches = (searchTexts: string[], query: string): number =>
  searchTexts.filter((text) => matchesQuery(text, query)).length;

export const hasMore = (matchCount: number, limit: number): boolean => matchCount > limit;

export const statusMessage = (shownCount: number, matchCount: number): string =>
  matchCount === 0
    ? "No articles found"
    : `Showing ${shownCount} of ${matchCount} article${matchCount === 1 ? "" : "s"}`;
