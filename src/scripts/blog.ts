import { PAGE_SIZE, countMatches, hasMore, statusMessage, visibility } from "./lib/blogFilter";

type BlogElements = {
  search: HTMLElement;
  input: HTMLInputElement;
  cards: HTMLElement[];
  more: HTMLElement;
  empty: HTMLElement;
  status: HTMLElement;
};

const findElements = (root: ParentNode): BlogElements | null => {
  const search = root.querySelector<HTMLElement>("[data-blog-search]");
  const input = search?.querySelector<HTMLInputElement>("input");
  const list = root.querySelector<HTMLElement>("[data-blog-list]");
  const more = root.querySelector<HTMLElement>("[data-blog-more]");
  const empty = root.querySelector<HTMLElement>("[data-blog-empty]");
  const status = root.querySelector<HTMLElement>("[data-blog-status]");
  if (!search || !input || !list || !more || !empty || !status) return null;
  const cards = Array.from(list.querySelectorAll<HTMLElement>("[data-search-text]"));
  return { search, input, cards, more, empty, status };
};

const render = (els: BlogElements, query: string, limit: number): void => {
  const texts = els.cards.map((card) => card.dataset.searchText ?? "");
  const visible = visibility(texts, query, limit);
  const matchCount = countMatches(texts, query);
  els.cards.forEach((card, i) => (card.hidden = !visible[i]));
  els.more.hidden = !hasMore(matchCount, limit);
  els.empty.hidden = matchCount > 0;
  els.status.textContent = statusMessage(visible.filter(Boolean).length, matchCount);
};

const focusCard = (card: HTMLElement | undefined): void => {
  card?.querySelector<HTMLElement>("a")?.focus();
};

export const initBlog =(root: ParentNode = document): void => {
  const els = findElements(root);
  if (!els) return;
  let limit = PAGE_SIZE;
  const update = () => render(els, els.input.value, limit);

  els.search.hidden = false;
  els.input.addEventListener("input", () => {
    limit = PAGE_SIZE;
    update();
  });
  els.more.addEventListener("click", () => {
    const firstNew = els.cards.filter((card) => !card.hidden).length;
    limit += PAGE_SIZE;
    update();
    focusCard(els.cards.filter((card) => !card.hidden)[firstNew]);
  });
  update();
};

initBlog();
