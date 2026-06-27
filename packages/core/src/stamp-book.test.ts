import { describe, expect, it } from "vitest";

import { createStampBook, earnStamp, revealStamp } from "./stamp-book";

describe("stamp book", () => {
  it("keeps earned stamps monotonic", () => {
    const state = createStampBook("2026-06-27T00:00:00.000Z");
    const earned = earnStamp(state, "visit:kashiwa", "2026-06-27T01:00:00.000Z");
    const repeated = earnStamp(earned, "visit:kashiwa", "2026-06-27T02:00:00.000Z");
    const revealed = revealStamp(repeated, "visit:kashiwa", "2026-06-27T03:00:00.000Z");

    expect(repeated.stamps["visit:kashiwa"]?.earnedAt).toBe(
      "2026-06-27T01:00:00.000Z",
    );
    expect(revealed.stamps["visit:kashiwa"]?.state).toBe("revealed");
  });
});
