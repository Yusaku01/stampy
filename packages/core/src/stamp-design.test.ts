import { describe, expect, it } from "vitest";

import { normalizeStampDesign, renderStampSvg } from "./stamp-design";

describe("renderStampSvg", () => {
  it("escapes user-provided text", () => {
    const svg = renderStampSvg({
      mainText: "<Visited>",
      subText: "A&B",
    });

    expect(svg).toContain("&lt;Visited&gt;");
    expect(svg).toContain("A&amp;B");
    expect(svg).not.toContain("<Visited>");
  });

  it("renders a selected shape", () => {
    const svg = renderStampSvg({ shape: "ticket" });

    expect(svg).toContain("a21 21 0 0 0 0 42");
  });

  it("keeps defaults when optional fields are explicitly undefined", () => {
    const design = normalizeStampDesign({
      mainText: undefined,
      shape: undefined,
    });

    expect(design.mainText).toBe("Visited");
    expect(design.shape).toBe("circle");
  });
});
