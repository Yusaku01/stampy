import {
  downloadStampPng,
  downloadStampSvg,
  installStampyAnimations,
  pressStamp,
  registerStampyElements,
  renderStampSvg,
  type StampAnimationPreset,
  type StampDesign,
} from "@stampy/core";

registerStampyElements();
installStampyAnimations();

const stamp = document.querySelector("stampy-mark");
const stampForm = document.querySelector<HTMLFormElement>("[data-stampy-form]");
const animationForm = document.querySelector<HTMLFormElement>(
  "[data-animation-form]",
);
const animationDetails = document.querySelectorAll<HTMLElement>(
  "[data-animation-detail]",
);
const localeButtons = document.querySelectorAll<HTMLButtonElement>(
  "[data-locale-option]",
);
const themeToggle = document.querySelector<HTMLButtonElement>(
  "[data-theme-toggle]",
);
const themeOptions = document.querySelector<HTMLElement>("#theme-options");
const themeOptionButtons = document.querySelectorAll<HTMLButtonElement>(
  "[data-theme-option]",
);
const themeLabel = document.querySelector<HTMLElement>(
  "[data-theme-label]",
);
const embedCode = document.querySelector<HTMLElement>("[data-embed-code]");
const copyLabel = document.querySelector<HTMLElement>("[data-copy-label]");
const exportToggle = document.querySelector<HTMLButtonElement>(
  "[data-export-toggle]",
);
const exportOptions = document.querySelector<HTMLElement>("#export-options");
const rangeNumberInputs = document.querySelectorAll<HTMLInputElement>(
  "[data-range-number]",
);
const viewTabs = document.querySelectorAll<HTMLButtonElement>("[data-view-tab]");
const viewPanels = document.querySelectorAll<HTMLElement>("[data-view-panel]");
const viewActions = document.querySelectorAll<HTMLElement>("[data-view-actions]");
const pressAudio = document.querySelector<HTMLAudioElement>("[data-press-audio]");

type Locale = "en" | "ja";
type StudioTheme = "auto" | "light" | "dark";

const messages: Record<Locale, Record<string, string>> = {
  en: {
    auto: "Auto",
    light: "Light",
    dark: "Dark",
    copyEmbed: "Copy embed",
    copied: "Copied",
    export: "Export",
    stamp: "Stamp",
    mainText: "Main text",
    subText: "Sub text",
    date: "Date",
    shape: "Shape",
    circle: "Circle",
    square: "Square",
    triangle: "Triangle",
    starShape: "Star",
    ticket: "Ticket",
    cornerRadius: "Corner radius",
    icon: "Icon",
    steam: "Steam",
    star: "Star",
    spark: "Spark",
    none: "None",
    ink: "Background color",
    inkOpacity: "Opacity",
    paper: "Text color",
    distress: "Distress",
    roughen: "Roughen",
    rotate: "Rotate",
    preview: "Preview",
    code: "Code",
    press: "Play",
    animeSound: "Animation & Sound",
    preset: "Preset",
    classicPress: "Classic press",
    bounce: "Bounce",
    inkReveal: "Ink reveal",
    duration: "Duration",
    intensity: "Intensity",
    pressSound: "Press sound",
    noSound: "None",
  },
  ja: {
    auto: "自動",
    light: "ライト",
    dark: "ダーク",
    copyEmbed: "埋め込みをコピー",
    copied: "コピー済み",
    export: "書き出し",
    stamp: "スタンプ",
    mainText: "メイン文言",
    subText: "サブ文言",
    date: "日付",
    shape: "形状",
    circle: "円形",
    square: "四角",
    triangle: "三角",
    starShape: "星",
    ticket: "チケット",
    cornerRadius: "角丸",
    icon: "アイコン",
    steam: "湯気",
    star: "星",
    spark: "きらめき",
    none: "なし",
    ink: "背景色",
    inkOpacity: "透明度",
    paper: "文字色",
    distress: "かすれ",
    roughen: "にじみ",
    rotate: "傾き",
    preview: "プレビュー",
    code: "コード",
    press: "再生",
    animeSound: "アニメーションと音",
    preset: "プリセット",
    classicPress: "定番の押印",
    bounce: "バウンス",
    inkReveal: "インク表示",
    duration: "時間",
    intensity: "強さ",
    pressSound: "押印音",
    noSound: "なし",
  },
};

let locale: Locale = "en";
let theme: StudioTheme = "auto";
let isEmbedCopied = false;

const translate = (key: string): string => messages[locale][key] ?? key;

const updateCopyLabel = (): void => {
  if (!copyLabel) return;
  copyLabel.textContent = translate(isEmbedCopied ? "copied" : "copyEmbed");
};

const resetCopyLabel = (): void => {
  isEmbedCopied = false;
  updateCopyLabel();
};

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const formatRangeValue = (name: string, value: string): string => {
  const numberValue = Number(value);
  if (name === "cornerRadius" || name === "durationMs" || name === "rotate") {
    return String(Math.round(numberValue));
  }
  if (name === "intensity") return numberValue.toFixed(1);
  if (name === "inkOpacity") return String(Math.round(numberValue * 100));
  return numberValue.toFixed(2);
};

const updateRangeOutputs = (): void => {
  rangeNumberInputs.forEach((numberInput) => {
    const name = numberInput.dataset.rangeNumber;
    if (!name) return;

    const rangeInput = document.querySelector<HTMLInputElement>(
      `input[name="${name}"]`,
    );
    if (!rangeInput) return;
    numberInput.value = formatRangeValue(name, rangeInput.value);
  });
};

const syncRangeFromNumberInput = (numberInput: HTMLInputElement): void => {
  const name = numberInput.dataset.rangeNumber;
  if (!name) return;

  const rangeInput = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]`,
  );
  if (!rangeInput) return;

  const min = Number(rangeInput.min);
  const max = Number(rangeInput.max);
  const numberValue = Number(numberInput.value);
  if (!Number.isFinite(numberValue)) return;

  const nextValue =
    name === "inkOpacity"
      ? clamp(numberValue / 100, min, max)
      : clamp(numberValue, min, max);

  rangeInput.value = String(nextValue);
  if (rangeInput.form === stampForm) {
    updatePreview();
    return;
  }

  updateRangeOutputs();
  updateAnimationControls();
};

const getFormValue = (form: HTMLFormElement, name: string): string => {
  const value = new FormData(form).get(name);
  return typeof value === "string" ? value : "";
};

const getDesign = (): StampDesign => {
  if (!stampForm) return {};

  return {
    id: "studio-stamp",
    mainText: getFormValue(stampForm, "mainText"),
    subText: getFormValue(stampForm, "subText"),
    dateText: getFormValue(stampForm, "dateText"),
    shape: getFormValue(stampForm, "shape") as StampDesign["shape"],
    cornerRadius: Number(getFormValue(stampForm, "cornerRadius")),
    icon: getFormValue(stampForm, "icon") as StampDesign["icon"],
    ink: getFormValue(stampForm, "ink"),
    inkOpacity: Number(getFormValue(stampForm, "inkOpacity")),
    paper: getFormValue(stampForm, "paper"),
    distress: Number(getFormValue(stampForm, "distress")),
    roughen: Number(getFormValue(stampForm, "roughen")),
    rotate: Number(getFormValue(stampForm, "rotate")),
  };
};

const getAnimation = () => {
  if (!animationForm) {
    return {
      preset: "classic" as StampAnimationPreset,
      durationMs: 780,
      intensity: 1,
    };
  }

  return {
    preset: getFormValue(animationForm, "preset") as StampAnimationPreset,
    durationMs: Number(getFormValue(animationForm, "durationMs")),
    intensity: Number(getFormValue(animationForm, "intensity")),
  };
};

const updateAnimationControls = (): void => {
  const isPresetNone = getAnimation().preset === "none";
  animationDetails.forEach((detail) => {
    detail.hidden = isPresetNone;
  });
};

const applyLocale = (nextLocale: Locale): void => {
  locale = nextLocale;
  document.documentElement.lang = nextLocale;
  localeButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.localeOption === nextLocale),
    );
  });
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    element.textContent = translate(key);
  });
  updateCopyLabel();
  updateEmbedCode(getDesign());
};

const resolveTheme = (value: StudioTheme): "light" | "dark" => {
  if (value !== "auto") return value;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (nextTheme: StudioTheme): void => {
  theme = nextTheme;
  if (themeLabel) themeLabel.textContent = translate(nextTheme);
  themeOptionButtons.forEach((button) => {
    button.setAttribute(
      "aria-checked",
      String(button.dataset.themeOption === nextTheme),
    );
  });
  const resolvedTheme = resolveTheme(nextTheme);
  document.body.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
  updateEmbedCode(getDesign());
};

const updateEmbedCode = (design: StampDesign): void => {
  if (!embedCode) return;

  const nextEmbedCode = `<style>
  stampy-mark {
    --stampy-size: 160px;
  }

  @media (prefers-color-scheme: dark) {
    stampy-mark {
      color-scheme: dark;
    }
  }
</style>

<stampy-mark
  main-text="${design.mainText}"
  sub-text="${design.subText}"
  date-text="${design.dateText}"
  shape="${design.shape}"
  corner-radius="${design.cornerRadius}"
  icon="${design.icon}"
  ink="${design.ink}"
  ink-opacity="${design.inkOpacity}"
  paper="${design.paper}"
></stampy-mark>`;

  if (embedCode.textContent && embedCode.textContent !== nextEmbedCode) {
    resetCopyLabel();
  }
  embedCode.textContent = nextEmbedCode;
};

const updatePreview = (): void => {
  const design = getDesign();
  if (stamp) {
    Object.entries({
      "main-text": design.mainText,
      "sub-text": design.subText,
      "date-text": design.dateText,
      shape: design.shape,
      "corner-radius": design.cornerRadius,
      icon: design.icon,
      ink: design.ink,
      "ink-opacity": design.inkOpacity,
      paper: design.paper,
      distress: design.distress,
      roughen: design.roughen,
      rotate: design.rotate,
    }).forEach(([name, value]) => {
      stamp.setAttribute(name, String(value));
    });
  }
  updateRangeOutputs();
  updateEmbedCode(design);
};

const setView = (nextView: string): void => {
  viewTabs.forEach((tab) => {
    const isSelected = tab.dataset.viewTab === nextView;
    tab.setAttribute("aria-selected", String(isSelected));
  });

  viewPanels.forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== nextView;
  });

  viewActions.forEach((actions) => {
    actions.hidden = actions.dataset.viewActions !== nextView;
  });

  if (nextView === "code") resetCopyLabel();
};

const playPressSound = async (): Promise<void> => {
  if (!pressAudio?.currentSrc) return;
  pressAudio.currentTime = 0;
  await pressAudio.play().catch(() => undefined);
};

const setExportMenuOpen = (isOpen: boolean): void => {
  if (!exportToggle || !exportOptions) return;
  exportToggle.setAttribute("aria-expanded", String(isOpen));
  exportOptions.hidden = !isOpen;
};

const setThemeMenuOpen = (isOpen: boolean): void => {
  if (!themeToggle || !themeOptions) return;
  themeToggle.setAttribute("aria-expanded", String(isOpen));
  themeOptions.hidden = !isOpen;
};

stampForm?.addEventListener("input", updatePreview);
animationForm?.addEventListener("input", () => {
  updateRangeOutputs();
  updateAnimationControls();
});
rangeNumberInputs.forEach((input) => {
  input.addEventListener("input", () => {
    syncRangeFromNumberInput(input);
  });
});
localeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyLocale(button.dataset.localeOption === "ja" ? "ja" : "en");
  });
});
themeToggle?.addEventListener("click", () => {
  setThemeMenuOpen(themeOptions?.hidden ?? true);
  setExportMenuOpen(false);
});
themeOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme((button.dataset.themeOption ?? "auto") as StudioTheme);
    setThemeMenuOpen(false);
  });
});
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (theme === "auto") applyTheme("auto");
  });
viewTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setView(tab.dataset.viewTab ?? "preview");
  });
  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const tabs = Array.from(viewTabs);
    const currentIndex = tabs.indexOf(tab);
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = tabs.at((currentIndex + offset + tabs.length) % tabs.length);
    nextTab?.focus();
    setView(nextTab?.dataset.viewTab ?? "preview");
  });
});
exportToggle?.addEventListener("click", () => {
  setExportMenuOpen(exportOptions?.hidden ?? true);
  setThemeMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!exportOptions?.hidden) {
    setExportMenuOpen(false);
    exportToggle?.focus();
  }
  if (!themeOptions?.hidden) {
    setThemeMenuOpen(false);
    themeToggle?.focus();
  }
});

document.addEventListener("click", async (event) => {
  const target = event.target as Element | null;
  if (!target?.closest("[data-theme-toggle], #theme-options")) {
    setThemeMenuOpen(false);
  }
  if (!target?.closest("[data-export-toggle], #export-options")) {
    setExportMenuOpen(false);
  }

  const button = target?.closest<HTMLButtonElement>("button[data-action]");
  if (!button) return;

  if (button.dataset.action === "copy-html" && embedCode?.textContent) {
    await navigator.clipboard.writeText(embedCode.textContent);
    isEmbedCopied = true;
    updateCopyLabel();
    return;
  }

  const action = button.dataset.action;
  const design = getDesign();

  if (action === "press") {
    await pressStamp(stamp, getAnimation());
    await playPressSound();
  }

  if (action === "export-svg") {
    downloadStampSvg(design, "stampy.svg");
    setExportMenuOpen(false);
  }

  if (action === "export-png") {
    await downloadStampPng(design, "stampy.png", 1024);
    setExportMenuOpen(false);
  }
});

applyLocale("en");
applyTheme("auto");
setView("preview");
updatePreview();
updateAnimationControls();

window.addEventListener("stampy:debug-svg", () => {
  console.info(renderStampSvg(getDesign()));
});
