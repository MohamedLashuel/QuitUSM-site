import { beforeEach, describe, expect, it } from "vitest";
import { initNav } from "../src/scripts/main";

const html = `
  <nav class="nav">
    <button class="nav__toggle" aria-expanded="false"></button>
    <ul>
      <li class="nav__dropdown">
        <button class="nav__dropdown-toggle" aria-expanded="false"></button>
        <ul><li><a href="#">Guide</a></li></ul>
      </li>
    </ul>
  </nav>
  <p id="outside">outside</p>`;

const get = (selector: string) => document.querySelector<HTMLElement>(selector)!;
const expanded = (selector: string) => get(selector).getAttribute("aria-expanded");

describe("navigation", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    initNav(document);
  });

  it("toggles the mobile menu", () => {
    get(".nav__toggle").click();
    expect(expanded(".nav__toggle")).toBe("true");
    get(".nav__toggle").click();
    expect(expanded(".nav__toggle")).toBe("false");
  });

  it("toggles the guides submenu on click", () => {
    get(".nav__dropdown-toggle").click();
    expect(expanded(".nav__dropdown-toggle")).toBe("true");
  });

  it("closes the submenu on Escape and returns focus", () => {
    get(".nav__dropdown-toggle").click();
    get(".nav__dropdown a").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(expanded(".nav__dropdown-toggle")).toBe("false");
    expect(document.activeElement).toBe(get(".nav__dropdown-toggle"));
  });

  it("closes menus when clicking outside", () => {
    get(".nav__toggle").click();
    get(".nav__dropdown-toggle").click();
    get("#outside").click();
    expect(expanded(".nav__toggle")).toBe("false");
    expect(expanded(".nav__dropdown-toggle")).toBe("false");
  });
});
