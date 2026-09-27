import { describe, expect, it } from "vitest";
import { ServiceError } from "../src/services/errors";
import { borrow, returnBook } from "../src/services/loanService";
import { MAX_ACTIVE_LOANS } from "../src/config";
import { handlers } from "../src/api/handlers";
import { T0, seed } from "./helpers";

describe("loanService", () => {
  it("sets a 14-day due date", () => {
    const { store, ada, books } = seed();
    const loan = borrow(store, ada.id, books[0].id, T0);
    expect(loan.dueAt.toISOString()).toBe("2026-09-15T10:00:00.000Z");
  });

  it("refuses a book that is already on loan", () => {
    const { store, ada, books } = seed();
    borrow(store, ada.id, books[0].id, T0);
    expect(() => borrow(store, ada.id, books[0].id, T0)).toThrowError(ServiceError);
  });

  it(`caps members at ${MAX_ACTIVE_LOANS} active loans`, () => {
    const { store, ada, books } = seed();
    for (let i = 0; i < MAX_ACTIVE_LOANS; i++) borrow(store, ada.id, books[i].id, T0);
    expect(() => borrow(store, ada.id, books[3].id, T0)).toThrow(/already has/);
  });

  it("frees the slot after a return", () => {
    const { store, ada, books } = seed();
    const loans = [0, 1, 2].map((i) => borrow(store, ada.id, books[i].id, T0));
    returnBook(store, loans[0].id, T0);
    expect(() => borrow(store, ada.id, books[3].id, T0)).not.toThrow();
  });

  it("maps service errors to status codes in handlers", () => {
    const { store } = seed();
    expect(handlers(store).returnBook("loan_999").status).toBe(404);
  });
});
