import { beforeAll, beforeEach, describe, expect, it } from "vitest";

const html = `
  <nav>
    <details id="menu" data-dismissible>
      <summary>Menu</summary>
      <details id="guides" class="nav__dropdown" data-dismissible>
        <summary>Guides</summary>
        <a href="#">Guide</a>
      </details>
    </details>
  </nav>
  <p id="outside">outside</p>`;

const get = <T extends HTMLElement = HTMLElement>(selector: string) => document.querySelector<T>(selector)!;
const details = (id: string) => get<HTMLDetailsElement>(`#${id}`);
const pressEscape = (target: HTMLElement) =>
  target.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

describe("navigation", () => {
  // Like the browser: the page exists first, then the script initializes itself once on import.
  beforeAll(async () => {
    document.body.innerHTML = html;
    await import("../src/scripts/nav");
  });

  beforeEach(() => {
    details("menu").open = true;
    details("guides").open = true;
  });

  it("closes only the innermost menu on Escape and returns focus to its toggle", () => {
    pressEscape(get("#guides a"));
    expect(details("guides").open).toBe(false);
    expect(details("menu").open).toBe(true);
    expect(document.activeElement).toBe(get("#guides > summary"));
  });

  it("closes the outer menu on a second Escape", () => {
    pressEscape(get("#guides a"));
    pressEscape(get("#guides > summary"));
    expect(details("menu").open).toBe(false);
    expect(document.activeElement).toBe(get("#menu > summary"));
  });

  it("closes menus when clicking outside", () => {
    get("#outside").click();
    expect(details("menu").open).toBe(false);
    expect(details("guides").open).toBe(false);
  });

  it("keeps menus open when clicking inside them", () => {
    get("#guides a").click();
    expect(details("guides").open).toBe(true);
  });

  it("closes the dropdown when the pointer leaves it", () => {
    details("guides").dispatchEvent(new MouseEvent("mouseleave"));
    expect(details("guides").open).toBe(false);
  });
});
