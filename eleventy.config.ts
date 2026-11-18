import { build } from "esbuild";

type CollectionItem = { data: Record<string, unknown>; date: Date };

const SCRIPT_ENTRIES = ["src/scripts/main.ts", "src/scripts/blog.ts"];

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
    outdir: "_site/assets/js",
  });

export default function (eleventyConfig: any) {
  eleventyConfig.addPassthroughCopy({ "public/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/styles": "assets/css" });

  eleventyConfig.addWatchTarget("src/scripts/");
  eleventyConfig.on("eleventy.before", bundleScripts);

  eleventyConfig.addCollection("guides", (api: any) =>
    api.getFilteredByGlob("src/guides/*.md").sort(byOrder),
  );
  eleventyConfig.addCollection("posts", (api: any) =>
    api.getFilteredByGlob("src/blog/posts/*.md").sort(byNewest),
  );

  eleventyConfig.addFilter("year", () => new Date().getFullYear());
  eleventyConfig.addFilter("readableDate", (date: Date) =>
    date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
