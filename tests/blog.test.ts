import { beforeEach, describe, expect, it } from "vitest";
import { initBlog } from "../src/scripts/blog";

const card = (text: string) => `<li data-search-text="${text}"><a href="#">${text}</a></li>`;

const setup = (count: number) => {
  const items = Array.from({ length: count }, (_, i) => card(`post ${i}${i === 7 ? " special" : ""}`));
  document.body.innerHTML = `
    <div data-blog-search hidden><input></div>
    <p data-blog-status></p>
    <ul data-blog-list>${items.join("")}</ul>
    <p data-blog-empty hidden></p>
    <button data-blog-more hidden></button>`;
  initBlog(document);
};

const visibleCount = () => document.querySelectorAll("li:not([hidden])").length;
const more = () => document.querySelector<HTMLButtonElement>("[data-blog-more]")!;
const search = (value: string) => {
  const input = document.querySelector("input")!;
  input.value = value;
  input.dispatchEvent(new Event("input"));
};

describe("blog page", () => {
  beforeEach(() => setup(14));

  it("reveals the search bar and shows the first 6 articles", () => {
    expect(document.querySelector<HTMLElement>("[data-blog-search]")!.hidden).toBe(false);
    expect(visibleCount()).toBe(6);
    expect(more().hidden).toBe(false);
  });

  it("loads 6 more per click, hides the button at the end and focuses new content", () => {
    more().click();
    expect(visibleCount()).toBe(12);
    expect(document.activeElement?.textContent).toBe("post 6");
    more().click();
    expect(visibleCount()).toBe(14);
    expect(more().hidden).toBe(true);
  });

  it("filters articles by search and shows an empty state", () => {
    search("special");
    expect(visibleCount()).toBe(1);
    expect(more().hidden).toBe(true);
    search("nothing matches");
    expect(visibleCount()).toBe(0);
    expect(document.querySelector<HTMLElement>("[data-blog-empty]")!.hidden).toBe(false);
    expect(document.querySelector("[data-blog-status]")!.textContent).toBe("No articles found");
  });

  it("hides load more when there are 6 or fewer articles", () => {
    setup(5);
    expect(more().hidden).toBe(true);
  });
});
