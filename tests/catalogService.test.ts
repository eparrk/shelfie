import { describe, expect, it } from "vitest";
import { dueSoon, isAvailable, search } from "../src/services/catalogService";
import { borrow } from "../src/services/loanService";
import { addDays } from "../src/utils/dates";
import { T0, seed } from "./helpers";

describe("catalogService", () => {
  it("searches title, author and tags case-insensitively", () => {
    const { store } = seed();
    expect(search(store, "sci-FI").map((b) => b.title)).toEqual(["Dune", "Neuromancer"]);
    expect(search(store, "austen").map((b) => b.title)).toEqual(["Emma"]);
  });

  it("returns everything for an empty query", () => {
    const { store } = seed();
    expect(search(store, "  ")).toHaveLength(4);
  });

  it("marks borrowed books unavailable", () => {
    const { store, ada, books } = seed();
    borrow(store, ada.id, books[0].id, T0);
    expect(isAvailable(store, books[0].id)).toBe(false);
    expect(isAvailable(store, books[1].id)).toBe(true);
  });

  it("flags loans due within two days", () => {
    const { store, ada, books } = seed();
    borrow(store, ada.id, books[0].id, T0);
    expect(dueSoon(store, addDays(T0, 11))).toHaveLength(0);
    expect(dueSoon(store, addDays(T0, 12))).toHaveLength(1);
  });
});
