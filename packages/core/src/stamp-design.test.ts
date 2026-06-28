import { describe, expect, it } from "vitest";

import { normalizeStampDesign, renderStampSvg } from "./stamp-design.js";

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

  it("renders expanded geometric shapes", () => {
    expect(renderStampSvg({ shape: "square" })).toContain('width="112"');
    expect(renderStampSvg({ shape: "triangle" })).toContain("M80 20 143 130");
    expect(renderStampSvg({ shape: "star" })).toContain("M80 15 97 55");
  });

  it("applies opacity to hex ink colors", () => {
    const svg = renderStampSvg({ ink: "#336699", inkOpacity: 0.5 });

    expect(svg).toContain("rgb(51 102 153 / 0.5)");
  });

  it("allows a full clockwise and counterclockwise rotation", () => {
    expect(normalizeStampDesign({ rotate: 400 }).rotate).toBe(360);
    expect(normalizeStampDesign({ rotate: -400 }).rotate).toBe(-360);
  });

  it("normalizes legacy rounded stamps to square with corner radius", () => {
    const design = normalizeStampDesign({
      shape: "rounded",
      cornerRadius: 99,
    });

    expect(design.shape).toBe("square");
    expect(design.cornerRadius).toBe(32);
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
