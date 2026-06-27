import {
  defaultStampDesign,
  normalizeStampDesign,
  type StampDesign,
} from "./stamp-design";
import type { StampAnimationPreset } from "./animation";

export const STAMPY_PROJECT_SCHEMA_VERSION = 1;

export type StampyLocale = "en" | "ja";
export type StampyTheme = "auto" | "light" | "dark";

export type StampAnimationDesign = {
  preset?: StampAnimationPreset;
  durationMs?: number;
  intensity?: number;
};

export type StampyProject = {
  schemaVersion: typeof STAMPY_PROJECT_SCHEMA_VERSION;
  name: string;
  locale: StampyLocale;
  theme: StampyTheme;
  stamp: Required<StampDesign>;
  animation: Required<StampAnimationDesign>;
  updatedAt: string;
};

export type StampyProjectInput = Partial<
  Omit<StampyProject, "schemaVersion" | "stamp" | "animation" | "updatedAt">
> & {
  stamp?: StampDesign;
  animation?: StampAnimationDesign;
  updatedAt?: string;
};

const defaultAnimation = {
  preset: "classic",
  durationMs: 780,
  intensity: 1,
} satisfies Required<StampAnimationDesign>;

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value));

const isLocale = (value: unknown): value is StampyLocale =>
  value === "en" || value === "ja";

const isTheme = (value: unknown): value is StampyTheme =>
  value === "auto" || value === "light" || value === "dark";

const isAnimationPreset = (value: unknown): value is StampAnimationPreset =>
  value === "classic" ||
  value === "bounce" ||
  value === "ink" ||
  value === "none";

export const normalizeStampAnimation = (
  animation: StampAnimationDesign = {},
): Required<StampAnimationDesign> => ({
  preset: isAnimationPreset(animation.preset)
    ? animation.preset
    : defaultAnimation.preset,
  durationMs: clamp(animation.durationMs ?? defaultAnimation.durationMs, 120, 1600),
  intensity: clamp(animation.intensity ?? defaultAnimation.intensity, 0.4, 1.8),
});

export const createStampyProject = (
  input: StampyProjectInput = {},
  now = new Date().toISOString(),
): StampyProject => ({
  schemaVersion: STAMPY_PROJECT_SCHEMA_VERSION,
  name: input.name?.trim() || "Untitled stamp",
  locale: isLocale(input.locale) ? input.locale : "en",
  theme: isTheme(input.theme) ? input.theme : "auto",
  stamp: normalizeStampDesign(input.stamp ?? defaultStampDesign),
  animation: normalizeStampAnimation(input.animation),
  updatedAt: input.updatedAt ?? now,
});

export const serializeStampyProject = (project: StampyProject): string =>
  JSON.stringify(createStampyProject(project, project.updatedAt), null, 2);

export const parseStampyProject = (
  rawValue: string,
): StampyProject | undefined => {
  try {
    const parsed = JSON.parse(rawValue) as StampyProjectInput & {
      schemaVersion?: unknown;
    };
    if (parsed.schemaVersion !== STAMPY_PROJECT_SCHEMA_VERSION) {
      return undefined;
    }
    return createStampyProject(parsed);
  } catch {
    return undefined;
  }
};
