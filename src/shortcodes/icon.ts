/** URL prefix the site is served under on GitHub Pages (https://<user>.github.io/QuitUSM-site/). */
export const PATH_PREFIX = "/QuitUSM-site/";

/**
 * Renders a decorative SVG icon from public/images/icons, colored via CSS mask + currentColor.
 * The URL lives in an inline style, which HtmlBasePlugin doesn't rewrite, so the prefix is applied here.
 */
export const icon = (name: string, className = ""): string =>
  `<span class="${["icon", className].filter(Boolean).join(" ")}" style="--icon: url('${PATH_PREFIX}images/icons/${name}.svg')" aria-hidden="true"></span>`;
