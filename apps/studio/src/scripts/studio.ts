import {
  downloadStampPng,
  downloadStampSvg,
  downloadBlob,
  installStampyAnimations,
  parseStampyProject,
  pressStamp,
  registerStampyElements,
  renderStampSvg,
  serializeStampyProject,
  createStampyProject,
  type StampAnimationPreset,
  type StampDesign,
  type StampyProject,
} from "@stampy/core";

registerStampyElements();
installStampyAnimations();

const stamp = document.querySelector("stampy-mark");
const stampForm = document.querySelector<HTMLFormElement>("[data-stampy-form]");
const animationForm = document.querySelector<HTMLFormElement>(
  "[data-animation-form]",
);
const localeSelect = document.querySelector<HTMLSelectElement>(
  "[data-locale-select]",
);
const themeSelect = document.querySelector<HTMLSelectElement>(
  "[data-theme-select]",
);
const projectNameInput = document.querySelector<HTMLInputElement>(
  "[data-project-name]",
);
const projectImportInput = document.querySelector<HTMLInputElement>(
  "[data-project-import]",
);
const embedCode = document.querySelector<HTMLElement>("[data-embed-code]");
const projectCode = document.querySelector<HTMLElement>("[data-project-code]");
const status = document.querySelector<HTMLElement>("[data-status]");

type Locale = "en" | "ja";
type StudioTheme = "auto" | "light" | "dark";

const messages: Record<Locale, Record<string, string>> = {
  en: {
    heroTitle: "Design stamps and press animations",
    language: "Language",
    theme: "Theme",
    copyEmbed: "Copy embed",
    copyJson: "Copy JSON",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    exportSvg: "Export SVG",
    projectName: "Project",
    stamp: "Stamp",
    mainText: "Main text",
    subText: "Sub text",
    date: "Date",
    shape: "Shape",
    circle: "Circle",
    ticket: "Ticket",
    rounded: "Rounded",
    icon: "Icon",
    steam: "Steam",
    star: "Star",
    spark: "Spark",
    none: "None",
    ink: "Ink",
    paper: "Paper",
    distress: "Distress",
    roughen: "Roughen",
    rotate: "Rotate",
    preview: "Preview",
    ready: "Ready",
    press: "Press",
    animation: "Animation",
    preset: "Preset",
    classicPress: "Classic press",
    bounce: "Bounce",
    inkReveal: "Ink reveal",
    duration: "Duration",
    intensity: "Intensity",
    customAnimatorApi: "Custom animator API",
    embed: "Embed",
    projectData: "Project data",
    animationUpdated: "Animation updated",
    pressed: "Pressed",
    svgExported: "SVG exported",
    pngExported: "PNG exported",
    embedCopied: "Embed copied",
    jsonCopied: "Project JSON copied",
    jsonExported: "Project JSON exported",
    jsonImported: "Project JSON imported",
    jsonImportFailed: "Could not import that JSON",
  },
  ja: {
    heroTitle: "スタンプと押印アニメーションをデザイン",
    language: "言語",
    theme: "テーマ",
    copyEmbed: "埋め込みをコピー",
    copyJson: "JSONをコピー",
    exportJson: "JSONを書き出し",
    importJson: "JSONを読み込み",
    exportSvg: "SVGを書き出し",
    projectName: "プロジェクト",
    stamp: "スタンプ",
    mainText: "メイン文言",
    subText: "サブ文言",
    date: "日付",
    shape: "形状",
    circle: "円形",
    ticket: "チケット",
    rounded: "角丸",
    icon: "アイコン",
    steam: "湯気",
    star: "星",
    spark: "きらめき",
    none: "なし",
    ink: "インク",
    paper: "紙色",
    distress: "かすれ",
    roughen: "にじみ",
    rotate: "傾き",
    preview: "プレビュー",
    ready: "準備完了",
    press: "押す",
    animation: "アニメーション",
    preset: "プリセット",
    classicPress: "定番の押印",
    bounce: "バウンス",
    inkReveal: "インク表示",
    duration: "時間",
    intensity: "強さ",
    customAnimatorApi: "独自アニメーションAPI",
    embed: "埋め込み",
    projectData: "プロジェクトデータ",
    animationUpdated: "アニメーションを更新しました",
    pressed: "押印しました",
    svgExported: "SVGを書き出しました",
    pngExported: "PNGを書き出しました",
    embedCopied: "埋め込みコードをコピーしました",
    jsonCopied: "プロジェクトJSONをコピーしました",
    jsonExported: "プロジェクトJSONを書き出しました",
    jsonImported: "プロジェクトJSONを読み込みました",
    jsonImportFailed: "JSONを読み込めませんでした",
  },
};

let locale: Locale = "en";
let theme: StudioTheme = "auto";

const translate = (key: string): string => messages[locale][key] ?? key;

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
    icon: getFormValue(stampForm, "icon") as StampDesign["icon"],
    ink: getFormValue(stampForm, "ink"),
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

const getProject = (): StampyProject =>
  createStampyProject({
    name: projectNameInput?.value,
    locale,
    theme,
    stamp: getDesign(),
    animation: getAnimation(),
  });

const setStatus = (message: string): void => {
  if (status) status.textContent = message;
};

const setStatusKey = (key: string): void => {
  setStatus(translate(key));
};

const applyLocale = (nextLocale: Locale): void => {
  locale = nextLocale;
  document.documentElement.lang = nextLocale;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (!key) return;
    element.textContent = translate(key);
  });
  updateEmbedCode(getDesign());
  updateProjectCode(getProject());
};

const resolveTheme = (value: StudioTheme): "light" | "dark" => {
  if (value !== "auto") return value;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (nextTheme: StudioTheme): void => {
  theme = nextTheme;
  const resolvedTheme = resolveTheme(nextTheme);
  document.body.dataset.theme = resolvedTheme;
  document.documentElement.style.colorScheme = resolvedTheme;
  updateEmbedCode(getDesign());
  updateProjectCode(getProject());
};

const updateEmbedCode = (design: StampDesign): void => {
  if (!embedCode) return;

  embedCode.textContent = `<style>
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
  icon="${design.icon}"
  ink="${design.ink}"
  paper="${design.paper}"
></stampy-mark>`;
};

const updateProjectCode = (project: StampyProject): void => {
  if (!projectCode) return;
  projectCode.textContent = serializeStampyProject(project);
};

const setFormValue = (form: HTMLFormElement, name: string, value: string): void => {
  const field = form.elements.namedItem(name);
  if (
    field instanceof HTMLInputElement ||
    field instanceof HTMLSelectElement ||
    field instanceof HTMLTextAreaElement
  ) {
    field.value = value;
    field.dispatchEvent(new Event("input", { bubbles: true }));
  }
};

const applyProject = (project: StampyProject): void => {
  if (projectNameInput) projectNameInput.value = project.name;
  if (localeSelect) localeSelect.value = project.locale;
  if (themeSelect) themeSelect.value = project.theme;

  if (stampForm) {
    setFormValue(stampForm, "mainText", project.stamp.mainText);
    setFormValue(stampForm, "subText", project.stamp.subText);
    setFormValue(stampForm, "dateText", project.stamp.dateText);
    setFormValue(stampForm, "shape", project.stamp.shape);
    setFormValue(stampForm, "icon", project.stamp.icon);
    setFormValue(stampForm, "ink", project.stamp.ink);
    setFormValue(stampForm, "paper", project.stamp.paper);
    setFormValue(stampForm, "distress", String(project.stamp.distress));
    setFormValue(stampForm, "roughen", String(project.stamp.roughen));
    setFormValue(stampForm, "rotate", String(project.stamp.rotate));
  }

  if (animationForm) {
    setFormValue(animationForm, "preset", project.animation.preset);
    setFormValue(animationForm, "durationMs", String(project.animation.durationMs));
    setFormValue(animationForm, "intensity", String(project.animation.intensity));
  }

  applyLocale(project.locale);
  applyTheme(project.theme);
  updatePreview();
  updateProjectCode(project);
};

const updatePreview = (): void => {
  const design = getDesign();
  if (stamp) {
    Object.entries({
      "main-text": design.mainText,
      "sub-text": design.subText,
      "date-text": design.dateText,
      shape: design.shape,
      icon: design.icon,
      ink: design.ink,
      paper: design.paper,
      distress: design.distress,
      roughen: design.roughen,
      rotate: design.rotate,
    }).forEach(([name, value]) => {
      stamp.setAttribute(name, String(value));
    });
  }
  updateEmbedCode(design);
  updateProjectCode(getProject());
};

stampForm?.addEventListener("input", updatePreview);
animationForm?.addEventListener("input", () => setStatusKey("animationUpdated"));
projectNameInput?.addEventListener("input", () => updateProjectCode(getProject()));
localeSelect?.addEventListener("change", () => {
  applyLocale(localeSelect.value === "ja" ? "ja" : "en");
  setStatusKey("ready");
});
themeSelect?.addEventListener("change", () => {
  const nextTheme = themeSelect.value as StudioTheme;
  applyTheme(nextTheme);
  setStatusKey("ready");
});
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (theme === "auto") applyTheme("auto");
  });

document.addEventListener("click", async (event) => {
  const button = (event.target as Element | null)?.closest<HTMLButtonElement>(
    "button[data-action]",
  );
  if (!button) return;

  const action = button.dataset.action;
  const design = getDesign();

  if (action === "press") {
    await pressStamp(stamp, getAnimation());
    setStatusKey("pressed");
  }

  if (action === "export-svg") {
    downloadStampSvg(design, "stampy.svg");
    setStatusKey("svgExported");
  }

  if (action === "export-png") {
    await downloadStampPng(design, "stampy.png", 1024);
    setStatusKey("pngExported");
  }

  if (action === "copy-html" && embedCode?.textContent) {
    await navigator.clipboard.writeText(embedCode.textContent);
    setStatusKey("embedCopied");
  }

  if (action === "copy-json" && projectCode?.textContent) {
    await navigator.clipboard.writeText(projectCode.textContent);
    setStatusKey("jsonCopied");
  }

  if (action === "export-json") {
    const blob = new Blob([serializeStampyProject(getProject())], {
      type: "application/json;charset=utf-8",
    });
    downloadBlob(blob, "stampy-project.json");
    setStatusKey("jsonExported");
  }
});

projectImportInput?.addEventListener("change", async () => {
  const file = projectImportInput.files?.[0];
  if (!file) return;

  const project = parseStampyProject(await file.text());
  if (!project) {
    setStatusKey("jsonImportFailed");
    projectImportInput.value = "";
    return;
  }

  applyProject(project);
  setStatusKey("jsonImported");
  projectImportInput.value = "";
});

applyLocale("en");
applyTheme("auto");
updatePreview();

window.addEventListener("stampy:debug-svg", () => {
  console.info(renderStampSvg(getDesign()));
});
