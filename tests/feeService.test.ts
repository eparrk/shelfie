import { describe, expect, it } from "vitest";
import { handlers } from "../src/api/handlers";
import { LATE_FEE_PER_DAY_CENTS, MAX_LATE_FEE_CENTS } from "../src/config";
import { calculateFee, outstandingFees, payFees } from "../src/services/feeService";
import { borrow, returnBook } from "../src/services/loanService";
import { addDays } from "../src/utils/dates";
import { T0, seed } from "./helpers";

describe("feeService", () => {
  it("charges nothing when returned on or before the due date", () => {
    const { store, ada, books } = seed();
    const loan = borrow(store, ada.id, books[0].id, T0);
    expect(calculateFee(loan, addDays(T0, 14))).toBe(0);
  });

  it("charges per day late, counting part of a day as a full day", () => {
    const { store, ada, books } = seed();
    const loan = borrow(store, ada.id, books[0].id, T0);
    expect(calculateFee(loan, addDays(T0, 16))).toBe(2 * LATE_FEE_PER_DAY_CENTS);
    expect(calculateFee(loan, addDays(T0, 14.1))).toBe(LATE_FEE_PER_DAY_CENTS);
  });

  it("caps the fee per loan", () => {
    const { store, ada, books } = seed();
    const loan = borrow(store, ada.id, books[0].id, T0);
    expect(calculateFee(loan, addDays(T0, 400))).toBe(MAX_LATE_FEE_CENTS);
  });

  it("records the fee on return and tracks the balance", () => {
    const { store, ada, books } = seed();
    const loan = borrow(store, ada.id, books[0].id, T0);
    returnBook(store, loan.id, addDays(T0, 18));
    expect(loan.feeCents).toBe(4 * LATE_FEE_PER_DAY_CENTS);
    expect(outstandingFees(store, ada.id)).toBe(100);
  });

  it("blocks borrowing above the threshold until fees are paid", () => {
    const { store, ada, books } = seed();
    const loan = borrow(store, ada.id, books[0].id, T0);
    returnBook(store, loan.id, addDays(T0, 60));
    expect(() => borrow(store, ada.id, books[1].id, T0)).toThrow(/late fees/);
    expect(handlers(store).borrow(ada.id, books[1].id).status).toBe(402);
    expect(payFees(store, ada.id)).toBe(MAX_LATE_FEE_CENTS);
    expect(() => borrow(store, ada.id, books[1].id, T0)).not.toThrow();
  });
});
