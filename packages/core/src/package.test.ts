import { describe, expect, it } from "vitest";
import {
  createStampyProject,
  registerStampyElements,
  renderStampSvg,
} from "./index.js";

describe("@stampy/core package entry", () => {
  it("can be imported in a Node-like environment", () => {
    const project = createStampyProject({
      stamp: {
        mainText: "Visited",
        subText: "External App",
      },
    });

    expect(renderStampSvg(project.stamp)).toContain("External App");
    expect(() => registerStampyElements()).not.toThrow();
  });
});
