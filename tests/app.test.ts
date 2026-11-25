import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PLATFORMS, renderApp, validateApp, type App } from "../src/shortcodes/app";

const app: App = {
  name: "Blocker & Co",
  icon: "/images/apps/blocker.png",
  links: { firefox: "https://example.com/ff", ios: "https://example.com/ios" },
  price: "$5/month",
};

/** Renders a card into the document and returns its root element. */
const render = (overrides: Partial<App> = {}, description = "Some **bold** text.") => {
  document.body.innerHTML = renderApp("blocker", { ...app, ...overrides }, description);
  return document.querySelector<HTMLElement>(".app-card")!;
};

const find = (card: HTMLElement, element: string) => card.querySelector<HTMLElement>(`.app-card__${element}`);

describe("validateApp", () => {
  it("accepts a valid app", () => {
    expect(validateApp("blocker", app)).toBe(app);
  });
  it("rejects an unknown app id", () => {
    expect(() => validateApp("missing", undefined)).toThrow(/unknown app "missing"/);
  });
  it("rejects an app without a name, icon or price", () => {
    expect(() => validateApp("blocker", { ...app, name: "" })).toThrow(/needs a name, an icon and a price/);
    expect(() => validateApp("blocker", { ...app, icon: "" })).toThrow(/needs a name, an icon and a price/);
    expect(() => validateApp("blocker", { ...app, price: undefined })).toThrow(/needs a name, an icon and a price/);
  });
  it("rejects an app without links", () => {
    expect(() => validateApp("blocker", { ...app, links: {} })).toThrow(/no download links/);
  });
  it("rejects unknown platforms, naming them", () => {
    const typo = { ...app, links: { firefx: "https://example.com" } } as Partial<App>;
    expect(() => validateApp("blocker", typo)).toThrow(/unknown platform\(s\) firefx/);
  });
});

describe("renderApp", () => {
  it("has no blank lines, so Markdown keeps it as one HTML block", () => {
    expect(renderApp("blocker", app, "One.\n\nTwo.")).not.toMatch(/\n\s*\n/);
  });

  it("renders a decorative icon", () => {
    const icon = find(render(), "icon") as HTMLImageElement;
    expect(icon.getAttribute("src")).toBe(app.icon);
    expect(icon.getAttribute("alt")).toBe("");
  });

  it("renders an anchored, escaped heading", () => {
    const name = find(render(), "name")!;
    expect(name.tagName).toBe("H3");
    expect(name.id).toBe("blocker");
    expect(name.textContent).toBe("Blocker & Co");
  });

  it("renders the description as Markdown", () => {
    const body = find(render({}, "One **two**.\n\nThree."), "body")!;
    expect(body.querySelectorAll("p")).toHaveLength(2);
    expect(body.querySelector("strong")!.textContent).toBe("two");
  });

  it("renders one link per platform, labelled by platform with app context for screen readers", () => {
    const links = [...find(render(), "links")!.querySelectorAll<HTMLAnchorElement>(".app-card__link")];
    expect(links.map((link) => link.href)).toEqual(["https://example.com/ff", "https://example.com/ios"]);
    expect(links.map((link) => link.textContent)).toEqual(["Get Blocker & Co for Firefox", "Get Blocker & Co for iOS"]);
  });

  it("gives each link its platform's decorative icon", () => {
    const icon = render().querySelector(".app-card__link-icon")!;
    expect(icon.getAttribute("aria-hidden")).toBe("true");
    expect(icon.getAttribute("style")).toContain("platforms/firefox.svg");
  });

  it("names the download list after the app", () => {
    expect(find(render(), "links")!.getAttribute("aria-label")).toBe("Downloads for Blocker & Co");
  });

  it("shows the price as a badge", () => {
    const price = find(render({ price: "<$5" }), "price")!;
    expect(price.textContent).toBe("<$5");
    expect(price.classList.contains("free")).toBe(false);
  });

  it("marks free apps so they can be highlighted", () => {
    expect(find(render({ price: "Free" }), "price")!.classList.contains("free")).toBe(true);
  });

  it("only uses classes that some stylesheet defines", () => {
    const css = readdirSync("src/styles", { recursive: true, encoding: "utf8" })
      .filter((file) => file.endsWith(".css"))
      .map((file) => readFileSync(`src/styles/${file}`, "utf8"))
      .join("\n");
    const isDefined = (name: string) => new RegExp(`\\.${name}(?![\\w-])`).test(css);
    render({ price: "Free" });
    const classes = new Set([...document.querySelectorAll("[class]")].flatMap((el) => [...el.classList]));
    expect([...classes].filter((name) => !isDefined(name))).toEqual([]);
  });
});

describe("PLATFORMS", () => {
  it("points every platform at an icon file that exists", () => {
    const missing = Object.values(PLATFORMS).filter(({ icon }) => !existsSync(`public/images/icons/platforms/${icon}.svg`));
    expect(missing).toEqual([]);
  });
});
