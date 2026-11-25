// Menus are native <details> elements; this only adds dismissal, which <details> lacks.
const OPEN_MENUS = "details[data-dismissible][open]";

const close = (menu: HTMLDetailsElement): void => {
  menu.open = false;
};

/** Closes every open menu that doesn't contain the clicked element. */
const closeOpenMenusExceptClicked = (root: ParentNode, target: Node): void => {
  root.querySelectorAll<HTMLDetailsElement>(OPEN_MENUS).forEach((menu) => {
    if (!menu.contains(target)) close(menu);
  });
};

/** Closes the innermost open menu around the focused element and returns focus to that menu's toggle. */
const closeInnermostMenu = (target: Element): void => {
  const menu = target.closest<HTMLDetailsElement>(OPEN_MENUS);
  if (!menu) return;
  close(menu);
  menu.querySelector<HTMLElement>(":scope > summary")?.focus();
};

export const initNav = (root: Document = document): void => {
  root.addEventListener("click", (event) => {
    closeOpenMenusExceptClicked(root, event.target as Node)
  });
  root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeInnermostMenu(event.target as Element);
  });
  // On desktop the dropdown also opens on hover; reset click state when the pointer leaves.
  root.querySelectorAll<HTMLDetailsElement>(".nav__dropdown").forEach((dropdown) =>
    dropdown.addEventListener("mouseleave", () => close(dropdown)),
  );
};

initNav();
