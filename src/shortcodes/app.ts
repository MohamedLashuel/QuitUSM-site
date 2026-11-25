import markdownIt from "markdown-it";
import { icon } from "./icon";

export const PLATFORMS = {
  chrome: { label: "Chrome", icon: "chrome" },
  firefox: { label: "Firefox", icon: "firefox" },
  edge: { label: "Edge", icon: "browser" },
  safari: { label: "Safari", icon: "safari" },
  ios: { label: "iOS", icon: "apple" },
  android: { label: "Android", icon: "android" },
  windows: { label: "Windows", icon: "windows" },
  macos: { label: "macOS", icon: "apple" },
  linux: { label: "Linux", icon: "linux" },
  web: { label: "Website", icon: "web" },
} as const;

export type Platform = keyof typeof PLATFORMS;

export type App = {
  name: string;
  icon: string;
  links: Partial<Record<Platform, string>>;
  price: string;
};

const md = markdownIt({ html: true });

const escapeHtml = (text: string): string =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

const isPlatform = (key: string): key is Platform => Object.hasOwn(PLATFORMS, key);

/** Throws at build time so a typo in apps.json breaks the build instead of silently dropping content. */
export const validateApp = (id: string, app: Partial<App> | undefined): App => {
  if (!app) throw new Error(`app shortcode: unknown app "${id}" (add it to src/_data/apps.json)`);
  if (!app.name || !app.icon || !app.price) throw new Error(`app shortcode: "${id}" needs a name, an icon and a price`);
  const links = Object.entries(app.links ?? {});
  if (links.length === 0) throw new Error(`app shortcode: "${id}" has no download links`);
  const unknown = links.map(([key]) => key).filter((key) => !isPlatform(key));
  if (unknown.length > 0) {
    throw new Error(`app shortcode: "${id}" has unknown platform(s) ${unknown.join(", ")}; use one of ${Object.keys(PLATFORMS).join(", ")}`);
  }
  return app as App;
};

const platformIcon = (name: string): string => icon(`platforms/${name}`, "app-card__link-icon");

const renderLink = (appName: string) => ([platform, url]: [string, string]): string => {
  const { label, icon } = PLATFORMS[platform as Platform];
  return `<li><a class="app-card__link" href="${escapeHtml(url)}">${platformIcon(icon)}<span class="visually-hidden">Get ${escapeHtml(appName)} for </span>${label}</a></li>`;
};

const renderPrice = (price: string): string => {
  const free_class: string = (price == "Free" ? " free" : "")
  return ` <span class="app-card__price${free_class}">${escapeHtml(price)}</span>`
}

/**
 * Renders one app card. Output has no blank lines or indentation so Markdown treats it as a single HTML block.
 * The description is Markdown, rendered here because Nunjucks runs before Markdown and would leave it raw.
 */
export const renderApp = (id: string, app: App, description: string): string =>
  [
    `<div class="app-card">`,
    `<div class="app-card__leftcol">`,
    `<img class="app-card__icon" src="${escapeHtml(app.icon)}" alt="" width="64" height="64">`,
    `${renderPrice(app.price)}`,
    `</div>`,
    `<div class="app-card__body">`,
    `<h3 class="app-card__name" id="${escapeHtml(id)}">${escapeHtml(app.name)}</h3>`,
    md.render(description.trim()).trim(),
    `</div>`,
    `<ul class="app-card__links" aria-label="Downloads for ${escapeHtml(app.name)}">`,
    ...Object.entries(app.links).map(renderLink(app.name)),
    `</ul>`,
    `</div>`,
  ].join("");
