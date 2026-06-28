export type StampShape =
  | "circle"
  | "square"
  | "triangle"
  | "star"
  | "ticket"
  | "rounded";
export type StampIcon = "steam" | "star" | "spark" | "none";

export type StampDesign = {
  id?: string;
  shape?: StampShape;
  cornerRadius?: number;
  mainText?: string;
  subText?: string;
  dateText?: string;
  ink?: string;
  inkOpacity?: number;
  paper?: string;
  icon?: StampIcon;
  distress?: number;
  roughen?: number;
  rotate?: number;
};

export const defaultStampDesign = {
  id: "stampy-mark",
  shape: "circle",
  cornerRadius: 0,
  mainText: "Visited",
  subText: "Stampy",
  dateText: "",
  ink: "#b93632",
  inkOpacity: 1,
  paper: "#fffaf4",
  icon: "steam",
  distress: 0.72,
  roughen: 2.25,
  rotate: -6,
} satisfies Required<StampDesign>;

const escapeText = (value: string): string =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const safeId = (value: string): string =>
  value.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64) || "stampy-mark";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const hasValue = <T>(value: T | undefined): value is T => value !== undefined;

const applyOpacity = (color: string, opacity: number): string => {
  if (opacity >= 1) return color;

  const hex = color.trim();
  const shortHexMatch = /^#([\da-f])([\da-f])([\da-f])$/i.exec(hex);
  const longHexMatch = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);

  if (shortHexMatch) {
    const [, r, g, b] = shortHexMatch;
    return `rgb(${parseInt(`${r}${r}`, 16)} ${parseInt(`${g}${g}`, 16)} ${parseInt(`${b}${b}`, 16)} / ${opacity})`;
  }

  if (longHexMatch) {
    const [, r, g, b] = longHexMatch;
    return `rgb(${parseInt(r, 16)} ${parseInt(g, 16)} ${parseInt(b, 16)} / ${opacity})`;
  }

  return color;
};

const iconPathByName: Record<StampIcon, string> = {
  steam:
    "M62 105c20-16-10-22 6-40 8-9 4-17-2-26M94 107c16-15-6-24 8-40 7-8 3-15-3-25",
  star:
    "M80 41l10 24 26 2-20 17 6 26-22-14-22 14 6-26-20-17 26-2 10-24z",
  spark: "M80 38v34M80 88v34M46 80h34M80 80h34M57 57l16 16M87 87l16 16M103 57L87 73M73 87l-16 16",
  none: "",
};

const normalizeShape = (shape: StampShape): Exclude<StampShape, "rounded"> =>
  shape === "rounded" ? "square" : shape;

const renderShape = (shape: StampShape, cornerRadius: number): string => {
  const normalizedShape = normalizeShape(shape);

  if (shape === "ticket") {
    return `
      <path d="M33 30h94a11 11 0 0 1 11 11v18a21 21 0 0 0 0 42v18a11 11 0 0 1-11 11H33a11 11 0 0 1-11-11v-18a21 21 0 0 0 0-42V41a11 11 0 0 1 11-11z" stroke-width="6.5"/>
      <path d="M40 41h80a8 8 0 0 1 8 8v62a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8V49a8 8 0 0 1 8-8z" stroke-width="2.4" opacity="0.76"/>
    `;
  }

  if (normalizedShape === "square") {
    const radius = String(cornerRadius);
    const innerRadius = String(Math.max(0, cornerRadius - 6));
    return `
      <rect x="24" y="28" width="112" height="104" rx="${radius}" stroke-width="6.5"/>
      <rect x="35" y="39" width="90" height="82" rx="${innerRadius}" stroke-width="2.4" opacity="0.76"/>
    `;
  }

  if (normalizedShape === "triangle") {
    return `
      <path d="M80 20 143 130H17L80 20z" stroke-width="6.5"/>
      <path d="M80 38 125 118H35L80 38z" stroke-width="2.4" opacity="0.76"/>
    `;
  }

  if (normalizedShape === "star") {
    return `
      <path d="M80 15 97 55 140 58 107 87 117 130 80 107 43 130 53 87 20 58 63 55 80 15z" stroke-width="6.5"/>
      <path d="M80 34 92 63 124 66 99 87 107 118 80 101 53 118 61 87 36 66 68 63 80 34z" stroke-width="2.4" opacity="0.76"/>
    `;
  }

  return `
    <circle cx="80" cy="80" r="71" stroke-width="6.5"/>
    <circle cx="80" cy="80" r="61" stroke-width="2.4" opacity="0.76"/>
  `;
};

const renderFill = (shape: StampShape, cornerRadius: number): string => {
  const normalizedShape = normalizeShape(shape);

  if (shape === "ticket") {
    return '<path class="stampy-fill" d="M43 48h74a5 5 0 0 1 5 5v54a5 5 0 0 1-5 5H43a5 5 0 0 1-5-5V53a5 5 0 0 1 5-5z" fill="currentColor" stroke="none"/>';
  }

  if (normalizedShape === "square") {
    const radius = String(Math.max(0, cornerRadius - 10));
    return `<rect class="stampy-fill" x="42" y="48" width="76" height="64" rx="${radius}" fill="currentColor" stroke="none"/>`;
  }

  if (normalizedShape === "triangle") {
    return '<path class="stampy-fill" d="M80 49 113 108H47L80 49z" fill="currentColor" stroke="none"/>';
  }

  if (normalizedShape === "star") {
    return '<path class="stampy-fill" d="M80 48 90 70 114 72 96 88 101 112 80 99 59 112 64 88 46 72 70 70 80 48z" fill="currentColor" stroke="none"/>';
  }

  return '<circle class="stampy-fill" cx="80" cy="80" r="56" fill="currentColor" stroke="none"/>';
};

export const normalizeStampDesign = (design: StampDesign = {}) => {
  const normalized = {
    ...defaultStampDesign,
    ...Object.fromEntries(
      Object.entries(design).filter(([, value]) => hasValue(value)),
    ),
    id: safeId(design.id ?? defaultStampDesign.id),
    shape: normalizeShape(design.shape ?? defaultStampDesign.shape),
    cornerRadius: clamp(
      design.cornerRadius ?? defaultStampDesign.cornerRadius,
      0,
      32,
    ),
    inkOpacity: clamp(design.inkOpacity ?? defaultStampDesign.inkOpacity, 0, 1),
    distress: clamp(design.distress ?? defaultStampDesign.distress, 0, 1),
    roughen: clamp(design.roughen ?? defaultStampDesign.roughen, 0, 8),
    rotate: clamp(design.rotate ?? defaultStampDesign.rotate, -360, 360),
  };

  return normalized as Required<StampDesign>;
};

export const renderStampSvg = (design: StampDesign = {}): string => {
  const stamp = normalizeStampDesign(design);
  const roughenId = `${stamp.id}-roughen`;
  const distressId = `${stamp.id}-distress`;
  const fillColor = escapeText(stamp.paper);
  const mainText = escapeText(stamp.mainText);
  const subText = escapeText(stamp.subText);
  const dateText = escapeText(stamp.dateText);
  const iconPath = iconPathByName[stamp.icon];
  const distressOpacity = String(stamp.distress);

  const inkColor = applyOpacity(stamp.ink, stamp.inkOpacity);

  return `<svg class="stampy-svg" viewBox="0 0 160 160" role="img" aria-label="${mainText} stamp" xmlns="http://www.w3.org/2000/svg" style="color:${escapeText(inkColor)}">
  <defs>
    <filter id="${roughenId}" x="-12%" y="-12%" width="124%" height="124%">
      <feTurbulence type="fractalNoise" baseFrequency="0.064" numOctaves="4" seed="7" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="${stamp.roughen}" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <mask id="${distressId}" maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160" mask-type="luminance">
      <rect width="160" height="160" fill="white"/>
      <g fill="black" stroke="black" stroke-linecap="round" opacity="${distressOpacity}">
        <ellipse cx="37" cy="37" rx="5.8" ry="2.8"/>
        <ellipse cx="56" cy="47" rx="3.4" ry="1.8"/>
        <ellipse cx="101" cy="38" rx="6.6" ry="2.5"/>
        <ellipse cx="119" cy="59" rx="4.2" ry="2"/>
        <ellipse cx="36" cy="83" rx="4.6" ry="2.2"/>
        <ellipse cx="86" cy="73" rx="4.5" ry="2"/>
        <ellipse cx="121" cy="102" rx="7.2" ry="2.8"/>
        <ellipse cx="50" cy="119" rx="7.2" ry="2.8"/>
        <ellipse cx="109" cy="132" rx="6.2" ry="2.7"/>
        <path d="M28 57c12 3 22-4 34 0M91 54c18-4 28 5 41 1M37 101c22-3 36 5 54 1M65 112c18-5 35 3 51-1" fill="none" stroke-width="3.4"/>
      </g>
    </mask>
  </defs>
  <g class="stampy-ink" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" filter="url(#${roughenId})" mask="url(#${distressId})" transform="rotate(${stamp.rotate} 80 80)">
    ${renderShape(stamp.shape, stamp.cornerRadius)}
    ${renderFill(stamp.shape, stamp.cornerRadius)}
    ${iconPath ? `<path class="stampy-icon" d="${iconPath}" fill="none" stroke="${fillColor}" stroke-width="5" opacity="0.28"/>` : ""}
    <text class="stampy-date" x="80" y="63" fill="${fillColor}" stroke="none" text-anchor="middle">${dateText}</text>
    <text class="stampy-main" x="80" y="92" fill="${fillColor}" stroke="none" text-anchor="middle">${mainText}</text>
    <text class="stampy-sub" x="80" y="113" fill="${fillColor}" stroke="none" text-anchor="middle">${subText}</text>
  </g>
</svg>`;
};

export const createStampElement = (design: StampDesign = {}): HTMLElement => {
  const root = document.createElement("span");
  root.className = "stampy-mark";
  root.dataset.stampyMark = "";
  root.innerHTML = renderStampSvg(design);
  return root;
};
