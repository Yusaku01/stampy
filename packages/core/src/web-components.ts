import {
  defaultStampDesign,
  normalizeStampDesign,
  renderStampSvg,
  type StampDesign,
  type StampIcon,
  type StampShape,
} from "./stamp-design.js";

const style = `:host {
  display: inline-block;
  inline-size: var(--stampy-size, 160px);
  aspect-ratio: 1;
  color: var(--stampy-ink, ${defaultStampDesign.ink});
}

.stampy-root,
.stampy-root svg {
  display: block;
  inline-size: 100%;
  block-size: 100%;
}

text {
  font-family: ui-rounded, "Hiragino Maru Gothic ProN", "Yu Gothic", system-ui, sans-serif;
  font-weight: 800;
  letter-spacing: 0;
}

.stampy-date { font-size: 11px; }
.stampy-main { font-size: 18px; }
.stampy-sub { font-size: 10px; }`;

const HTMLElementBase: typeof HTMLElement =
  globalThis.HTMLElement ??
  (class extends EventTarget {} as unknown as typeof HTMLElement);

export class StampyMarkElement extends HTMLElementBase {
  static observedAttributes = [
    "shape",
    "main-text",
    "sub-text",
    "date-text",
    "ink",
    "paper",
    "icon",
    "distress",
    "roughen",
    "rotate",
  ];

  #root = this.attachShadow({ mode: "open" });

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  get design(): Required<StampDesign> {
    return normalizeStampDesign({
      id: this.id || defaultStampDesign.id,
      shape: this.getAttribute("shape") as StampShape | undefined,
      mainText: this.getAttribute("main-text") ?? undefined,
      subText: this.getAttribute("sub-text") ?? undefined,
      dateText: this.getAttribute("date-text") ?? undefined,
      ink: this.getAttribute("ink") ?? undefined,
      paper: this.getAttribute("paper") ?? undefined,
      icon: this.getAttribute("icon") as StampIcon | undefined,
      distress: Number(this.getAttribute("distress") ?? defaultStampDesign.distress),
      roughen: Number(this.getAttribute("roughen") ?? defaultStampDesign.roughen),
      rotate: Number(this.getAttribute("rotate") ?? defaultStampDesign.rotate),
    });
  }

  set design(value: StampDesign) {
    const design = normalizeStampDesign(value);
    this.setAttribute("shape", design.shape);
    this.setAttribute("main-text", design.mainText);
    this.setAttribute("sub-text", design.subText);
    this.setAttribute("date-text", design.dateText);
    this.setAttribute("ink", design.ink);
    this.setAttribute("paper", design.paper);
    this.setAttribute("icon", design.icon);
    this.setAttribute("distress", String(design.distress));
    this.setAttribute("roughen", String(design.roughen));
    this.setAttribute("rotate", String(design.rotate));
  }

  render(): void {
    const design = this.design;
    this.style.setProperty("--stampy-ink", design.ink);
    this.#root.innerHTML = `<style>${style}</style><span class="stampy-root">${renderStampSvg(design)}</span>`;
  }
}

export const registerStampyElements = (): void => {
  if (!globalThis.customElements) return;
  if (!globalThis.customElements.get("stampy-mark")) {
    globalThis.customElements.define("stampy-mark", StampyMarkElement);
  }
};
