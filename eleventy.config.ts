import { build } from "esbuild";
import { renderApp, validateApp } from "./src/shortcodes/app";
import { HtmlBasePlugin } from "@11ty/eleventy";
import { icon, PATH_PREFIX } from "./src/shortcodes/icon";

type CollectionItem = { data: Record<string, unknown>; date: Date };

const OUTPUT_DIR = "_site";
const SCRIPT_ENTRIES = ["src/scripts/nav.ts", "src/scripts/blog.ts"];

const byOrder = (a: CollectionItem, b: CollectionItem): number =>
  Number(a.data.order ?? 0) - Number(b.data.order ?? 0);

const byNewest = (a: CollectionItem, b: CollectionItem): number =>
  b.date.getTime() - a.date.getTime();

const bundleScripts = () =>
  build({
    entryPoints: SCRIPT_ENTRIES,
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2020",
    outdir: `${OUTPUT_DIR}/assets/js`,
  });

/** Inlines the @imported partials into one minified stylesheet. Site-root URLs (e.g. images/...) are left as-is. */
const bundleStyles = () =>
  build({
    entryPoints: ["src/styles/main.css"],
    bundle: true,
    minify: true,
    external: ["/images/*"],
    outdir: `${OUTPUT_DIR}/assets/css`,
  });

export default function (eleventyConfig: any) {
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });
  eleventyConfig.addPassthroughCopy({ "book/docs": "book" });

  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.addWatchTarget("src/styles/");
  eleventyConfig.on("eleventy.before", () => Promise.all([bundleScripts(), bundleStyles()]));

  eleventyConfig.addCollection("guides", (api: any) =>
    api.getFilteredByGlob("src/guides/*.md").sort(byOrder),
  );
  eleventyConfig.addCollection("posts", (api: any) =>
    api.getFilteredByGlob("src/blog/posts/*.md").sort(byNewest),
  );

  eleventyConfig.addShortcode("icon", icon);
  eleventyConfig.addPairedShortcode("appcard", function (this: any, description: string, id: string) {
    return renderApp(id, validateApp(id, this.ctx.apps?.[id]), description);
  });
  eleventyConfig.addGlobalData("year", new Date().getFullYear());
  // Appended to asset URLs so each deploy makes browsers fetch fresh CSS/JS instead of stale cached copies.
  eleventyConfig.addGlobalData("buildTime", Date.now());
  eleventyConfig.addFilter("readableDate", (date: Date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );

  eleventyConfig.addPlugin(HtmlBasePlugin);

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: OUTPUT_DIR },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: PATH_PREFIX,
  };
}
