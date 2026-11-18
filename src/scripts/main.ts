import { closeOnDismiss, initDisclosure, setExpanded } from "./lib/disclosure";

const initMobileMenu = (nav: HTMLElement): void => {
  const toggle = nav.querySelector<HTMLElement>(".nav__toggle");
  if (!toggle) return;
  initDisclosure(toggle);
  closeOnDismiss(toggle, nav);
};

const initDropdown = (dropdown: HTMLElement): void => {
  const toggle = dropdown.querySelector<HTMLElement>(".nav__dropdown-toggle");
  if (!toggle) return;
  initDisclosure(toggle);
  closeOnDismiss(toggle, dropdown);
  // On desktop the menu also opens on hover; reset click state when the pointer leaves.
  dropdown.addEventListener("mouseleave", () => setExpanded(toggle, false));
};

export const initNav = (root: ParentNode = document): void => {
  const nav = root.querySelector<HTMLElement>(".nav");
  if (!nav) return;
  initMobileMenu(nav);
  nav.querySelectorAll<HTMLElement>(".nav__dropdown").forEach(initDropdown);
};

initNav();
