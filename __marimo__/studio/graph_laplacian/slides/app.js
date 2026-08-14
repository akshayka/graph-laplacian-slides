const shell = document.getElementById("app-shell");
const slides = Array.from(document.querySelectorAll(".deck > .slide"));
const ticks = Array.from(document.querySelectorAll(".rail .tick"));

function indexFromHash() {
  const match = /^#\/(\d+)$/.exec(location.hash);
  if (!match) return 0;
  return Math.min(Math.max(Number(match[1]) - 1, 0), slides.length - 1);
}

let current = -1;

function show(next) {
  const target = Math.min(Math.max(next, 0), slides.length - 1);
  if (target === current) return;
  current = target;
  slides.forEach((slide, index) => {
    slide.classList.toggle("present", index === current);
  });
  ticks.forEach((tick, index) => {
    tick.classList.toggle("passed", index < current);
    if (index === current) {
      tick.setAttribute("aria-current", "true");
    } else {
      tick.removeAttribute("aria-current");
    }
  });
  shell.dataset.slide = String(current);
  history.replaceState(null, "", `#/${current + 1}`);
}

// Never steal keys from marimo controls or other interactive elements. The
// event may originate inside a shadow root, so scan the whole composed path.
const INTERACTIVE =
  ".hud, .control, input, textarea, select, button, [contenteditable], " +
  "marimo-ui-element, [role='slider'], [role='combobox'], [role='listbox'], [role='menu']";

function focusIsInteractive(event) {
  const path = event.composedPath ? event.composedPath() : [event.target];
  return path.some(
    (node) =>
      node instanceof Element &&
      (node.matches(INTERACTIVE) || node.tagName.toLowerCase().startsWith("marimo-")),
  );
}

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
    return;
  }
  if (focusIsInteractive(event)) return;
  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
    case "PageDown":
    case " ":
      event.preventDefault();
      show(current + 1);
      break;
    case "ArrowLeft":
    case "ArrowUp":
    case "PageUp":
      event.preventDefault();
      show(current - 1);
      break;
    case "Home":
      event.preventDefault();
      show(0);
      break;
    case "End":
      event.preventDefault();
      show(slides.length - 1);
      break;
  }
});

ticks.forEach((tick) => {
  tick.addEventListener("click", () => show(Number(tick.dataset.slide)));
});

let touchStartX = null;
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
});
document.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const delta = event.changedTouches[0].clientX - touchStartX;
  touchStartX = null;
  if (Math.abs(delta) < 40) return;
  show(delta < 0 ? current + 1 : current - 1);
});

window.addEventListener("hashchange", () => show(indexFromHash()));
show(indexFromHash());
