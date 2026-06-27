import { describe, expect, it } from "vitest";

import {
  createStampyProject,
  parseStampyProject,
  serializeStampyProject,
} from "./stamp-project.js";

describe("stamp project", () => {
  it("normalizes design and animation values", () => {
    const project = createStampyProject({
      name: "  Onsen pass  ",
      locale: "ja",
      theme: "dark",
      stamp: {
        mainText: "入湯済",
        roughen: 99,
      },
      animation: {
        preset: "ink",
        durationMs: 9999,
        intensity: 0,
      },
    });

    expect(project.name).toBe("Onsen pass");
    expect(project.locale).toBe("ja");
    expect(project.theme).toBe("dark");
    expect(project.stamp.mainText).toBe("入湯済");
    expect(project.stamp.roughen).toBe(8);
    expect(project.animation.preset).toBe("ink");
    expect(project.animation.durationMs).toBe(1600);
    expect(project.animation.intensity).toBe(0.4);
  });

  it("round trips serialized projects", () => {
    const project = createStampyProject({
      stamp: {
        mainText: "Visited",
      },
    });
    const parsed = parseStampyProject(serializeStampyProject(project));

    expect(parsed?.schemaVersion).toBe(1);
    expect(parsed?.stamp.mainText).toBe("Visited");
  });

  it("rejects invalid json and unsupported versions", () => {
    expect(parseStampyProject("{")).toBeUndefined();
    expect(parseStampyProject('{"schemaVersion":999}')).toBeUndefined();
  });
});
