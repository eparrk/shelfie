import { describe, expect, it } from "vitest";
import { addDays, daysBetween } from "../src/utils/dates";
import { T0 } from "./helpers";

describe("dates", () => {
  it("adds whole days", () => {
    expect(addDays(T0, 14).toISOString()).toBe("2026-09-15T10:00:00.000Z");
  });

  it("counts whole days between dates", () => {
    expect(daysBetween(T0, addDays(T0, 3))).toBe(3);
    expect(daysBetween(addDays(T0, 3), T0)).toBe(-3);
  });

  it("drops partial days", () => {
    expect(daysBetween(T0, addDays(T0, 1.5))).toBe(1);
  });
});
