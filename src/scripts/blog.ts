import { PAGE_SIZE, planView, statusMessage, type BlogView } from "./lib/blogFilter";

const SELECTORS = {
  search: "[data-blog-search]",
  input: "[data-blog-search] input",
  list: "[data-blog-list]",
  more: "[data-blog-more]",
  empty: "[data-blog-empty]",
  status: "[data-blog-status]",
} as const;

type BlogElements = Record<keyof typeof SELECTORS, HTMLElement> & { input: HTMLInputElement };

/** Maps each selector name to its element, or returns null if any is missing. */
const findElements = (root: ParentNode): BlogElements | null => {
  const entries = Object.entries(SELECTORS).map(([name, selector]) => [name, root.querySelector(selector)]);
  return entries.every(([, element]) => element) ? (Object.fromEntries(entries) as BlogElements) : null;
};

const findCards = (list: HTMLElement): HTMLElement[] =>
  Array.from(list.querySelectorAll<HTMLElement>("[data-search-text]"));

const searchText = (card: HTMLElement): string => card.dataset.searchText ?? "";

const render = (els: BlogElements, cards: HTMLElement[], view: BlogView<HTMLElement>): void => {
  const visible = new Set(view.visible);
  cards.forEach((card) => (card.hidden = !visible.has(card)));
  els.more.hidden = !view.hasMore;
  els.empty.hidden = view.matchCount > 0;
  els.status.textContent = statusMessage(view.visible.length, view.matchCount);
};

const focusCard = (card: HTMLElement | undefined): void => {
  card?.querySelector<HTMLElement>("a")?.focus();
};

/** Plans and renders the list for the current query and limit. */
const update = (els: BlogElements, cards: HTMLElement[], limit: number): BlogView<HTMLElement> => {
  const view = planView(cards, searchText, els.input.value, limit);
  render(els, cards, view);
  return view;
};

export const initBlog = (root: ParentNode = document): void => {
  const els = findElements(root);
  if (!els) return;
  const cards = findCards(els.list);
  let limit = PAGE_SIZE;

  els.search.hidden = false;
  els.input.addEventListener("input", () => {
    limit = PAGE_SIZE;
    update(els, cards, limit);
  });
  els.more.addEventListener("click", () => {
    // "Load more" only shows when every slot up to `limit` is filled, so the first new card is at index `limit`.
    const firstNew = limit;
    limit += PAGE_SIZE;
    focusCard(update(els, cards, limit).visible[firstNew]);
  });
  update(els, cards, limit);
};

initBlog();
