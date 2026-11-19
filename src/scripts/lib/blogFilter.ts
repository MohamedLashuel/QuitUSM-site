export const PAGE_SIZE = 6;

/** What the blog list should currently show. */
export type BlogView<T> = { visible: T[]; matchCount: number; hasMore: boolean };

export const normalize = (text: string): string => text.trim().toLowerCase();

export const matchesQuery = (searchText: string, query: string): boolean =>
  normalize(query)
    .split(/\s+/)
    .every((term) => normalize(searchText).includes(term));

/** Decides which items to show for a search query and a page limit. */
export const planView = <T>(
  items: T[],
  getText: (item: T) => string,
  query: string,
  limit: number,
): BlogView<T> => {
  const matches = items.filter((item) => matchesQuery(getText(item), query));
  return {
    visible: matches.slice(0, limit),
    matchCount: matches.length,
    hasMore: matches.length > limit,
  };
};

export const statusMessage = (shownCount: number, matchCount: number): string =>
  matchCount === 0
    ? "No articles found"
    : `Showing ${shownCount} of ${matchCount} article${matchCount === 1 ? "" : "s"}`;
