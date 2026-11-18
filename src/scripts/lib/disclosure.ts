export const isExpanded = (button: HTMLElement): boolean =>
  button.getAttribute("aria-expanded") === "true";

export const setExpanded = (button: HTMLElement, expanded: boolean): void => {
  button.setAttribute("aria-expanded", String(expanded));
};

export const toggleExpanded = (button: HTMLElement): void => {
  setExpanded(button, !isExpanded(button));
};

/** Wires a button to show/hide the element it controls (via aria-expanded + CSS). */
export const initDisclosure = (button: HTMLElement): void => {
  button.addEventListener("click", () => toggleExpanded(button));
};

/** Collapses the disclosure when the user clicks outside of `container` or presses Escape. */
export const closeOnDismiss = (button: HTMLElement, container: HTMLElement): void => {
  document.addEventListener("click", (event) => {
    if (!container.contains(event.target as Node)) setExpanded(button, false);
  });
  container.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isExpanded(button)) return;
    setExpanded(button, false);
    button.focus();
  });
};
